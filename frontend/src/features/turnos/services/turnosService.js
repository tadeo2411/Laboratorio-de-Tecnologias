const URL = '/backend/data'

export async function obtenerTurnos(){
    const respuesta = await fetch(`${URL}/turnos.json`)

    if (!respuesta.ok){
        throw new Error("No se pudo cargar los turnos")
    }
    return respuesta.json()
}