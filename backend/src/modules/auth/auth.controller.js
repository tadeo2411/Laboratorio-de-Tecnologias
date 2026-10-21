// es quien recibe las req y responde res
// Lee `req.params` / `req.body`,
// llama al service y responde con status + JSON.
const authService = require('./auth.service')

async function login(req, res) {
    const { usuario, contrasena } = req.body ?? {}
    const sesion = await authService.iniciarSesion(usuario, contrasena)
    res.json(sesion)
}

function perfil(req, res) {
    res.json(authService.obtenerPerfil(req.usuario.id))
}

module.exports = { login, perfil }
