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

export async function obtenerPresupuestos(){
    const respuesta = await fetch(`${URL}/presupuestos.json`)

    if (!respuesta.ok){
        throw new Error("No se pudo cargar los presupuestos")
    }
    return respuesta.json()
}