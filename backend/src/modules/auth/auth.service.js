// aca va la logica de negocio. Genera id y llama a repository
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authRepository = require('./auth.repository')
const { env } = require('../../config/env')

const HASH_DE_RELLENO = bcrypt.hashSync('usuario-inexistente', 10)

function crearError(status, mensaje) {
    const error = new Error(mensaje)
    error.status = status
    return error
}

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
        throw crearError(400, 'Usuario y contraseña son obligatorios')
    }

    const encontrado = authRepository.buscarPorUsuario(usuario.trim().toLowerCase())
    const contrasenaOk = await bcrypt.compare(contrasena, encontrado?.contrasenaHash ?? HASH_DE_RELLENO)

    if (!encontrado || !contrasenaOk) {
        throw crearError(401, 'Credenciales inválidas')
    }
    if (!encontrado.activo) {
        throw crearError(403, 'Tu usuario está dado de baja. Hablá con el administrador del taller')
    }

    const usuarioPublico = datosPublicos(encontrado)
    const token = jwt.sign(usuarioPublico, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN })

    return { token, usuario: usuarioPublico }
}

function obtenerPerfil(id) {
    const usuario = authRepository.buscarPorId(id)

    if (!usuario || !usuario.activo) {
        throw crearError(401, 'El usuario ya no tiene acceso al sistema')
    }
    return datosPublicos(usuario)
}

module.exports = { iniciarSesion, obtenerPerfil }
