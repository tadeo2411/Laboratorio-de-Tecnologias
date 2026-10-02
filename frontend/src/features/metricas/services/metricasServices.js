const URL = '/backend/data'

export async function obtenerOrdenes(){
    const respuesta = await fetch(`${URL}/ordenes.json`)

    if (!respuesta.ok){
        throw new Error("No se pudo cargar los ordenes")
    }
    return respuesta.json()
}