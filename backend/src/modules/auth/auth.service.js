// aca va la logica de negocio. Genera id y llama a repository
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import authRepository from './auth.repository.js'
import { env } from '../../config/env.js'
import { httpError } from '../../utils/httpError.js'

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

    const encontrado = authRepository.buscarPorUsuario(usuario.trim().toLowerCase())
    const contrasenaOk = await bcrypt.compare(contrasena, encontrado?.contrasenaHash ?? HASH_DE_RELLENO)

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

function obtenerPerfil(id) {
    const usuario = authRepository.buscarPorId(id)

    if (!usuario || !usuario.activo) {
        throw httpError(401, 'El usuario ya no tiene acceso al sistema')
    }
    return datosPublicos(usuario)
}

async function obtenerEmpleadosActivos() {
    return authRepository.obtenerUsuarios()
        .filter((usuario) => usuario.activo)
        .map((usuario) => ({ id: usuario.id, nombre: usuario.nombre }))
}

export default { iniciarSesion, obtenerPerfil, obtenerEmpleadosActivos }
