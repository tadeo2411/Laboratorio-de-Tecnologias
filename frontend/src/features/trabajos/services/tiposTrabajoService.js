const URL = '/backend/data'

let tiposTrabajo = null

async function cargarTiposTrabajo(){
    if (tiposTrabajo === null){
        const respuesta = await fetch(`${URL}/tiposTrabajo.json`)

        if (!respuesta.ok){
            throw new Error("No se pudo cargar el catálogo de trabajos")
        }
        tiposTrabajo = await respuesta.json()
    }
    return tiposTrabajo
}

export async function obtenerTiposTrabajo(){
    return cargarTiposTrabajo()
}
