//ESTADOS SOLICITADO, CONFIRMADO, CUMPLIDO, CANCELADO, AUSENTE
export const estadosTurno = ['SOLICITADO', 'CONFIRMADO', 'CUMPLIDO', 'CANCELADO', 'AUSENTE']
const URL = '/backend/data'

export async function obtenerTurnos(){
    const respuesta = await fetch(`${URL}/turnos.json`)

    if (!respuesta.ok){
        throw new Error("No se pudo cargar los turnos")
    }
    return respuesta.json()
}


export async function obtenerAutos(){
    const respuesta = await fetch(`${URL}/vehiculos.json`)

    if (!respuesta.ok){
        throw new Error("No se pudo cargar los autos")
    }
    return respuesta.json()
}
