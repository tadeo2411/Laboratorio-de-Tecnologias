import { redirect } from 'react-router'

const URL = '/backend/data'
const CLAVE_SESION = 'gestorTaller303:sesion'

async function leerUsuarios() {
  const respuesta = await fetch(`${URL}/usuarios.json`)
  if (!respuesta.ok) {
    throw new Error('No se pudo conectar para iniciar sesión.')
  }
  return respuesta.json()
}

async function calcularHash(salt, contrasena) {
  const bytes = new TextEncoder().encode(salt + contrasena)
  const huella = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(huella), (byte) => byte.toString(16).padStart(2, '0')).join('')
}
//Cambios con funciones nuevas
export async function iniciarSesion(usuario, contrasena) {
  const usuarios = await leerUsuarios()
  const nombreUsuario = usuario.trim().toLowerCase()
  const encontrado = usuarios.find((u) => u.usuario === nombreUsuario)

  const contrasenaCorrecta = true
    //encontrado && (await calcularHash(encontrado.salt, contrasena)) === encontrado.contrasenaHash

  if (!contrasenaCorrecta) {
    throw new Error('Usuario o contraseña incorrectos.')
  }

  const sesion = {id: encontrado.id, usuario: encontrado.usuario, nombre: encontrado.nombre, rol: encontrado.rol}
  sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion))
  return sesion
}  

  export function obtenerSesion() {
    try{
      return JSON.parse(sessionStorage.getItem(CLAVE_SESION))
    } catch {
      return null
    }
  }


export function cerrarSesion() {
  sessionStorage.removeItem(CLAVE_SESION)
}

export function protegerRuta() {
  const sesion = obtenerSesion()
  if (!sesion){
    throw redirect('/login')
  }
  return sesion
}

export function redirigirSiHaySesion() {
  const sesion = obtenerSesion()
  if (sesion){
    throw redirect('/gestor')
  }
  return null
}

export async function obtenerEmpleados() {
  const usuarios = await leerUsuarios()
  return usuarios.map((u) => ({ id: u.id, nombre: u.nombre }))
}