import { redirect } from 'react-router'
import { API_URL } from '../../../shared/config/api'

const URL = `${API_URL}/auth`
const CLAVE_USUARIO = 'gestorTaller303:usuario'
const CLAVE_TOKEN = 'gestorTaller303:token'
function guardarSesion(usuario) {
  const sesion = { id: usuario.id, usuario: usuario.usuario, nombre: usuario.nombre, rol: usuario.rol }
  sessionStorage.setItem(CLAVE_USUARIO, JSON.stringify(sesion))
  return sesion
}

export async function iniciarSesion(usuario, contrasena) {
  let respuesta
  try {
    respuesta = await fetch(`${URL}/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ usuario, contrasena })
    })
  } catch {
    throw new Error('No se pudo conectar con el servidor.')
  }

  const datos = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(datos.error || 'Usuario o contraseña incorrectos.')
  }

  sessionStorage.setItem(CLAVE_TOKEN, datos.token)
  sessionStorage.setItem(CLAVE_USUARIO, JSON.stringify(datos.usuario))
  return datos.usuario
}

export function obtenerSesion() {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE_USUARIO))
  } catch {
    return null
  }
}

export function obtenerToken() {
  return sessionStorage.getItem(CLAVE_TOKEN)
}

export function cerrarSesion() {
  sessionStorage.removeItem(CLAVE_TOKEN)
  sessionStorage.removeItem(CLAVE_USUARIO)
}


function tokenVencido(token) {
  if (!token) return true
  try {
    const { exp } = JSON.parse(atob(token.split('.')[1]))
    return typeof exp !== 'number' || exp * 1000 <= Date.now()
  } catch {
    return true
  }
}

function haySesionVigente() {
  return Boolean(obtenerSesion()) && !tokenVencido(obtenerToken())
}

export function manejarSesionVencida(respuesta) {
  if (respuesta.status !== 401) return
  cerrarSesion()
  window.location.assign('/login')
}

export function protegerRuta() {
  if (!haySesionVigente()) {
    cerrarSesion()
    throw redirect('/login')
  }
  return obtenerSesion()
}

export function redirigirSiHaySesion() {
  if (haySesionVigente()) {
    throw redirect('/gestor')
  }
  return null
}

export async function obtenerEmpleados() {
  let respuesta
  try{
    respuesta = await fetch(`${URL}/empleados`,{headers:{Authorization: `Bearer ${obtenerToken()}`}})
  }catch{
    throw new Error('No se pudo conectar con el servidor')
  }
  const datos = await respuesta.json()
  if(!respuesta.ok){
    throw new Error(datos.error || 'No se pudieron cargar los empleados')
  }
  return datos
}
export async function obtenerMiCuenta() {
  let respuesta
  try{
    respuesta = await fetch(`${URL}/perfil`,{headers:{Authorization: `Bearer ${obtenerToken()}`}})
  }catch{
    throw new Error('No se pudo conectar con el servidor')
  }
  const datos = await respuesta.json()
  if(!respuesta.ok){
    throw new Error(datos.error || 'No se pudo obtener la cuenta')
  }
  return datos
}

export async function obtenerTodosLosEmpleados() {
  let respuesta
  try {
    respuesta = await fetch(`${URL}/empleados/todos`, { headers: { Authorization: `Bearer ${obtenerToken()}` } })
  } catch {
    throw new Error('No se pudo conectar con el servidor')
  }
  const datos = await respuesta.json()
  if (!respuesta.ok) {
    throw new Error(datos.error || 'No se pudieron cargar los empleados')
  }
  return datos
}

export async function crearEmpleado(datos) {
  let respuesta
  try {
    respuesta = await fetch(`${URL}/empleados`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${obtenerToken()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    })
  } catch {
    throw new Error('No se pudo conectar con el servidor')
  }
  const creado = await respuesta.json()
  if (!respuesta.ok) {
    throw new Error(creado.error || 'No se pudo crear el empleado')
  }
  return creado
}

export async function actualizarEmpleado(id, datos) {
  let respuesta
  try {
    respuesta = await fetch(`${URL}/empleados/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${obtenerToken()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    })
  } catch {
    throw new Error('No se pudo conectar con el servidor')
  }
  manejarSesionVencida(respuesta)
  const actualizado = await respuesta.json()
  if (!respuesta.ok) {
    throw new Error(actualizado.error || 'No se pudo modificar el empleado')
  }
  if (obtenerSesion()?.id === actualizado.id) {
    guardarSesion(actualizado)
  }
  return actualizado
}

export async function cambiarActivoEmpleado(id, activo) {
  let respuesta
  try {
    respuesta = await fetch(`${URL}/empleados/${id}/activo`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${obtenerToken()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ activo })
    })
  } catch {
    throw new Error('No se pudo conectar con el servidor')
  }
  manejarSesionVencida(respuesta)
  const actualizado = await respuesta.json()
  if (!respuesta.ok) {
    throw new Error(actualizado.error || 'No se pudo cambiar el estado del empleado')
  }
  return actualizado
}
