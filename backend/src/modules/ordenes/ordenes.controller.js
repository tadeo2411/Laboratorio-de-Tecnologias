// es quien recibe las req y responde res
// Lee `req.params` / `req.body`,
// llama al service y responde con status + JSON.
import ordenesService from './ordenes.service.js'

async function listar(req, res) {
    res.json(await ordenesService.listarOrdenes(req.query))
}

async function obtener(req, res) {
    res.json(await ordenesService.obtenerOrden(req.params.id))
}

async function crear(req, res) {
    const orden = await ordenesService.crearOrden(req.body ?? {})
    res.status(201).json(orden)
}

async function actualizar(req, res) {
    res.json(await ordenesService.actualizarOrden(req.params.id, req.body ?? {}))
}

async function cambiarEstado(req, res) {
    const { estado } = req.body ?? {}
    res.json(await ordenesService.cambiarEstado(req.params.id, estado))
}

async function agregarFicha(req, res) {
    const orden = await ordenesService.agregarFicha(req.params.id, req.body ?? {})
    res.status(201).json(orden)
}

async function agregarTrabajo(req, res) {
    const orden = await ordenesService.agregarTrabajo(req.params.id, req.body ?? {})
    res.status(201).json(orden)
}

async function quitarTrabajo(req, res) {
    res.json(await ordenesService.quitarTrabajo(req.params.id, req.params.idTrabajo))
}

export default { listar, obtener, crear, actualizar, cambiarEstado, agregarFicha, agregarTrabajo, quitarTrabajo }
