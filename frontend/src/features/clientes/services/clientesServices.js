export const tipoCliente = ['PERSONA', 'EMPRESA']
const URL = '/backend/data'

export async function obtenerClientes(){
    const respuesta = await fetch(`${URL}/clientes.json`)

    if (!respuesta.ok){
        throw new Error("No se pudo cargar los clientes")
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
