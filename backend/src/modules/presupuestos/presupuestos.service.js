import presupuestosRepository from './presupuestos.repository.js'
import ordenesService from '../ordenes/ordenes.service.js'
import { httpError } from '../../utils/httpError.js'

const DIAS_VALIDEZ_POR_DEFECTO = 15
const TIPOS_ITEM = ['MANO_DE_OBRA', 'REPUESTO', 'OTRO', 'DESCUENTO']
const ESTADOS_MODIFICABLES = ['ENVIADO', 'APROBADO', 'CANCELADO']
const ESTADOS_FINALES = ['APROBADO', 'CANCELADO', 'VENCIDO']
const ESTADOS_VIVOS = ['BORRADOR', 'ENVIADO', 'APROBADO']
const ESTADOS_QUE_EMITEN = ['ENVIADO', 'APROBADO']
const ESTADOS_DE_RESPUESTA = ['APROBADO', 'CANCELADO']
const ESTADOS_DE_ORDEN_CERRADA = ['ENTREGADO', 'CANCELADO']

function validarId(valor, nombre) {
    const id = Number(valor)
    if (!Number.isInteger(id) || id <= 0) {
        throw httpError(400, `El ${nombre} tiene que ser un número entero positivo`)
    }
    return id
}

function calcularTotalDelRenglon(renglon) {
    return renglon.cantidad * renglon.precioUnitario
}

function calcularPrecioFinal(renglones) {
    return renglones.reduce((total, renglon) => {
        const importe = calcularTotalDelRenglon(renglon)
        return renglon.tipo === 'DESCUENTO' ? total - importe : total + importe
    }, 0)
}

function validarQueLosDescuentosNoSuperenElTotal(renglones) {
    if (calcularPrecioFinal(renglones) < 0) {
        throw httpError(400, 'Los descuentos superan el total')
    }
}

function formatearNumero(numero) {
    return `P-${String(numero).padStart(3, '0')}`
}

function armarRespuesta(presupuesto) {
    const items = presupuesto.items.map((renglon) => ({
        ...renglon,
        precioTotal: calcularTotalDelRenglon(renglon)
    }))
    const trabajoIds = items
        .filter((renglon) => renglon.trabajoId !== null)
        .map((renglon) => renglon.trabajoId)

    return {
        ...presupuesto,
        numero: formatearNumero(presupuesto.numero),
        trabajoIds: [...new Set(trabajoIds)],
        items,
        precioFinal: calcularPrecioFinal(items)
    }
}

function estaCerrada(orden) {
    return ESTADOS_DE_ORDEN_CERRADA.includes(orden.estado)
}

async function buscarTrabajosReservados(ordenId, presupuestoExcluidoId = null) {
    const presupuestos = await presupuestosRepository.listar(ordenId)
    const reservados = new Map()

    presupuestos
        .filter((presupuesto) => presupuesto.id !== presupuestoExcluidoId)
        .filter((presupuesto) => ESTADOS_VIVOS.includes(presupuesto.estadoPresupuesto))
        .forEach((presupuesto) => {
            for (const renglon of presupuesto.items) {
                if (renglon.trabajoId !== null) {
                    reservados.set(renglon.trabajoId, formatearNumero(presupuesto.numero))
                }
            }
        })
    return reservados
}

async function listarPresupuestos(filtros) {
    let ordenId = null
    if (filtros.ordenId !== undefined) {
        const orden = await ordenesService.obtenerOrden(filtros.ordenId)
        ordenId = orden.id
    }
    const presupuestos = await presupuestosRepository.listar(ordenId)
    return presupuestos.map(armarRespuesta)
}

async function obtenerPresupuesto(idRecibido) {
    const id = validarId(idRecibido, 'id del presupuesto')
    const presupuesto = await presupuestosRepository.buscarPorId(id)
    if (!presupuesto) {
        throw httpError(404, `No existe el presupuesto ${id}`)
    }
    return armarRespuesta(presupuesto)
}

async function obtenerTrabajosPresupuestables(ordenIdRecibido) {
    const orden = await ordenesService.obtenerOrden(ordenIdRecibido)

    if (estaCerrada(orden)) {
        return { ordenCerrada: true, trabajosLibres: [], trabajosExcluidos: [] }
    }

    const reservados = await buscarTrabajosReservados(orden.id)
    return {
        ordenCerrada: false,
        trabajosLibres: orden.trabajos.filter((trabajo) => !reservados.has(trabajo.id)),
        trabajosExcluidos: orden.trabajos
            .filter((trabajo) => reservados.has(trabajo.id))
            .map((trabajo) => ({ trabajo, numeroPresupuesto: reservados.get(trabajo.id) }))
    }
}

