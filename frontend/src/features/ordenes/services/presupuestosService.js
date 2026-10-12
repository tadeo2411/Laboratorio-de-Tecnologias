// Simula la API de presupuestos mientras no exista el backend.
// Los registros iniciales se leen del JSON que sirve Vite y los cambios quedan
// en memoria: se pierden al recargar la página.
// Todo lo que es regla de negocio (número, fechas, estados, precios derivados)
// se resuelve acá y no en los componentes: cuando exista el backend, estas
// reglas pasan a la API y solo se reemplaza el interior de estas funciones.
const URL = '/backend/data'

// Días que un presupuesto es válido desde su emisión (fechaVencimiento es derivada).
const DIAS_VALIDEZ = 15

// Estados que el empleado puede asignar a mano. VENCIDO lo asigna el sistema
// y BORRADOR es solo el estado inicial.
const ESTADOS_MODIFICABLES = ['ENVIADO', 'APROBADO', 'CANCELADO']

// Estados finales: el presupuesto ya no se puede modificar. Si un aprobado
// necesita cambios, se crea un presupuesto nuevo en lugar de editarlo.
const ESTADOS_FINALES = ['APROBADO', 'CANCELADO', 'VENCIDO']

let presupuestos = null

// Las fechas se manejan como texto "AAAA-MM-DD", en hora local.
function fechaATexto(fecha) {
    const mes = String(fecha.getMonth() + 1).padStart(2, '0')
    const dia = String(fecha.getDate()).padStart(2, '0')
    return `${fecha.getFullYear()}-${mes}-${dia}`
}

function sumarDias(texto, dias) {
    const [anio, mes, dia] = texto.split('-').map(Number)
    return fechaATexto(new Date(anio, mes - 1, dia + dias))
}

// Caso de uso "Marcar presupuesto como vencido" (actor Tiempo): un presupuesto
// enviado que el cliente no respondió antes del vencimiento pasa a VENCIDO.
// En el backend real lo haría una tarea programada; acá se aplica en cada consulta.
function calcularVencimiento(presupuesto) {
    return sumarDias(presupuesto.fechaEmision, DIAS_VALIDEZ)
}

function marcarVencidos(lista) {
    const hoy = fechaATexto(new Date())
    return lista.map((presupuesto) =>
        presupuesto.estadoPresupuesto === 'ENVIADO' && calcularVencimiento(presupuesto) < hoy
            ? { ...presupuesto, estadoPresupuesto: 'VENCIDO' }
            : presupuesto,
    )
}

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
function armarRespuesta(presupuesto) {
    const items = presupuesto.items.map((item) => ({
        ...item,
        precioTotal: item.cantidad * item.precioUnitario,
    }))
    const precioFinal = items.reduce((total, item) => total + item.precioTotal, 0)

    return { ...presupuesto, fechaVencimiento: calcularVencimiento(presupuesto), items, precioFinal }
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

function siguienteNumero(lista) {
    const ultimo = Math.max(0, ...lista.map((presupuesto) => Number(presupuesto.numero.split('-')[1]) || 0))
    return `P-${String(ultimo + 1).padStart(3, '0')}`
}

export async function obtenerPresupuestos() {
    const lista = await cargarPresupuestos()
    return lista.map(armarRespuesta)
}

// Con backend real: GET /ordenes/:id/presupuestos. El más reciente primero.
export async function obtenerPresupuestosPorOrden(ordenId) {
    const lista = await cargarPresupuestos()
    return lista
        .filter((presupuesto) => presupuesto.ordenId === ordenId)
        .sort((a, b) => b.fechaEmision.localeCompare(a.fechaEmision))
        .map(armarRespuesta)
}

// Recibe { ordenId, items }. Número, fechas y estado los asigna el sistema.
export async function crearPresupuesto(datos) {
    const lista = await cargarPresupuestos()
    validarItems(datos.items)

    const nuevoPresupuesto = {
        id: crypto.randomUUID(),
        numero: siguienteNumero(lista),
        ordenId: datos.ordenId,
        fechaEmision: fechaATexto(new Date()),
        estadoPresupuesto: 'BORRADOR',
        items: datos.items,
    }

    presupuestos = [...lista, nuevoPresupuesto]
    return armarRespuesta(nuevoPresupuesto)
}

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

    const presupuestoActualizado = { ...presupuesto, estadoPresupuesto: nuevoEstado, items }

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
