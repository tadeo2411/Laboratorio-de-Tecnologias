// Servicio para gestionar vehículos contra la API de Taller 303 (Express 5 + PostgreSQL).
import { obtenerToken, manejarSesionVencida } from '../../auth'
import { API_URL } from '../../../shared/config/api'

const URLVehiculos = `${API_URL}/vehiculos`

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

export async function sincronizarDuenos(idVehiculo, duenosPreviosIds = [], duenosNuevosIds = []) {
  const aAgregar = duenosNuevosIds.filter((id) => !duenosPreviosIds.includes(id))
  const aQuitar = duenosPreviosIds.filter((id) => !duenosNuevosIds.includes(id))

  for (const idCliente of aAgregar) {
    await asociarDueno(idVehiculo, idCliente)
  }
  for (const idCliente of aQuitar) {
    await desasociarDueno(idVehiculo, idCliente)
  }
}

// utilizada por otros componentes
export function normalizarPatente(patente) {
  return patente.replace(/\s+/g, '').toUpperCase()
}



export { obtenerClientes } from '../../clientes'
