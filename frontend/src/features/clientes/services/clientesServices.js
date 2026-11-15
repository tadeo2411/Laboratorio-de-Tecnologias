import { obtenerToken, manejarSesionVencida } from '../../auth/services/authService'

export const tipoCliente = ['PERSONA', 'EMPRESA']
import { env } from '../../../config/env'

const URL = `${env.API_URL}/clientes`

async function pedir(ruta, opciones = {}) {
  const headers = { Authorization: `Bearer ${obtenerToken()}` }
  if (opciones.body) headers['Content-Type'] = 'application/json'

  let respuesta
  try {
    respuesta = await fetch(`${URL}${ruta}`, { ...opciones, headers })
  } catch {
    throw new Error('No se pudo conectar con el servidor.')
  }

  manejarSesionVencida(respuesta)

  let datos = null
  if (respuesta.status !== 204) {
    try {
      datos = await respuesta.json()
    } catch {
      datos = null
    }
  }

  if (!respuesta.ok) {
    throw new Error(datos?.error || datos?.mensaje || 'Ocurrió un error con los clientes.')
  }
  return datos
}

export function obtenerClientes() {
  return pedir('')
}

export function crearCliente(datos) {
  return pedir('', { method: 'POST', body: JSON.stringify(datos) })
}

export function modificarCliente(id, cambios) {
  return pedir(`/${id}`, { method: 'PATCH', body: JSON.stringify(cambios) })
}

export function eliminarCliente(id) {
  return pedir(`/${id}`, { method: 'DELETE' })
}
