import { obtenerPresupuestosPorOrden } from './presupuestosService'

const URL = '/backend/data'

export async function obtenerVehiculos(){
    const respuesta = await fetch(`${URL}/vehiculos.json`)

    if (!respuesta.ok){
        throw new Error("No se pudo cargar los vehiculos")
    }
    return respuesta.json()
}

export async function obtenerRepuestos(){
    const respuesta = await fetch(`${URL}/repuestos.json`)

    if (!respuesta.ok){
        throw new Error("No se pudo cargar los repuestos")
    }
    return respuesta.json()
}

export async function obtenerOrdenes(){
    const respuesta = await fetch(`${URL}/ordenes.json`)

    if (!respuesta.ok){
        throw new Error("No se pudo cargar los ordenes")
    }
    return respuesta.json()
}

// Los ítems de los presupuestos aprobados son lo que se hace en la orden:
// los repuestos van a "Repuestos utilizados" y el resto (mano de obra, otros) a "Trabajos".
function separarItemsAprobados(presupuestos) {
    const items = presupuestos
        .filter((presupuesto) => presupuesto.estadoPresupuesto === 'APROBADO')
        .flatMap((presupuesto) =>
            presupuesto.items.map((item) => ({
                ...item,
                clave: `${presupuesto.id}-${item.id}`,
                numeroPresupuesto: presupuesto.numero,
            })),
        )

    return {
        trabajos: items.filter((item) => item.tipo !== 'REPUESTO'),
        repuestos: items.filter((item) => item.tipo === 'REPUESTO'),
    }
}

const sumarTotales = (items) => items.reduce((total, item) => total + item.precioTotal, 0)

// Con backend real: GET /ordenes/:id. Devuelve la orden con su vehículo y sus
// presupuestos, y arma los trabajos, repuestos y totales a partir de los aprobados.
export async function obtenerDetalleOrden(ordenId){
    const [ordenes, vehiculos, presupuestos] = await Promise.all([
        obtenerOrdenes(),
        obtenerVehiculos(),
        obtenerPresupuestosPorOrden(ordenId),
    ])

    const orden = ordenes.find((ordenActual) => ordenActual.id === ordenId)
    if (!orden){
        throw new Error("La orden no existe o fue eliminada")
    }

    const { trabajos, repuestos } = separarItemsAprobados(presupuestos)
    const totalTrabajos = sumarTotales(trabajos)
    const totalRepuestos = sumarTotales(repuestos)

    return {
        ...orden,
        vehiculo: vehiculos.find((vehiculo) => vehiculo.id === orden.vehiculoId) ?? null,
        presupuestos,
        trabajos,
        repuestos,
        totalTrabajos,
        totalRepuestos,
        total: totalTrabajos + totalRepuestos,
    }
}
