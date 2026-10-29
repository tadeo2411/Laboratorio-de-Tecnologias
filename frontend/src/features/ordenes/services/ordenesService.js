import { obtenerVehiculos, obtenerClientes } from '../../vehiculos'
import { obtenerTiposTrabajo } from '../../trabajos'
import { obtenerRepuestos } from '../../repuestos'
import { obtenerEmpleados } from '../../auth'
import { ESTADO_INICIAL, esEstadoFinal, puedeCambiarEstado, obtenerEstado} from '../utils/estados'
import { buscarFicha } from '../utils/ordenes'
import {obtenerToken, manejarSesionVencida} from '../../auth/services/authService'

const URL = '/backend/data'
const URL_API = 'http://localhost:3000/api/ordenes'

async function pedir(ruta, opciones = {}) {
    const headers = { Authorization: `Bearer ${obtenerToken()}` }
    if (opciones.body) headers['Content-Type'] = 'application/json'

    let respuesta
    try {
        respuesta = await fetch(`${URL_API}${ruta}`, { ...opciones, headers })
    } catch {
        throw new Error('No se pudo conectar con el servidor.')
    }

    manejarSesionVencida(respuesta)
    const datos = respuesta.status === 204 ? null : await respuesta.json()

    if (!respuesta.ok) {
        throw new Error(datos?.error || datos?.mensaje || 'Ocurrió un error con las ordenes.')
    }
    return datos
}

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
    return pedir('')
}

export async function cargarPaginaOrdenes(){
    const [listaOrdenes, vehiculos, tiposTrabajo, repuestos, empleados, clientes] = await Promise.all([
        obtenerOrdenes(),
        obtenerVehiculos(),
        obtenerTiposTrabajo(),
        obtenerRepuestos(),
        obtenerEmpleados(),
        obtenerClientes()
    ])
    return { ordenes: listaOrdenes, vehiculos, tiposTrabajo, repuestos, empleados, clientes }
}

export async function agregarTrabajo(idOrden, datosTrabajo){
    const datos = { ...datosTrabajo, empleadoIds: datosTrabajo.empleados.map( empleado => empleado.id)}
    return pedir(`/${idOrden}/trabajos`,{method: 'POST', body: JSON.stringify(datos)})
}

export async function quitarTrabajo(idOrden, idTrabajo){
    return pedir(`/${idOrden}/trabajos/${idTrabajo}`,{method: 'DELETE'})
}

export async function crearOrden(datos){
    const lista = await cargarOrdenes()
    const ultimoId = Math.max(0, ...lista.map(orden => orden.id))

    const nuevaOrden = {
        ...datos,
        id: ultimoId + 1,
        turnoId: null,
        estado: ESTADO_INICIAL,
        createdAt: new Date().toISOString(),
        fichas: [],
        trabajos: []
    }

    ordenes = [...lista, nuevaOrden]
    return nuevaOrden
}

export async function actualizarOrden(id, datos){
    const {estado, ...cambios} = datos
    const orden = await pedir(`/${id}`, {method: 'PATCH', body: JSON.stringify(cambios)})
    if(estado!==orden.estado){
        return pedir(`/${id}/estado`, {method: 'PATCH', body: JSON.stringify({estado})})
    }
    return orden
}

export async function agregarFicha(idOrden, datosFicha){
    return pedir(`/${idOrden}/fichas`, {method: 'POST', body: JSON.stringify(datosFicha)})
}