function obtenerDiasValidez(valor) {
    if (valor === undefined || valor === null || valor === '') {
        return DIAS_VALIDEZ_POR_DEFECTO
    }
    const dias = Number(valor)
    if (!Number.isInteger(dias) || dias < 1) {
        throw httpError(400, 'La validez tiene que ser de al menos 1 día')
    }
    return dias
}

function obtenerObservaciones(valor) {
    if (valor === undefined || valor === null) return null
    if (typeof valor !== 'string' || valor.length > 500) {
        throw httpError(400, 'Las observaciones tienen que ser un texto de hasta 500 caracteres')
    }
    return valor.trim() || null
}

function armarRenglonesDeDescuentos(descuentos) {
    if (!Array.isArray(descuentos)) {
        throw httpError(400, 'descuentos tiene que ser una lista')
    }
    return descuentos.map((descuento) => {
        const motivo = typeof descuento?.motivo === 'string' ? descuento.motivo.trim() : ''
        if (!motivo) {
            throw httpError(400, 'Cada descuento necesita un motivo')
        }
        const monto = Number(descuento.monto)
        if (!(monto > 0)) {
            throw httpError(400, `El monto del descuento "${motivo}" tiene que ser mayor a 0`)
        }
        return { tipo: 'DESCUENTO', descripcion: motivo, cantidad: 1, precioUnitario: monto, trabajoId: null }
    })
}

function copiarRenglonesDeTrabajos(trabajos) {
    return trabajos.flatMap((trabajo) => [
        {
            tipo: 'MANO_DE_OBRA',
            descripcion: trabajo.tipoTrabajo,
            cantidad: 1,
            precioUnitario: trabajo.manoDeObra,
            trabajoId: trabajo.id
        },
        ...trabajo.repuestos.map((repuesto) => ({
            tipo: 'REPUESTO',
            descripcion: repuesto.nombre,
            cantidad: repuesto.cantidad,
            precioUnitario: repuesto.precioUnitario,
            trabajoId: trabajo.id
        }))
    ])
}

function validarTrabajosDeLaOrden(orden, trabajoIds, reservados) {
    return trabajoIds.map((trabajoId) => {
        const trabajo = orden.trabajos.find((trabajoActual) => trabajoActual.id === trabajoId)
        if (!trabajo) {
            throw httpError(400, `El trabajo ${trabajoId} no pertenece a esta orden`)
        }
        if (reservados.has(trabajoId)) {
            throw httpError(409, `"${trabajo.tipoTrabajo}" ya está en el presupuesto ${reservados.get(trabajoId)}`)
        }
        return trabajo
    })
}

async function crearPresupuesto(datos) {
    const orden = await ordenesService.obtenerOrden(datos.ordenId)
    if (estaCerrada(orden)) {
        throw httpError(409, 'Esta orden está cerrada y no se puede presupuestar')
    }

    if (!Array.isArray(datos.trabajoIds)) {
        throw httpError(400, 'trabajoIds tiene que ser una lista')
    }
    const trabajoIds = [...new Set(datos.trabajoIds)]
    if (trabajoIds.length === 0) {
        throw httpError(400, 'Elegí al menos un trabajo')
    }

    const descuentos = armarRenglonesDeDescuentos(datos.descuentos ?? [])
    const diasValidez = obtenerDiasValidez(datos.diasValidez)
    const observaciones = obtenerObservaciones(datos.observaciones)

    const reservados = await buscarTrabajosReservados(orden.id)
    const trabajos = validarTrabajosDeLaOrden(orden, trabajoIds, reservados)

    const items = [...copiarRenglonesDeTrabajos(trabajos), ...descuentos]
    validarQueLosDescuentosNoSuperenElTotal(items)

    const id = await presupuestosRepository.crear({ ordenId: orden.id, diasValidez, observaciones, items })
    return obtenerPresupuesto(id)
}

