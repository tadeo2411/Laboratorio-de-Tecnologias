// aca va la logica de negocio. Genera id y llama a repository
const ordenesRepository = require('./ordenes.repository')

const ESTADO_INICIAL = 'RECIBIDO'

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
const TIPOS_FICHA = ['INGRESO', 'EGRESO']
const CONFORMIDADES = ['PENDIENTE', 'APROBADA']

function crearError(status, mensaje) {
    const error = new Error(mensaje)
    error.status = status
    return error
}

function validarId(valor, nombre) {
    const id = Number(valor)
    if (!Number.isInteger(id) || id <= 0) {
        throw crearError(400, `El ${nombre} tiene que ser un número entero positivo`)
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

function normalizarPatente(patente) {
    return patente.replace(/\s+/g, '').toUpperCase()
}

function proximoId(lista) {
    return Math.max(0, ...lista.map((elemento) => elemento.id)) + 1
}

function buscarOrden(lista, id) {
    const orden = lista.find((ordenActual) => ordenActual.id === id)
    if (!orden) {
        throw crearError(404, `No existe la orden ${id}`)
    }
    return orden
}

function guardarCambios(lista, ordenActualizada) {
    ordenesRepository.guardarOrdenes(
        lista.map((orden) => orden.id === ordenActualizada.id ? ordenActualizada : orden)
    )
    return ordenActualizada
}

function exigirOrdenAbierta(orden) {
    if (esEstadoFinal(orden.estado)) {
        throw crearError(409, `La orden está ${orden.estado} y ya no se puede modificar`)
    }
}

function validarBooleano(valor, campo) {
    if (valor !== undefined && typeof valor !== 'boolean') {
        throw crearError(400, `${campo} tiene que ser true o false`)
    }
}

function validarDiagnostico(valor) {
    if (valor === undefined || valor === null) return
    if (typeof valor !== 'string' || valor.length > 500) {
        throw crearError(400, 'El diagnóstico tiene que ser un texto de hasta 500 caracteres')
    }
}

function listarOrdenes(filtros) {
    let ordenes = ordenesRepository.obtenerOrdenes()

    if (filtros.estado) {
        ordenes = ordenes.filter((orden) => orden.estado === filtros.estado)
    }
    if (filtros.patente) {
        const patente = normalizarPatente(filtros.patente)
        ordenes = ordenes.filter((orden) => orden.vehiculoPatente.includes(patente))
    }
    return ordenes
}

function obtenerOrden(id) {
    return buscarOrden(ordenesRepository.obtenerOrdenes(), validarId(id, 'id de la orden'))
}

function crearOrden(datos) {
    if (typeof datos.vehiculoPatente !== 'string' || !datos.vehiculoPatente.trim()) {
        throw crearError(400, 'Falta la patente del vehículo')
    }
    validarDiagnostico(datos.diagnostico)
    validarBooleano(datos.esService, 'esService')
    validarBooleano(datos.esUrgencia, 'esUrgencia')

    const patente = normalizarPatente(datos.vehiculoPatente)
    if (!ordenesRepository.existeVehiculo(patente)) {
        throw crearError(400, `No hay ningún vehículo registrado con la patente ${patente}`)
    }

    const turnoId = datos.turnoId ?? null
    if (turnoId !== null && !ordenesRepository.existeTurno(turnoId)) {
        throw crearError(400, `No existe el turno ${turnoId}`)
    }

    const lista = ordenesRepository.obtenerOrdenes()
    const ordenAbierta = lista.find(
        (orden) => orden.vehiculoPatente === patente && !esEstadoFinal(orden.estado)
    )
    if (ordenAbierta) {
        throw crearError(409, `El vehículo ${patente} ya tiene abierta la orden ${ordenAbierta.id}`)
    }

    const nuevaOrden = {
        id: proximoId(lista),
        vehiculoPatente: patente,
        turnoId,
        estado: ESTADO_INICIAL,
        diagnostico: datos.diagnostico?.trim() || null,
        esService: datos.esService ?? false,
        esUrgencia: datos.esUrgencia ?? false,
        createdAt: new Date().toISOString(),
        fichas: [],
        trabajos: []
    }

    ordenesRepository.guardarOrdenes([...lista, nuevaOrden])
    return nuevaOrden
}

function actualizarOrden(idRecibido, datos) {
    const id = validarId(idRecibido, 'id de la orden')
    if (datos.estado !== undefined) {
        throw crearError(400, 'Para cambiar el estado usá PATCH /api/ordenes/:id/estado')
    }
    validarDiagnostico(datos.diagnostico)
    validarBooleano(datos.esService, 'esService')
    validarBooleano(datos.esUrgencia, 'esUrgencia')

    const lista = ordenesRepository.obtenerOrdenes()
    const orden = buscarOrden(lista, id)
    exigirOrdenAbierta(orden)

    const cambios = {}
    if (datos.diagnostico !== undefined) cambios.diagnostico = datos.diagnostico?.trim() || null
    if (datos.esService !== undefined) cambios.esService = datos.esService
    if (datos.esUrgencia !== undefined) cambios.esUrgencia = datos.esUrgencia

    return guardarCambios(lista, { ...orden, ...cambios })
}

function cambiarEstado(idRecibido, estadoNuevo) {
    const id = validarId(idRecibido, 'id de la orden')
    if (!esEstadoValido(estadoNuevo)) {
        throw crearError(400, `"${estadoNuevo}" no es un estado de orden válido`)
    }

    const lista = ordenesRepository.obtenerOrdenes()
    const orden = buscarOrden(lista, id)
    exigirOrdenAbierta(orden)

    if (!puedeCambiarEstado(orden.estado, estadoNuevo)) {
        throw crearError(409, `No se puede pasar de ${orden.estado} a ${estadoNuevo}`)
    }
    if (estadoNuevo === 'ENTREGADO' && !orden.fichas.some((ficha) => ficha.tipo === 'EGRESO')) {
        throw crearError(409, 'Para entregar el vehículo primero hay que cargar la ficha de egreso')
    }

    return guardarCambios(lista, { ...orden, estado: estadoNuevo })
}

function validarItemsFicha(items) {
    if (!Array.isArray(items) || items.length === 0) {
        throw crearError(400, 'La ficha tiene que tener al menos un ítem')
    }
    for (const item of items) {
        const conceptoValido = typeof item?.concepto === 'string' && item.concepto.trim()
        const valorValido = typeof item?.valor === 'string' && item.valor.trim()
        if (!conceptoValido || !valorValido) {
            throw crearError(400, 'Cada ítem de la ficha necesita concepto y valor')
        }
    }
}

function agregarFicha(idRecibido, datos) {
    const id = validarId(idRecibido, 'id de la orden')
    if (!TIPOS_FICHA.includes(datos.tipo)) {
        throw crearError(400, 'El tipo de ficha tiene que ser INGRESO o EGRESO')
    }
    if (!Number.isInteger(datos.kilometraje) || datos.kilometraje < 0) {
        throw crearError(400, 'El kilometraje tiene que ser un número entero mayor o igual a 0')
    }
    const conformidad = datos.conformidad ?? 'PENDIENTE'
    if (!CONFORMIDADES.includes(conformidad)) {
        throw crearError(400, 'La conformidad tiene que ser PENDIENTE o APROBADA')
    }
    validarItemsFicha(datos.items)

    const lista = ordenesRepository.obtenerOrdenes()
    const orden = buscarOrden(lista, id)
    exigirOrdenAbierta(orden)

    if (orden.fichas.some((ficha) => ficha.tipo === datos.tipo)) {
        throw crearError(409, `La orden ya tiene ficha de ${datos.tipo}`)
    }

    if (datos.tipo === 'EGRESO') {
        const ingreso = orden.fichas.find((ficha) => ficha.tipo === 'INGRESO')
        if (!ingreso) {
            throw crearError(409, 'Primero hay que cargar la ficha de ingreso')
        }
        if (!permiteFichaDeEgreso(orden.estado)) {
            throw crearError(409, 'La ficha de egreso se carga cuando la orden está en reparación o terminada')
        }
        if (datos.kilometraje < ingreso.kilometraje) {
            throw crearError(400, `El kilometraje de egreso no puede ser menor al de ingreso (${ingreso.kilometraje})`)
        }
    }

    const todasLasFichas = lista.flatMap((ordenActual) => ordenActual.fichas)
    let ultimoIdItem = Math.max(0, ...todasLasFichas.flatMap((ficha) => ficha.items).map((item) => item.id))

    const nuevaFicha = {
        id: proximoId(todasLasFichas),
        tipo: datos.tipo,
        fecha: new Date().toISOString(),
        kilometraje: datos.kilometraje,
        conformidad,
        items: datos.items.map((item) => {
            ultimoIdItem = ultimoIdItem + 1
            return { id: ultimoIdItem, concepto: item.concepto.trim(), valor: item.valor.trim() }
        })
    }

    return guardarCambios(lista, { ...orden, fichas: [...orden.fichas, nuevaFicha] })
}

function exigirTrabajosModificables(orden) {
    if (!permiteModificarTrabajos(orden.estado)) {
        throw crearError(409, `Con la orden en ${orden.estado} no se pueden modificar los trabajos`)
    }
}

function armarRepuestosUsados(repuestosPedidos) {
    if (!Array.isArray(repuestosPedidos)) {
        throw crearError(400, 'repuestos tiene que ser una lista')
    }
    const ids = repuestosPedidos.map((repuesto) => repuesto?.repuestoId)
    if (new Set(ids).size !== ids.length) {
        throw crearError(400, 'Hay repuestos repetidos: sumá las cantidades en un solo renglón')
    }

    return repuestosPedidos.map((pedido) => {
        const repuesto = ordenesRepository.buscarRepuesto(pedido.repuestoId)
        if (!repuesto) {
            throw crearError(400, `No existe el repuesto ${pedido.repuestoId}`)
        }
        if (typeof pedido.cantidad !== 'number' || pedido.cantidad <= 0) {
            throw crearError(400, `La cantidad de ${repuesto.nombre} tiene que ser mayor a 0`)
        }
        return {
            repuestoId: repuesto.id,
            nombre: repuesto.nombre,
            cantidad: pedido.cantidad,
            precioUnitario: repuesto.precioVenta
        }
    })
}

function armarEmpleados(empleadoIds) {
    if (!Array.isArray(empleadoIds)) {
        throw crearError(400, 'empleadoIds tiene que ser una lista')
    }
    const activos = ordenesRepository.obtenerEmpleadosActivos()

    return empleadoIds.map((idEmpleado) => {
        const empleado = activos.find((activo) => activo.id === idEmpleado)
        if (!empleado) {
            throw crearError(400, `El empleado ${idEmpleado} no existe o está dado de baja`)
        }
        return empleado
    })
}

function agregarTrabajo(idRecibido, datos) {
    const id = validarId(idRecibido, 'id de la orden')
    const lista = ordenesRepository.obtenerOrdenes()
    const orden = buscarOrden(lista, id)
    exigirTrabajosModificables(orden)

    const tipo = ordenesRepository.buscarTipoTrabajo(datos.tipoTrabajoId)
    if (!tipo || !tipo.activo) {
        throw crearError(400, 'Elegí un tipo de trabajo válido')
    }

    const manoDeObra = datos.manoDeObra ?? tipo.precioEstandar
    if (typeof manoDeObra !== 'number' || manoDeObra < 0) {
        throw crearError(400, 'La mano de obra tiene que ser un número mayor o igual a 0')
    }
    if (datos.descripcion !== undefined && datos.descripcion !== null && typeof datos.descripcion !== 'string') {
        throw crearError(400, 'La descripción tiene que ser un texto')
    }

    const empleados = armarEmpleados(datos.empleadoIds ?? [])
    const repuestos = armarRepuestosUsados(datos.repuestos ?? [])

    const todosLosTrabajos = lista.flatMap((ordenActual) => ordenActual.trabajos)
    let ultimoIdRepuesto = Math.max(0, ...todosLosTrabajos.flatMap((trabajo) => trabajo.repuestos).map((repuesto) => repuesto.id))

    const nuevoTrabajo = {
        id: proximoId(todosLosTrabajos),
        tipoTrabajoId: tipo.id,
        tipoTrabajo: tipo.nombre,
        descripcion: datos.descripcion?.trim() || null,
        manoDeObra,
        empleados,
        repuestos: repuestos.map((repuesto) => {
            ultimoIdRepuesto = ultimoIdRepuesto + 1
            return { id: ultimoIdRepuesto, ...repuesto }
        })
    }

    return guardarCambios(lista, { ...orden, trabajos: [...orden.trabajos, nuevoTrabajo] })
}

function quitarTrabajo(idRecibido, idTrabajoRecibido) {
    const id = validarId(idRecibido, 'id de la orden')
    const idTrabajo = validarId(idTrabajoRecibido, 'id del trabajo')
    const lista = ordenesRepository.obtenerOrdenes()
    const orden = buscarOrden(lista, id)
    exigirTrabajosModificables(orden)

    if (!orden.trabajos.some((trabajo) => trabajo.id === idTrabajo)) {
        throw crearError(404, `La orden ${id} no tiene el trabajo ${idTrabajo}`)
    }

    return guardarCambios(lista, {
        ...orden,
        trabajos: orden.trabajos.filter((trabajo) => trabajo.id !== idTrabajo)
    })
}

module.exports = {
    listarOrdenes,
    obtenerOrden,
    crearOrden,
    actualizarOrden,
    cambiarEstado,
    agregarFicha,
    agregarTrabajo,
    quitarTrabajo
}
