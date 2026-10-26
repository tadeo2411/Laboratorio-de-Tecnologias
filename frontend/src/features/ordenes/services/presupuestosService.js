// Simula la API de presupuestos mientras no exista el backend.
// Los registros iniciales se leen del JSON que sirve Vite y los cambios quedan
// en memoria: se pierden al recargar la página.
// Todo lo que es regla de negocio (número, fechas, estados, precios derivados)
// se resuelve acá y no en los componentes: cuando exista el backend, estas
// reglas pasan a la API y solo se reemplaza el interior de estas funciones.
import { obtenerOrdenes } from './ordenesService'

const URL = '/backend/data'

// Días de validez cuando no se indica otro valor. La validez corre desde el envío.
const DIAS_VALIDEZ_POR_DEFECTO = 15

// Estados que el empleado puede asignar a mano. VENCIDO lo asigna el sistema
// y BORRADOR es solo el estado inicial.
const ESTADOS_MODIFICABLES = ['ENVIADO', 'APROBADO', 'CANCELADO']

// Estados finales: el presupuesto ya no se puede modificar. Si un aprobado
// necesita cambios, se crea un presupuesto nuevo en lugar de editarlo.
const ESTADOS_FINALES = ['APROBADO', 'CANCELADO', 'VENCIDO']

// Un presupuesto "vivo" reserva sus trabajos: ningún otro presupuesto vivo puede
// incluirlos. CANCELADO y VENCIDO no están acá, así que liberan sus trabajos.
const ESTADOS_VIVOS = ['BORRADOR', 'ENVIADO', 'APROBADO']

// Al salir de borrador hacia estos estados, el presupuesto se emite (le llega al cliente).
const ESTADOS_QUE_EMITEN = ['ENVIADO', 'APROBADO']

// Una orden cerrada ya no se presupuesta.
const ESTADOS_DE_ORDEN_CERRADA = ['ENTREGADO', 'CANCELADO']

let presupuestos = null

// ---------------------------------------------------------------------------
// Fechas: se manejan como texto "AAAA-MM-DD", en hora local.
// ---------------------------------------------------------------------------

function fechaATexto(fecha) {
    const mes = String(fecha.getMonth() + 1).padStart(2, '0')
    const dia = String(fecha.getDate()).padStart(2, '0')
    return `${fecha.getFullYear()}-${mes}-${dia}`
}

function fechaDeHoy() {
    return fechaATexto(new Date())
}

function sumarDias(texto, dias) {
    const [anio, mes, dia] = texto.split('-').map(Number)
    return fechaATexto(new Date(anio, mes - 1, dia + dias))
}

// /fechaVencimiento es derivada: emisión + días de validez.
// Un borrador todavía no se emitió, así que no tiene vencimiento.
function calcularVencimiento(presupuesto) {
    if (!presupuesto.fechaEmision) return null
    return sumarDias(presupuesto.fechaEmision, presupuesto.diasValidez ?? DIAS_VALIDEZ_POR_DEFECTO)
}

// Caso de uso "Marcar presupuesto como vencido" (actor Tiempo): un presupuesto
// enviado que el cliente no respondió antes del vencimiento pasa a VENCIDO.
// En el backend real lo haría una tarea programada; acá se aplica en cada consulta.
function marcarVencidos(lista) {
    const hoy = fechaDeHoy()
    return lista.map((presupuesto) =>
        presupuesto.estadoPresupuesto === 'ENVIADO' && calcularVencimiento(presupuesto) < hoy
            ? { ...presupuesto, estadoPresupuesto: 'VENCIDO' }
            : presupuesto,
    )
}

// ---------------------------------------------------------------------------
// Importes: los montos se guardan positivos y el tipo DESCUENTO es el que resta.
// ---------------------------------------------------------------------------

function calcularTotalDelRenglon(renglon) {
    return renglon.cantidad * renglon.precioUnitario
}

