import { obtenerVehiculos } from '../../vehiculos'

const URL = '/backend/data'

let ordenes = null

async function cargarOrdenes(){
    if (ordenes === null){
        const respuesta = await fetch(`${URL}/ordenes.json`)

        if (!respuesta.ok){
            throw new Error("No se pudieron cargar las órdenes")
        }
        ordenes = await respuesta.json()
    }
    return ordenes
}

export async function obtenerOrdenes(){
    return cargarOrdenes()
}

export async function cargarPaginaOrdenes(){
    const [listaOrdenes, vehiculos] = await Promise.all([obtenerOrdenes(), obtenerVehiculos()])
    return { ordenes: listaOrdenes, vehiculos }
}
