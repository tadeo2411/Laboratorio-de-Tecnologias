// es quien recibe las req y responde res
// Lee `req.params` / `req.body`,
// llama al service y responde con status + JSON.
import authService from './auth.service.js'

async function login(req, res) {
    console.log(req.body);
    const { usuario, contrasena } = req.body ?? {}
    const sesion = await authService.iniciarSesion(usuario, contrasena)
    res.json(sesion)
}

async function perfil(req, res) {
   res.json(await authService.obtenerPerfil(req.usuario.id))
}

async function listarEmpleados(req,res){
    res.json(await authService.obtenerEmpleadosActivos())
}

async function listarTodosLosEmpleados(req,res){
    res.json(await authService.obtenerTodosLosEmpleados())
}

async function crearEmpleado(req,res){
    res.status(201).json(await authService.crearEmpleado(req.body ?? {}))
}

export default { login, perfil, listarEmpleados, listarTodosLosEmpleados, crearEmpleado }
