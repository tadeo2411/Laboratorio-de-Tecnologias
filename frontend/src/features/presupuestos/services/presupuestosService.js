const URL = 'backend-labtech/data'

export async function obtenerPresupuestos(){
    const respuesta = await fetch('${URL}/presupuestos.json')
    if (!respuesta.ok){
        throw new Error("No se pudo cargar los presupuestos")
    }
    return respuesta.json()
}