import { redirect } from 'react-router'
import { ROLES, esAdministrador } from '../utils/roles'

const URL = '/backend/data'
const CLAVE_SESION = 'gestorTaller303:sesion'

let usuarios = null

async function leerUsuarios() {
  if (usuarios === null) {
    const respuesta = await fetch(`${URL}/usuarios.json`)
    if (!respuesta.ok) {
      throw new Error('No se pudo conectar para iniciar sesión.')
    }
    usuarios = await respuesta.json()
  }
  return usuarios
}

function guardarSesion(usuario) {
  const sesion = { id: usuario.id, usuario: usuario.usuario, nombre: usuario.nombre, rol: usuario.rol }
  sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion))
  return sesion
}

//Cambios con funciones nuevas
export async function iniciarSesion(usuario, contrasena) {
  const lista = await leerUsuarios()
  const encontrado = lista.find(
    (u) => u.usuario === usuario.trim().toLowerCase() && u.contrasena === contrasena)

  if (!encontrado) {
    throw new Error('Usuario o contraseña incorrectos.')
  }
  if (!encontrado.activo) {
    throw new Error('Tu usuario está dado de baja. Hablá con el administrador del taller.')
  }

  return guardarSesion(encontrado)
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
  const lista = await leerUsuarios()
  return lista
    .filter((u) => u.activo)
    .map((u) => ({ id: u.id, nombre: u.nombre }))
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
  const sesion = obtenerSesion()
  const lista = await leerUsuarios()
  return datosPublicos(buscarUsuario(lista, sesion?.id))
}

export async function obtenerTodosLosEmpleados() {
  exigirAdministrador()
  const lista = await leerUsuarios()
  return lista.map(datosPublicos)
}

export async function crearEmpleado(datos) {
  exigirAdministrador()
  const lista = await leerUsuarios()
  const datosValidados = validarEmpleado(lista, datos)

  if (!datos.contrasena || datos.contrasena.length < 8) {
    throw new Error('La contraseña inicial tiene que tener al menos 8 caracteres.')
  }

  const nuevoEmpleado = {
    ...datosValidados,
    id: Math.max(0, ...lista.map((u) => u.id)) + 1,
    activo: true,
    createdAt: new Date().toISOString(),
    contrasena: datos.contrasena
  }

  usuarios = [...lista, nuevoEmpleado]
  return datosPublicos(nuevoEmpleado)
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
