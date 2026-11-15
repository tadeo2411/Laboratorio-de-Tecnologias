// aca va la logica de negocio. Genera id y llama a repository
import ordenesRepository from './ordenes.repository.js'
import vehiculosService from '../vehiculos/vehiculos.service.js'
import turnosService from '../turnos/turnos.service.js'
import repuestosService from '../repuestos/repuestos.service.js'
import trabajosService from '../trabajos/trabajos.service.js'
import authService from '../auth/auth.service.js'
import { httpError } from '../../utils/httpError.js'
import clientesService from '../clientes/clientes.service.js'
import presupuestosService from '../presupuestos/presupuestos.service.js'

const TRANSICIONES = {
    RECIBIDO: ['DIAGNOSTICANDO', 'CANCELADO'],
    DIAGNOSTICANDO: ['ESPERANDO_APROBACION_PRESUPUESTO', 'CANCELADO'],
    ESPERANDO_APROBACION_PRESUPUESTO: ['ESPERANDO_REPUESTO', 'EN_REPARACION', 'CANCELADO'],
    ESPERANDO_REPUESTO: ['EN_REPARACION', 'CANCELADO'],
    EN_REPARACION: ['TERMINADO', 'ESPERANDO_REPUESTO', 'CANCELADO'],
    TERMINADO: ['ENTREGADO'],
    ENTREGADO: [],
    CANCELADO: []
}

const ESTADOS_CON_TRABAJOS = ['DIAGNOSTICANDO', 'ESPERANDO_REPUESTO', 'EN_REPARACION']
const ESTADOS_QUE_EXIGEN_PRESUPUESTO = ['ESPERANDO_REPUESTO', 'EN_REPARACION']
const MESES_HASTA_PROXIMO_SERVICE = 6
const CONFORMIDADES = ['PENDIENTE', 'APROBADA']

function validarId(valor, nombre) {
    const id = Number(valor)
    if (!Number.isInteger(id) || id <= 0) {
        throw httpError(400, `El ${nombre} tiene que ser un número entero positivo`)
    }
    return id
}

function esEstadoValido(estado) {
    return Object.hasOwn(TRANSICIONES, estado)
}

function esEstadoFinal(estado) {
    return TRANSICIONES[estado].length === 0
}

function puedeCambiarEstado(actual, nuevo) {
    return TRANSICIONES[actual].includes(nuevo)
}

function permiteModificarTrabajos(estado) {
    return ESTADOS_CON_TRABAJOS.includes(estado)
}

function permiteFichaDeEgreso(estado) {
    return estado === 'TERMINADO' || puedeCambiarEstado(estado, 'TERMINADO')
}

function exigirOrdenAbierta(orden) {
    if (esEstadoFinal(orden.estado)) {
        throw httpError(409, `La orden está ${orden.estado} y ya no se puede modificar`)
    }
}

function validarBooleano(valor, campo) {
    if (valor !== undefined && typeof valor !== 'boolean') {
        throw httpError(400, `${campo} tiene que ser true o false`)
    }
}

function validarDiagnostico(valor) {
    if (valor === undefined || valor === null) return
    if (typeof valor !== 'string' || valor.length > 500) {
        throw httpError(400, 'El diagnóstico tiene que ser un texto de hasta 500 caracteres')
    }
}

async function listarOrdenes(filtros) {
    let ordenes = await ordenesRepository.listarOrdenes()


    const vehiculo = filtros.vehiculoId ? await vehiculosService.buscar(filtros.vehiculoId) : null
    const cliente = filtros.clienteId ? await clientesService.buscar(filtros.clienteId) : null

    if (filtros.estado) {
        ordenes = ordenes.filter((orden) => orden.estado === filtros.estado)
    }
    if (vehiculo) {
        ordenes = ordenes.filter((orden) => orden.vehiculoId === vehiculo.id)
    }
    if (cliente) {
        ordenes = ordenes.filter((orden) => orden.clienteId === cliente.id)
    }
    return ordenes
}

async function obtenerOrden(id) {
    const ordenId = validarId(id, 'id de la orden')
    const orden = await ordenesRepository.buscarPorId(ordenId)
    if(!orden){
        throw httpError(404, `No existe la orden ${ordenId}`)
    }
    return orden
}

async function crearOrden(datos) {

    validarDiagnostico(datos.diagnostico)
    validarBooleano(datos.esService, 'esService')
    validarBooleano(datos.esUrgencia, 'esUrgencia')
    if (!datos.fichaIngreso) {
        throw httpError(400, 'Falta la ficha de ingreso')
    }
    const fichaIngreso = armarFicha('INGRESO', datos.fichaIngreso)

    const vehiculo = await vehiculosService.buscar(datos.vehiculoId)
    const cliente = await clientesService.buscar(datos.clienteId)

    const turnoId = datos.turnoId ?? null
    if (turnoId !== null && !(await turnosService.buscar(turnoId))) {
        throw httpError(400, `No existe el turno ${turnoId}`)
    }

    const ordenAbierta = await ordenesRepository.buscarAbiertaPorVehiculo(vehiculo.id)
    if (ordenAbierta) {
        throw httpError(409, `El vehículo ${vehiculo.patente} ya tiene abierta la orden ${ordenAbierta.id}`)
    }

    await vehiculosService.asociarDueno(vehiculo.id, cliente.id)

    const id = await ordenesRepository.crear({
        idCliente: cliente.id,
        idVehiculo: vehiculo.id,
        turnoId,
        diagnostico: datos.diagnostico?.trim() || null,
        esService: datos.esService ?? false,
        esUrgencia: datos.esUrgencia ?? false
    })
    await ordenesRepository.crearFicha(id, fichaIngreso)
    return ordenesRepository.buscarPorId(id)
}