function calcularImporteConSigno(renglon) {
    const total = calcularTotalDelRenglon(renglon)
    return renglon.tipo === 'DESCUENTO' ? -total : total
}

function calcularPrecioFinal(renglones) {
    return renglones.reduce((total, renglon) => total + calcularImporteConSigno(renglon), 0)
}

function validarQueLosDescuentosNoSuperenElTotal(renglones) {
    if (calcularPrecioFinal(renglones) < 0) {
        throw new Error('Los descuentos superan el total')
    }
}

// ---------------------------------------------------------------------------
// Lectura y armado de la respuesta
// ---------------------------------------------------------------------------

async function cargarPresupuestos() {
    if (presupuestos === null) {
        const respuesta = await fetch(`${URL}/presupuestos.json`)

        if (!respuesta.ok) {
            throw new Error('No se pudieron cargar los presupuestos.')
        }
        presupuestos = await respuesta.json()
    }
    presupuestos = marcarVencidos(presupuestos)
    return presupuestos
}

// Agrega los atributos derivados del diagrama (/fechaVencimiento, /precioTotal
// y /precioFinal), como los devolvería la API. No se guardan: se calculan siempre.
// precioTotal de cada renglón es positivo; precioFinal ya tiene restados los descuentos.
function armarRespuesta(presupuesto) {
    const items = presupuesto.items.map((renglon) => ({
        ...renglon,
        precioTotal: calcularTotalDelRenglon(renglon),
    }))

    return {
        ...presupuesto,
        fechaVencimiento: calcularVencimiento(presupuesto),
        items,
        precioFinal: calcularPrecioFinal(items),
    }
}

function buscarPresupuesto(lista, id) {
    const presupuesto = lista.find((presupuestoActual) => presupuestoActual.id === id)

    if (!presupuesto) {
        throw new Error('El presupuesto no existe o ya fue eliminado.')
    }
    return presupuesto
}

// Un presupuesto tiene al menos un ítem (multiplicidad 1..* en el diagrama).
function validarItems(items) {
    if (!items?.length) {
        throw new Error('El presupuesto debe tener al menos un ítem.')
    }
}

// "P-007" → 7
function numeroComoEntero(presupuesto) {
    return Number(presupuesto.numero.split('-')[1]) || 0
}

function siguienteNumero(lista) {
    const ultimo = Math.max(0, ...lista.map(numeroComoEntero))
    return `P-${String(ultimo + 1).padStart(3, '0')}`
}

// Orden de la lista:
// 1. los borradores primero (son los que se están armando);
// 2. después, por fecha de emisión, del más reciente al más viejo;
// 3. al final, los que nunca se emitieron (por ejemplo, un borrador que se canceló).
// Si empatan, el número más alto primero.
function compararPorEmision(presupuestoA, presupuestoB) {
    const esBorradorA = presupuestoA.estadoPresupuesto === 'BORRADOR'
    const esBorradorB = presupuestoB.estadoPresupuesto === 'BORRADOR'
    if (esBorradorA !== esBorradorB) return esBorradorA ? -1 : 1

    const fechaA = presupuestoA.fechaEmision
    const fechaB = presupuestoB.fechaEmision
    if (fechaA === fechaB) return numeroComoEntero(presupuestoB) - numeroComoEntero(presupuestoA)
    if (!fechaA) return 1
    if (!fechaB) return -1
    return fechaB.localeCompare(fechaA)
}

export async function obtenerPresupuestos() {
    const lista = await cargarPresupuestos()
    return lista.map(armarRespuesta)
}

// Con backend real: GET /ordenes/:id/presupuestos.
export async function obtenerPresupuestosPorOrden(ordenId) {
    const lista = await cargarPresupuestos()
    return lista
        .filter((presupuesto) => presupuesto.ordenId === ordenId)
        .sort(compararPorEmision)
        .map(armarRespuesta)
}

