import { obtenerVehiculos, obtenerClientes } from '../../vehiculos'
import { obtenerTiposTrabajo } from '../../trabajos'
import { obtenerRepuestos } from '../../repuestos'
import { obtenerEmpleados } from '../../auth'
import {obtenerToken, manejarSesionVencida} from '../../auth/services/authService'
import { API_URL } from '../../../shared/config/api'

const URL_API = `${API_URL}/ordenes`

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
    return pedir('', {method: 'POST', body: JSON.stringify(datos)})
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