async function actualizarOrden(idRecibido, datos) {
    if (datos.estado !== undefined) {
        throw httpError(400, 'Para cambiar el estado usá PATCH /api/ordenes/:id/estado')
    }
    validarDiagnostico(datos.diagnostico)
    validarBooleano(datos.esService, 'esService')
    validarBooleano(datos.esUrgencia, 'esUrgencia')
    const orden = await obtenerOrden(idRecibido)
    exigirOrdenAbierta(orden)

    const cambios = {}
    if (datos.diagnostico !== undefined) cambios.diagnostico = datos.diagnostico?.trim() || null
    if (datos.esService !== undefined) cambios.esService = datos.esService
    if (datos.esUrgencia !== undefined) cambios.esUrgencia = datos.esUrgencia

    // Cambiar el cliente lo deja también como dueño del vehículo, igual que al crear la orden.
    if (datos.clienteId !== undefined && datos.clienteId !== orden.clienteId) {
        const cliente = await clientesService.buscar(datos.clienteId)
        await vehiculosService.asociarDueno(orden.vehiculoId, cliente.id)
        cambios.clienteId = cliente.id
    }

    await ordenesRepository.actualizar(orden.id, {...orden,...cambios})
    return ordenesRepository.buscarPorId(orden.id)
}

async function cambiarEstado(idRecibido, estadoNuevo) {
    if (!esEstadoValido(estadoNuevo)) {
        throw httpError(400, `"${estadoNuevo}" no es un estado de orden válido`)
    }
    const orden = await obtenerOrden(idRecibido)
    exigirOrdenAbierta(orden)

    if (!puedeCambiarEstado(orden.estado, estadoNuevo)) {
        throw httpError(409, `No se puede pasar de ${orden.estado} a ${estadoNuevo}`)
    }
    if (estadoNuevo === 'ENTREGADO' && !orden.fichas.some((ficha) => ficha.tipo === 'EGRESO')) {
        throw httpError(409, 'Para entregar el vehículo primero hay que cargar la ficha de egreso')
    }
    const saleDeLaAprobacion = orden.estado === 'ESPERANDO_APROBACION_PRESUPUESTO'
    if (saleDeLaAprobacion && ESTADOS_QUE_EXIGEN_PRESUPUESTO.includes(estadoNuevo)
        && !(await presupuestosService.tieneAprobado(orden.id))) {
        throw httpError(409, 'Para empezar la reparación primero hace falta un presupuesto aprobado por el cliente')
    }

    await ordenesRepository.actualizarEstado(orden.id, estadoNuevo)
    if (estadoNuevo === 'CANCELADO') {
        await presupuestosService.cancelarPendientes(orden.id)
    }
    if (estadoNuevo === 'ENTREGADO' && orden.esService) {
        await vehiculosService.programarAviso(orden.vehiculoId, MESES_HASTA_PROXIMO_SERVICE)
    }
    return ordenesRepository.buscarPorId(orden.id)
}

function validarItemsFicha(items) {
    if (!Array.isArray(items) || items.length === 0) {
        throw httpError(400, 'La ficha tiene que tener al menos un ítem')
    }
    for (const item of items) {
        const conceptoValido = typeof item?.concepto === 'string' && item.concepto.trim()
        const valorValido = typeof item?.valor === 'string' && item.valor.trim()
        if (!conceptoValido || !valorValido) {
            throw httpError(400, 'Cada ítem de la ficha necesita concepto y valor')
        }
    }
}

function armarFicha(tipo, datos) {
    if (!Number.isInteger(datos.kilometraje) || datos.kilometraje < 0) {
        throw httpError(400, 'El kilometraje tiene que ser un número entero mayor o igual a 0')
    }
    const conformidad = datos.conformidad ?? 'PENDIENTE'
    if (!CONFORMIDADES.includes(conformidad)) {
        throw httpError(400, 'La conformidad tiene que ser PENDIENTE o APROBADA')
    }
    validarItemsFicha(datos.items)
    return {
        tipo,
        kilometraje: datos.kilometraje,
        conformidad,
        items: datos.items.map((item) => ({ concepto: item.concepto.trim(), valor: item.valor.trim() }))
    }
}

