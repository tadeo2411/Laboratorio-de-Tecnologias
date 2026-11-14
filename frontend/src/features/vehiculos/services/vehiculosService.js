// Simula la API de vehículos mientras no exista el backend.
// Los registros iniciales se leen del JSON que sirve Vite y los cambios quedan
// en memoria: se pierden al recargar la página.
// Cada función corresponde a una operación de la futura API
// (GET, POST, PUT y DELETE sobre /api/vehiculos). Cuando exista el backend,
// solo se reemplaza el interior de estas funciones; las páginas no cambian.

import {obtenerToken, manejarSesionVencida} from '../../auth/services/authService'
import { API_URL } from '../../../shared/config/api'

const URL = '/backend/data'
const URLVehiculos = `${API_URL}/vehiculos`
let vehiculos = null

async function pedir(ruta, opciones = {}) {
    const headers = { Authorization: `Bearer ${obtenerToken()}` }
    if (opciones.body) headers['Content-Type'] = 'application/json'

    let respuesta
    try {
        respuesta = await fetch(`${URLVehiculos}${ruta}`, { ...opciones, headers })
    } catch {
        throw new Error('No se pudo conectar con el servidor.')
    }

    manejarSesionVencida(respuesta)
    const datos = respuesta.status === 204 ? null : await respuesta.json()

    if (!respuesta.ok) {
        throw new Error(datos?.error || datos?.mensaje || 'Ocurrió un error con los vehiculos.')
    }
    return datos
}

export function obtenerVehiculos(){
  return pedir('')
}

export function buscarVehiculo(id){
  return pedir(`/${id}`)
}

export function crearVehiculo(datos){
  const {clienteIds, ...resto} = datos
  return pedir('', { method: 'POST', body: JSON.stringify({...resto, idCliente:clienteIds?.[0],}) })
}

export function modificarVehiculo(id, datos){
  const { patente, marca, modelo, anio, descripcion, kilometraje } = datos
  return pedir(`/${id}`, {method: 'PATCH', body: JSON.stringify({ patente, marca, modelo, anio, descripcion, kilometraje })})
}

export function eliminarVehiculo(id){
  return pedir(`/${id}`, {method : 'DELETE'})
}

export function verHistorialService(id){
  return pedir(`/${id}/historial`)
}

export function obtenerDuenos(id){
  return pedir(`/${id}/duenos`, {method : 'GET'})
}

export function asociarDueno(id, idCliente){
  return pedir(`/${id}/duenos/${idCliente}`, {method : 'POST'})
}

export function desasociarDueno(id, idCliente){
  return pedir(`/${id}/duenos/${idCliente}`, {method : 'DELETE'})
}



// utilizada por otros componentes
export function normalizarPatente(patente) {
  return patente.replace(/\s+/g, '').toUpperCase()
}



export { obtenerClientes } from '../../clientes'