const sumarTotales = (renglones) => renglones.reduce((total, renglon) => total + renglon.precioTotal, 0)

// Con backend real: GET /ordenes/:id/aprobado. Junta los ítems de todos los
// presupuestos aprobados de la orden: es lo que el cliente autorizó hacer y lo
// que consultan los mecánicos. Se separan trabajos (mano de obra, otros),
// repuestos y descuentos; el total resta los descuentos.
export async function obtenerResumenAprobado(ordenId) {
    const presupuestosDeLaOrden = await obtenerPresupuestosPorOrden(ordenId)
    const renglonesAprobados = presupuestosDeLaOrden
        .filter((presupuesto) => presupuesto.estadoPresupuesto === 'APROBADO')
        .flatMap((presupuesto) =>
            presupuesto.items.map((renglon) => ({
                ...renglon,
                clave: `${presupuesto.id}-${renglon.id}`,
                numeroPresupuesto: presupuesto.numero,
            })),
        )

    const trabajos = renglonesAprobados.filter((renglon) => renglon.tipo === 'MANO_DE_OBRA' || renglon.tipo === 'OTRO')
    const repuestos = renglonesAprobados.filter((renglon) => renglon.tipo === 'REPUESTO')
    const descuentos = renglonesAprobados.filter((renglon) => renglon.tipo === 'DESCUENTO')

    const totalTrabajos = sumarTotales(trabajos)
    const totalRepuestos = sumarTotales(repuestos)
    const totalDescuentos = sumarTotales(descuentos)

    return {
        trabajos,
        repuestos,
        descuentos,
        totalTrabajos,
        totalRepuestos,
        totalDescuentos,
        total: totalTrabajos + totalRepuestos - totalDescuentos,
    }
}

// ---------------------------------------------------------------------------
// Trabajos presupuestables
// ---------------------------------------------------------------------------

async function buscarOrden(ordenId) {
    const ordenes = await obtenerOrdenes()
    const orden = ordenes.find((ordenActual) => ordenActual.id === ordenId)

    if (!orden) {
        throw new Error('La orden no existe.')
    }
    return orden
}

function estaCerrada(orden) {
    return ESTADOS_DE_ORDEN_CERRADA.includes(orden.estado)
}

// Devuelve un Map con los trabajos de la orden que ya están en un presupuesto vivo:
// trabajoId → número del presupuesto que lo tiene (por ejemplo 3 → "P-002").
function buscarTrabajosReservados(lista, ordenId) {
    const trabajosReservados = new Map()

    lista
        .filter((presupuesto) => presupuesto.ordenId === ordenId && ESTADOS_VIVOS.includes(presupuesto.estadoPresupuesto))
        .forEach((presupuesto) => {
            for (const trabajoId of presupuesto.trabajoIds ?? []) {
                trabajosReservados.set(trabajoId, presupuesto.numero)
            }
        })

    return trabajosReservados
}

// Con backend real: GET /ordenes/:id/trabajos-presupuestables.
// Devuelve los trabajos libres de la orden y, aparte, los que quedaron afuera
// con el número del presupuesto que los tiene. Los trabajos todavía no tienen
// estado: por ahora todos cuentan como pendientes.
export async function obtenerTrabajosPresupuestables(ordenId) {
    const [lista, orden] = await Promise.all([cargarPresupuestos(), buscarOrden(ordenId)])

    if (estaCerrada(orden)) {
        return { ordenCerrada: true, trabajosLibres: [], trabajosExcluidos: [] }
    }

    const trabajosDeLaOrden = orden.trabajos ?? []
    const trabajosReservados = buscarTrabajosReservados(lista, ordenId)

    return {
        ordenCerrada: false,
        trabajosLibres: trabajosDeLaOrden.filter((trabajo) => !trabajosReservados.has(trabajo.id)),
        trabajosExcluidos: trabajosDeLaOrden
            .filter((trabajo) => trabajosReservados.has(trabajo.id))
            .map((trabajo) => ({ trabajo, numeroPresupuesto: trabajosReservados.get(trabajo.id) })),
    }
}