async function agregarFicha(idRecibido, datos) {
    const ficha = armarFicha('EGRESO', datos)
    const orden = await obtenerOrden(idRecibido)
    exigirOrdenAbierta(orden)

    if (orden.fichas.some((fichaActual) => fichaActual.tipo === 'EGRESO')) {
        throw httpError(409, 'La orden ya tiene ficha de EGRESO')
    }
    const ingreso = orden.fichas.find((fichaActual) => fichaActual.tipo === 'INGRESO')
    if (!ingreso) {
        throw httpError(409, 'Primero hay que cargar la ficha de ingreso')
    }
    if (!permiteFichaDeEgreso(orden.estado)) {
        throw httpError(409, 'La ficha de egreso se carga cuando la orden está en reparación o terminada')
    }
    if (ficha.kilometraje < ingreso.kilometraje) {
        throw httpError(400, `El kilometraje de egreso no puede ser menor al de ingreso (${ingreso.kilometraje})`)
    }

    await ordenesRepository.crearFicha(orden.id, ficha)
    return ordenesRepository.buscarPorId(orden.id)
}

function exigirTrabajosModificables(orden) {
    if (!permiteModificarTrabajos(orden.estado)) {
        throw httpError(409, `Con la orden en ${orden.estado} no se pueden modificar los trabajos`)
    }
}

async function validarOrdenParaTrabajos(id) {
    const orden = await obtenerOrden(id)
    exigirTrabajosModificables(orden)
    return orden
}

async function armarRepuestosUsados(repuestosPedidos) {
    if (!Array.isArray(repuestosPedidos)) {
        throw httpError(400, 'repuestos tiene que ser una lista')
    }
    const ids = repuestosPedidos.map((repuesto) => repuesto?.repuestoId)
    if (new Set(ids).size !== ids.length) {
        throw httpError(400, 'Hay repuestos repetidos: sumá las cantidades en un solo renglón')
    }

    return Promise.all(repuestosPedidos.map(async (pedido) => {
        const repuestoId = validarId(pedido.repuestoId, 'id del repuesto')
        const repuesto = await repuestosService.buscar(repuestoId)
        if (!repuesto) {
            throw httpError(400, `No existe el repuesto ${pedido.repuestoId}`)
        }
        if (typeof pedido.cantidad !== 'number' || pedido.cantidad <= 0) {
            throw httpError(400, `La cantidad de ${repuesto.nombre} tiene que ser mayor a 0`)
        }
        return {
            repuestoId: repuesto.id,
            nombre: repuesto.nombre,
            cantidad: pedido.cantidad,
            precioUnitario: Number(repuesto.precio_estandar)
        }
    }))
}

async function armarEmpleados(empleadoIds) {
    if (!Array.isArray(empleadoIds)) {
        throw httpError(400, 'empleadoIds tiene que ser una lista')
    }
    const activos = await authService.obtenerEmpleadosActivos()

    return empleadoIds.map((idEmpleado) => {
        const empleado = activos.find((activo) => activo.id === idEmpleado)
        if (!empleado) {
            throw httpError(400, `El empleado ${idEmpleado} no existe o está dado de baja`)
        }
        return empleado
    })
}

async function agregarTrabajo(idRecibido, datos) {
    const orden = await obtenerOrden(idRecibido)
    exigirTrabajosModificables(orden)

    const tipoTrabajoId = validarId(datos.tipoTrabajoId, 'id del tipo de trabajo')
    const tipo = await trabajosService.buscarTipoTrabajo(tipoTrabajoId)
    if (!tipo || !tipo.activo) {
        throw httpError(400, 'Elegí un tipo de trabajo válido')
    }

    const manoDeObra = datos.manoDeObra ?? Number(tipo.precio_estandar)
    if (typeof manoDeObra !== 'number' || manoDeObra < 0) {
        throw httpError(400, 'La mano de obra tiene que ser un número mayor o igual a 0')
    }
    if (datos.descripcion !== undefined && datos.descripcion !== null && typeof datos.descripcion !== 'string') {
        throw httpError(400, 'La descripción tiene que ser un texto')
    }

    const empleados = await armarEmpleados(datos.empleadoIds ?? [])
    const repuestos = await armarRepuestosUsados(datos.repuestos ?? [])

    await ordenesRepository.crearTrabajo(orden.id, {
        tipoTrabajoId: tipo.id,
        descripcion: datos.descripcion?.trim() || null,
        manoDeObra,
        repuestos,
        empleados
    })
    return ordenesRepository.buscarPorId(orden.id)
}

async function quitarTrabajo(idRecibido, idTrabajoRecibido) {
    const idTrabajo = validarId(idTrabajoRecibido, 'id del trabajo')
    const orden = await obtenerOrden(idRecibido)
    exigirTrabajosModificables(orden)

    if (!orden.trabajos.some((trabajo) => trabajo.id === idTrabajo)) {
        throw httpError(404, `La orden ${orden.id} no tiene el trabajo ${idTrabajo}`)
    }

    await ordenesRepository.eliminarTrabajo(idTrabajo)
    return ordenesRepository.buscarPorId(orden.id)
}

export default {
    listarOrdenes,
    obtenerOrden,
    crearOrden,
    actualizarOrden,
    cambiarEstado,
    agregarFicha,
    agregarTrabajo,
    quitarTrabajo,
    validarOrdenParaTrabajos
}
