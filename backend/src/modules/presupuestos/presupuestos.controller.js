import presupuestosService from './presupuestos.service.js'

async function listar(req, res) {
    res.json(await presupuestosService.listarPresupuestos(req.query))
}

async function obtener(req, res) {
    res.json(await presupuestosService.obtenerPresupuesto(req.params.id))
}

async function trabajosPresupuestables(req, res) {
    res.json(await presupuestosService.obtenerTrabajosPresupuestables(req.query.ordenId))
}

async function crear(req, res) {
    const presupuesto = await presupuestosService.crearPresupuesto(req.body ?? {})
    res.status(201).json(presupuesto)
}

async function actualizar(req, res) {
    res.json(await presupuestosService.actualizarPresupuesto(req.params.id, req.body ?? {}))
}

async function eliminar(req, res) {
    await presupuestosService.eliminarPresupuesto(req.params.id)
    res.status(204).end()
}

export default { listar, obtener, trabajosPresupuestables, crear, actualizar, eliminar }
