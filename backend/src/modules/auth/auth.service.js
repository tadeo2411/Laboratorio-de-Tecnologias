// aca va la logica de negocio. Genera id y llama a repository
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import authRepository from './auth.repository.js'
import { env } from '../../config/env.js'
import { httpError } from '../../utils/httpError.js'
import {validarTextoObligatorio} from '../../utils/validsTexto.js'

const HASH_DE_RELLENO = bcrypt.hashSync('usuario-inexistente', 10)

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
    const ROLES = ['ADMINISTRADOR', 'MECANICO']
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

export default { iniciarSesion, obtenerPerfil, obtenerEmpleadosActivos, obtenerTodosLosEmpleados, crearEmpleado }
