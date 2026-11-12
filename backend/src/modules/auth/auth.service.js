// aca va la logica de negocio. Genera id y llama a repository
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import authRepository from './auth.repository.js'
import { env } from '../../config/env.js'
import { httpError } from '../../utils/httpError.js'
import {validarTextoObligatorio} from '../../utils/validsTexto.js'

const HASH_DE_RELLENO = bcrypt.hashSync('usuario-inexistente', 10)
const ROLES = ['ADMINISTRADOR', 'MECANICO']

function datosPublicos(usuario) {
    return {
        id: usuario.id,
        usuario: usuario.usuario,
        nombre: usuario.nombre,
        rol: usuario.rol
    }
}

async function iniciarSesion(usuario, contrasena) {
    if (typeof usuario !== 'string' || typeof contrasena !== 'string' || !usuario.trim() || !contrasena) {
        throw httpError(400, 'Usuario y contraseña son obligatorios')
    }

    const encontrado = await authRepository.buscarPorUsuario(usuario.trim().toLowerCase())
    const contrasenaOk = await bcrypt.compare(contrasena, encontrado?.password_hash ?? HASH_DE_RELLENO)

    if (!encontrado || !contrasenaOk) {
        throw httpError(401, 'Credenciales inválidas')
    }
    if (!encontrado.activo) {
        throw httpError(403, 'Tu usuario está dado de baja. Hablá con el administrador del taller')
    }

    const usuarioPublico = datosPublicos(encontrado)
    const token = jwt.sign(usuarioPublico, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN })

    return { token, usuario: usuarioPublico }
}

async function obtenerPerfil(id) {
    const usuario = await authRepository.buscarPorId(id)

    if (!usuario || !usuario.activo) {
        throw httpError(401, 'El usuario ya no tiene acceso al sistema')
    }
    return datosPublicos(usuario)
}

async function obtenerEmpleadosActivos() {
    return authRepository.obtenerEmpleadosActivos()
}

async function obtenerTodosLosEmpleados(){
    return authRepository.obtenerTodosLosEmpleados()
}

async function crearEmpleado(datos){
    validarTextoObligatorio(datos.nombre, 'nombre', 120)
    validarTextoObligatorio(datos.usuario, 'usuario', 50)
    const usuario = datos.usuario.trim().toLowerCase()
    if(!ROLES.includes(datos.rol)){
        throw httpError(400, 'El rol tiene que ser Administrador o Mecanico')
    }else if(typeof datos.contrasena !== 'string' || datos.contrasena.length < 8){
        throw httpError(400, 'La contraseña tiene que tener al menos 8 caracteres')
    }
    const passwordHash = await bcrypt.hash(datos.contrasena, 10)
    const id = await authRepository.crearEmpleado({nombre:datos.nombre.trim(), usuario, passwordHash, rol:datos.rol})
    return datosPublicos(await authRepository.buscarPorId(id))
} 

function datosEmpleado(usuario) {
    return { ...datosPublicos(usuario), activo: usuario.activo }
}

async function buscarEmpleado(idRecibido) {
    const id = Number(idRecibido)
    if (!Number.isInteger(id) || id <= 0) {
        throw httpError(400, 'El id del empleado tiene que ser un número entero positivo')
    }
    const empleado = await authRepository.buscarPorId(id)
    if (!empleado) {
        throw httpError(404, `No existe el empleado ${id}`)
    }
    return empleado
}

async function modificarEmpleado(idRecibido, datos, idSesion) {
    const empleado = await buscarEmpleado(idRecibido)
    validarTextoObligatorio(datos.nombre, 'nombre', 120)
    validarTextoObligatorio(datos.usuario, 'usuario', 50)
    if (!ROLES.includes(datos.rol)) {
        throw httpError(400, 'El rol tiene que ser Administrador o Mecanico')
    }
    if (empleado.id === idSesion && datos.rol !== 'ADMINISTRADOR') {
        throw httpError(409, 'No podés quitarte a vos mismo el rol de administrador')
    }

    let passwordHash = null
    if (datos.contrasena !== undefined && datos.contrasena !== '') {
        if (typeof datos.contrasena !== 'string' || datos.contrasena.length < 8) {
            throw httpError(400, 'La contraseña tiene que tener al menos 8 caracteres')
        }
        passwordHash = await bcrypt.hash(datos.contrasena, 10)
    }

    await authRepository.modificarEmpleado(empleado.id, {
        nombre: datos.nombre.trim(),
        usuario: datos.usuario.trim().toLowerCase(),
        rol: datos.rol,
        passwordHash
    })
    return datosEmpleado(await authRepository.buscarPorId(empleado.id))
}

async function cambiarActivoEmpleado(idRecibido, activo, idSesion) {
    if (typeof activo !== 'boolean') {
        throw httpError(400, 'activo tiene que ser true o false')
    }
    const empleado = await buscarEmpleado(idRecibido)
    if (!activo && empleado.id === idSesion) {
        throw httpError(409, 'No podés darte de baja a vos mismo')
    }
    await authRepository.cambiarActivo(empleado.id, activo)
    return datosEmpleado(await authRepository.buscarPorId(empleado.id))
}

export default { iniciarSesion, obtenerPerfil, obtenerEmpleadosActivos, obtenerTodosLosEmpleados, crearEmpleado, modificarEmpleado, cambiarActivoEmpleado }
