import { redirect } from 'react-router'
import { ROLES, esAdministrador } from '../utils/roles'

const URL = 'http://192.168.0.140:3000/api/auth'
const CLAVE_USUARIO = 'gestorTaller303:usuario'
const CLAVE_TOKEN = 'gestorTaller303:token'
const URL_DATOS = '/backend/data'

let usuarios = null

async function leerUsuarios() {
  if (usuarios === null) {
    const respuesta = await fetch(`${URL_DATOS}/usuarios.json`)
    if (!respuesta.ok) {
      throw new Error('No se pudieron cargar los empleados.')
    }
    usuarios = await respuesta.json()
  }
  return usuarios
}

function guardarSesion(usuario) {
  const sesion = { id: usuario.id, usuario: usuario.usuario, nombre: usuario.nombre, rol: usuario.rol }
  sessionStorage.setItem(CLAVE_USUARIO, JSON.stringify(sesion))
  return sesion
}

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
function datosPublicos(usuario) {
  return {
    id: usuario.id,
    usuario: usuario.usuario,
    nombre: usuario.nombre,
    rol: usuario.rol,
    activo: usuario.activo,
    createdAt: usuario.createdAt
  }
}

function exigirAdministrador() {
  const sesion = obtenerSesion()
  if (!esAdministrador(sesion)) {
    throw new Error('Solo el administrador puede gestionar empleados.')
  }
  return sesion
}

function buscarUsuario(lista, id) {
  const encontrado = lista.find((u) => u.id === id)
  if (!encontrado) {
    throw new Error('El empleado no existe.')
  }
  return encontrado
}

function validarEmpleado(lista, datos, idExcluido = null) {
  const nombre = datos.nombre.trim()
  const usuario = datos.usuario.trim().toLowerCase()

  if (!nombre) {
    throw new Error('Falta el nombre del empleado.')
  }
  if (nombre.length > 120) {
    throw new Error('El nombre puede tener hasta 120 caracteres.')
  }
  if (!usuario) {
    throw new Error('Falta el usuario.')
  }
  if (usuario.length > 50) {
    throw new Error('El usuario puede tener hasta 50 caracteres.')
  }
  if (!/^[a-z0-9._-]+$/.test(usuario)) {
    throw new Error('El usuario solo puede tener letras sin tilde, números, punto, guion y guion bajo (sin espacios).')
  }
  if (lista.some((u) => u.usuario === usuario && u.id !== idExcluido)) {
    throw new Error(`Ya existe un empleado con el usuario "${usuario}".`)
  }
  if (!ROLES[datos.rol]) {
    throw new Error('Elegí un rol válido.')
  }

  return { nombre, usuario, rol: datos.rol }
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
  const sesion = exigirAdministrador()
  const lista = await leerUsuarios()
  const empleadoActual = buscarUsuario(lista, id)
  const datosValidados = validarEmpleado(lista, datos, id)

  if (id === sesion.id && datosValidados.rol !== 'ADMINISTRADOR') {
    throw new Error('No podés quitarte a vos mismo el rol de administrador.')
  }

  const empleadoActualizado = { ...empleadoActual, ...datosValidados }
  usuarios = lista.map((u) => u.id === id ? empleadoActualizado : u)

  if (id === sesion.id) {
    guardarSesion(empleadoActualizado)
  }
  return datosPublicos(empleadoActualizado)
}

export async function cambiarActivoEmpleado(id, activo) {
  const sesion = exigirAdministrador()
  const lista = await leerUsuarios()
  const empleadoActual = buscarUsuario(lista, id)

  if (id === sesion.id && !activo) {
    throw new Error('No podés darte de baja a vos mismo.')
  }

  const empleadoActualizado = { ...empleadoActual, activo }
  usuarios = lista.map((u) => u.id === id ? empleadoActualizado : u)
  return datosPublicos(empleadoActualizado)
}
