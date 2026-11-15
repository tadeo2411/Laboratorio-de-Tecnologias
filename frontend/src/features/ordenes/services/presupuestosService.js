import { obtenerToken, manejarSesionVencida } from '../../auth/services/authService'
import { API_URL } from '../../../shared/config/api'

const URL_API = `${API_URL}/presupuestos`

async function pedir(ruta, opciones = {}) {
    const headers = { Authorization: `Bearer ${obtenerToken()}` }
    if (opciones.body) headers['Content-Type'] = 'application/json'

    let respuesta
    try {
        respuesta = await fetch(`${URL_API}${ruta}`, { ...opciones, headers })
    } catch {
        throw new Error('No se pudo conectar con el servidor.')
    }

    manejarSesionVencida(respuesta)
    const datos = respuesta.status === 204 ? null : await respuesta.json()

    if (!respuesta.ok) {
        throw new Error(datos?.error || datos?.mensaje || 'Ocurrió un error con los presupuestos.')
    }
    return datos
}

export function obtenerPresupuestos() {
    return pedir('')
}

export function obtenerPresupuestosPorOrden(ordenId) {
    return pedir(`?ordenId=${ordenId}`)
}

export function obtenerTrabajosPresupuestables(ordenId) {
    return pedir(`/trabajos-presupuestables?ordenId=${ordenId}`)
}

export function crearPresupuesto(datos) {
    return pedir('', { method: 'POST', body: JSON.stringify(datos) })
}

export function actualizarPresupuesto(id, datos) {
    return pedir(`/${id}`, { method: 'PATCH', body: JSON.stringify(datos) })
}

export function eliminarPresupuesto(id) {
    return pedir(`/${id}`, { method: 'DELETE' })
}

const sumarTotales = (renglones) => renglones.reduce((total, renglon) => total + renglon.precioTotal, 0)

// Junta los ítems de los presupuestos aprobados de la orden: es lo que el cliente
// autorizó hacer. Separa trabajos, repuestos y descuentos; el total resta los descuentos.
export function resumirAprobados(presupuestosDeLaOrden) {
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
