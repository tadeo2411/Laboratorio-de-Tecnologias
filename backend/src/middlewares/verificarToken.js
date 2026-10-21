const jwt = require('jsonwebtoken')
const { env } = require('../config/env')

function verificarToken(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Falta el token' })
    }

    const token = authHeader.split(' ')[1]

    try {
        const payload = jwt.verify(token, env.JWT_SECRET)
        req.usuario = { id: payload.id, usuario: payload.usuario, nombre: payload.nombre, rol: payload.rol }
        next()
    } catch (err) {
        const mensaje = err.name === 'TokenExpiredError' ? 'Token vencido' : 'Token inválido'
        return res.status(401).json({ error: mensaje })
    }
}

module.exports = { verificarToken }