// ---------------------------------------------------------------------------
// Alta
// ---------------------------------------------------------------------------

// 15 si viene vacío; si viene, tiene que ser un entero de al menos 1.
function obtenerDiasValidez(valor) {
    if (valor === undefined || valor === null || valor === '') {
        return DIAS_VALIDEZ_POR_DEFECTO
    }

    const dias = Number(valor)
    if (!Number.isInteger(dias) || dias < 1) {
        throw new Error('La validez tiene que ser de al menos 1 día')
    }
    return dias
}

function validarDescuentos(descuentos) {
    for (const descuento of descuentos) {
        if (!descuento.motivo?.trim()) {
            throw new Error('Cada descuento necesita un motivo')
        }
        if (!(Number(descuento.monto) > 0)) {
            throw new Error(`El monto del descuento "${descuento.motivo.trim()}" tiene que ser mayor a 0`)
        }
    }
}

// Vuelve a verificar, al momento de guardar, que cada trabajo elegido sea de la
// orden y siga libre (otro empleado pudo haberlo presupuestado mientras tanto).
function buscarTrabajosElegidos(orden, trabajoIds, trabajosReservados) {
    const trabajosDeLaOrden = orden.trabajos ?? []

    return trabajoIds.map((trabajoId) => {
        const trabajo = trabajosDeLaOrden.find((trabajoActual) => trabajoActual.id === trabajoId)

        if (!trabajo) {
            throw new Error(`El trabajo ${trabajoId} no pertenece a esta orden`)
        }
        if (trabajosReservados.has(trabajoId)) {
            throw new Error(`"${trabajo.tipoTrabajo}" ya está en el presupuesto ${trabajosReservados.get(trabajoId)}`)
        }
        return trabajo
    })
}

// Los renglones son una COPIA (una foto): si después se edita el trabajo,
// el presupuesto no cambia. Por cada trabajo, un renglón de mano de obra y
// uno por cada repuesto; los dos guardan el trabajoId para saber de dónde salieron.
function copiarRenglonesDeTrabajos(trabajos) {
    return trabajos.flatMap((trabajo) => [
        {
            tipo: 'MANO_DE_OBRA',
            descripcion: trabajo.tipoTrabajo,
            cantidad: 1,
            precioUnitario: trabajo.manoDeObra,
            trabajoId: trabajo.id,
        },
        ...(trabajo.repuestos ?? []).map((repuesto) => ({
            tipo: 'REPUESTO',
            descripcion: repuesto.nombre,
            cantidad: repuesto.cantidad,
            precioUnitario: repuesto.precioUnitario,
            trabajoId: trabajo.id,
        })),
    ])
}

// Un descuento no sale de ningún trabajo: no lleva trabajoId.
function armarRenglonesDeDescuentos(descuentos) {
    return descuentos.map((descuento) => ({
        tipo: 'DESCUENTO',
        descripcion: descuento.motivo.trim(),
        cantidad: 1,
        precioUnitario: Number(descuento.monto),
    }))
}

function numerarRenglones(renglones) {
    return renglones.map((renglon, indice) => ({ id: indice + 1, ...renglon }))
}

