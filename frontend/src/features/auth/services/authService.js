import { redirect } from 'react-router'

const URL = 'http://localhost:3000/api/auth'
const CLAVE_USUARIO = 'gestorTaller303:usuario'
const CLAVE_TOKEN = 'gestorTaller303:token'

export async function iniciarSesion(usuario, contrasena) {
  let respuesta
  try {
    respuesta = await fetch(`${URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

export function protegerRuta() {
  const sesion = obtenerSesion()
  if (!sesion || !obtenerToken()) {
    throw redirect('/login')
  }
  return sesion
}

export function redirigirSiHaySesion() {
  const sesion = obtenerSesion()
  if (sesion && obtenerToken()) {
    throw redirect('/gestor')
  }
  return null
}
