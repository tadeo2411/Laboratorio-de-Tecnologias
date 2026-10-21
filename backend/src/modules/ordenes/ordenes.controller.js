// es quien recibe las req y responde res
// Lee `req.params` / `req.body`,
// llama al service y responde con status + JSON.
const ordenesService = require('./ordenes.service')

function listar(req, res) {
    res.json(ordenesService.listarOrdenes(req.query))
}

function obtener(req, res) {
    res.json(ordenesService.obtenerOrden(req.params.id))
}

function crear(req, res) {
    const orden = ordenesService.crearOrden(req.body ?? {})
    res.status(201).json(orden)
}

function actualizar(req, res) {
    res.json(ordenesService.actualizarOrden(req.params.id, req.body ?? {}))
}

function cambiarEstado(req, res) {
    const { estado } = req.body ?? {}
    res.json(ordenesService.cambiarEstado(req.params.id, estado))
}

function agregarFicha(req, res) {
    const orden = ordenesService.agregarFicha(req.params.id, req.body ?? {})
    res.status(201).json(orden)
}

function agregarTrabajo(req, res) {
    const orden = ordenesService.agregarTrabajo(req.params.id, req.body ?? {})
    res.status(201).json(orden)
}

function quitarTrabajo(req, res) {
    res.json(ordenesService.quitarTrabajo(req.params.id, req.params.idTrabajo))
}

module.exports = { listar, obtener, crear, actualizar, cambiarEstado, agregarFicha, agregarTrabajo, quitarTrabajo }