// Recibe { ordenId, trabajoIds, diasValidez, observaciones, descuentos: [{ motivo, monto }] }.
// Número, estado y fechas los asigna el sistema. Si algo no cumple las reglas,
// tira un error y no guarda nada.
export async function crearPresupuesto(datos) {
    const lista = await cargarPresupuestos()
    const orden = await buscarOrden(datos.ordenId)

    if (estaCerrada(orden)) {
        throw new Error('Esta orden está cerrada y no se puede presupuestar')
    }

    const trabajoIdsSinRepetir = [...new Set(datos.trabajoIds ?? [])]
    if (trabajoIdsSinRepetir.length === 0) {
        throw new Error('Elegí al menos un trabajo')
    }

    const descuentos = datos.descuentos ?? []
    validarDescuentos(descuentos)
    const diasValidez = obtenerDiasValidez(datos.diasValidez)

    const trabajosReservados = buscarTrabajosReservados(lista, datos.ordenId)
    const trabajosElegidos = buscarTrabajosElegidos(orden, trabajoIdsSinRepetir, trabajosReservados)

    const renglones = numerarRenglones([
        ...copiarRenglonesDeTrabajos(trabajosElegidos),
        ...armarRenglonesDeDescuentos(descuentos),
    ])
    validarQueLosDescuentosNoSuperenElTotal(renglones)

    const nuevoPresupuesto = {
        id: crypto.randomUUID(),
        numero: siguienteNumero(lista),
        ordenId: datos.ordenId,
        trabajoIds: trabajoIdsSinRepetir,
        // La validez corre desde el envío: en borrador todavía no hay fecha de emisión.
        fechaEmision: null,
        diasValidez,
        observaciones: datos.observaciones?.trim() ?? '',
        estadoPresupuesto: 'BORRADOR',
        items: renglones,
    }

    presupuestos = [...lista, nuevoPresupuesto]
    return armarRespuesta(nuevoPresupuesto)
}

// ---------------------------------------------------------------------------
// Modificación y baja
// ---------------------------------------------------------------------------

// Recibe { estadoPresupuesto, items }. Los ítems solo se cambian mientras es
// borrador: una vez enviado, el cliente ya tiene esos precios.
export async function actualizarPresupuesto(id, datos) {
    const lista = await cargarPresupuestos()
    const presupuesto = buscarPresupuesto(lista, id)
    const estadoActual = presupuesto.estadoPresupuesto
    const nuevoEstado = datos.estadoPresupuesto ?? estadoActual

    if (ESTADOS_FINALES.includes(estadoActual)) {
        throw new Error(`El presupuesto ${presupuesto.numero} está ${estadoActual.toLowerCase()} y no se puede modificar.`)
    }
    if (nuevoEstado !== estadoActual && !ESTADOS_MODIFICABLES.includes(nuevoEstado)) {
        throw new Error('Solo se puede pasar un presupuesto a enviado, aprobado o cancelado.')
    }
    if (datos.items && estadoActual !== 'BORRADOR') {
        throw new Error('Los ítems solo se pueden modificar mientras el presupuesto es un borrador.')
    }

    const items = datos.items ?? presupuesto.items
    validarItems(items)
    validarQueLosDescuentosNoSuperenElTotal(items)

    // Al salir de borrador hacia enviado o aprobado se emite: desde hoy corre la validez.
    const seEmiteAhora = estadoActual === 'BORRADOR' && ESTADOS_QUE_EMITEN.includes(nuevoEstado)
    const fechaEmision = seEmiteAhora ? fechaDeHoy() : presupuesto.fechaEmision

    const presupuestoActualizado = { ...presupuesto, estadoPresupuesto: nuevoEstado, fechaEmision, items }

    presupuestos = lista.map((presupuestoActual) =>
        presupuestoActual.id === id ? presupuestoActualizado : presupuestoActual,
    )
    return armarRespuesta(presupuestoActualizado)
}

// Solo se elimina un borrador; uno enviado se cancela, así queda registro.
export async function eliminarPresupuesto(id) {
    const lista = await cargarPresupuestos()
    const presupuesto = buscarPresupuesto(lista, id)

    if (presupuesto.estadoPresupuesto !== 'BORRADOR') {
        throw new Error(`El presupuesto ${presupuesto.numero} ya fue enviado: en lugar de eliminarlo, cancelalo.`)
    }

    presupuestos = lista.filter((presupuestoActual) => presupuestoActual.id !== id)
}