function validarItems(items) {
    if (!Array.isArray(items) || items.length === 0) {
        throw httpError(400, 'El presupuesto debe tener al menos un ítem')
    }
    return items.map((item) => {
        if (!TIPOS_ITEM.includes(item?.tipo)) {
            throw httpError(400, `El tipo de ítem tiene que ser uno de: ${TIPOS_ITEM.join(', ')}`)
        }
        const descripcion = typeof item.descripcion === 'string' ? item.descripcion.trim() : ''
        if (!descripcion || descripcion.length > 200) {
            throw httpError(400, 'Cada ítem necesita una descripción de hasta 200 caracteres')
        }
        if (typeof item.cantidad !== 'number' || !(item.cantidad > 0)) {
            throw httpError(400, `La cantidad de "${descripcion}" tiene que ser mayor a 0`)
        }
        if (typeof item.precioUnitario !== 'number' || !(item.precioUnitario >= 0)) {
            throw httpError(400, `El precio de "${descripcion}" tiene que ser mayor o igual a 0`)
        }
        const trabajoId = item.trabajoId ?? null
        if (trabajoId !== null) validarId(trabajoId, 'id del trabajo')
        return { tipo: item.tipo, descripcion, cantidad: item.cantidad, precioUnitario: item.precioUnitario, trabajoId }
    })
}

async function actualizarPresupuesto(idRecibido, datos) {
    const presupuesto = await obtenerPresupuesto(idRecibido)
    const estadoActual = presupuesto.estadoPresupuesto
    const nuevoEstado = datos.estadoPresupuesto ?? estadoActual

    if (ESTADOS_FINALES.includes(estadoActual)) {
        throw httpError(409, `El presupuesto ${presupuesto.numero} está ${estadoActual.toLowerCase()} y no se puede modificar`)
    }
    if (nuevoEstado !== estadoActual && !ESTADOS_MODIFICABLES.includes(nuevoEstado)) {
        throw httpError(400, 'Solo se puede pasar un presupuesto a enviado, aprobado o cancelado')
    }
    if (datos.items !== undefined && estadoActual !== 'BORRADOR') {
        throw httpError(409, 'Los ítems solo se pueden modificar mientras el presupuesto es un borrador')
    }

    const orden = await ordenesService.obtenerOrden(presupuesto.ordenId)
    if (estaCerrada(orden)) {
        throw httpError(409, 'La orden está cerrada y sus presupuestos ya no se pueden modificar')
    }

    let items = null
    if (datos.items !== undefined) {
        items = validarItems(datos.items)
        const reservados = await buscarTrabajosReservados(orden.id, presupuesto.id)
        const trabajoIds = [...new Set(items.filter((item) => item.trabajoId !== null).map((item) => item.trabajoId))]
        validarTrabajosDeLaOrden(orden, trabajoIds, reservados)
    }
    validarQueLosDescuentosNoSuperenElTotal(items ?? presupuesto.items)

    const cambiaDeEstado = nuevoEstado !== estadoActual
    await presupuestosRepository.actualizar(presupuesto.id, {
        estado: nuevoEstado,
        emitir: estadoActual === 'BORRADOR' && ESTADOS_QUE_EMITEN.includes(nuevoEstado),
        responder: cambiaDeEstado && ESTADOS_DE_RESPUESTA.includes(nuevoEstado),
        items
    })
    if (cambiaDeEstado && ESTADOS_QUE_EMITEN.includes(nuevoEstado) && orden.estado === 'DIAGNOSTICANDO') {
        await ordenesService.cambiarEstado(orden.id, 'ESPERANDO_APROBACION_PRESUPUESTO')
    }
    return obtenerPresupuesto(presupuesto.id)
}

// Lo usa ordenes para saber si el cliente ya autorizó el trabajo antes de empezar la reparación.
async function tieneAprobado(ordenId) {
    const presupuestos = await presupuestosRepository.listar(ordenId)
    return presupuestos.some((presupuesto) => presupuesto.estadoPresupuesto === 'APROBADO')
}

// Lo usa ordenes al cancelarse: los presupuestos que esperaban respuesta quedan cancelados.
async function cancelarPendientes(ordenId) {
    await presupuestosRepository.cancelarPendientes(ordenId)
}

async function eliminarPresupuesto(idRecibido) {
    const presupuesto = await obtenerPresupuesto(idRecibido)
    if (presupuesto.estadoPresupuesto !== 'BORRADOR') {
        throw httpError(409, `El presupuesto ${presupuesto.numero} ya fue enviado: en lugar de eliminarlo, cancelalo`)
    }
    await presupuestosRepository.eliminar(presupuesto.id)
}

export default {
    listarPresupuestos,
    obtenerPresupuesto,
    obtenerTrabajosPresupuestables,
    crearPresupuesto,
    actualizarPresupuesto,
    tieneAprobado,
    cancelarPendientes,
    eliminarPresupuesto
}
