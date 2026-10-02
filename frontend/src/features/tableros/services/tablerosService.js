const URL = '/backend/data'

export async function obtenerOrdenes(){
    const respuesta = await fetch(`${URL}/ordenes.json`)

    if (!respuesta.ok){
        throw new Error("No se pudieron cargar las órdenes")
    }
    return respuesta.json()
}