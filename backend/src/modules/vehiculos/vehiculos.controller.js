// es quien recibe las req y responde res
// llama al service y responde con status + JSON.
import vehiculosService from './vehiculos.service.js'


async function listar(req, res){
    const listavehiculosService = await vehiculosService.listar()
    return res.json(listavehiculosService)
}

async function buscar(req, res){
    const id = req.params.id
    const vehiculoBuscado = await vehiculosService.buscar(id)
    res.json(vehiculoBuscado)
}

async function alta(req, res){
    const vehiculo = await vehiculosService.alta(req.body)
    res.status(201).json(vehiculo)
}

async function modificar(req, res){
    const id =req.params.id
    const vehiculoModificado = await vehiculosService.modificar(id, req.body)
    res.json(vehiculoModificado)
}

async function eliminar (req, res){
    await vehiculosService.eliminar(req.params.id)
    res.status(204).send()
}

// parte de duenios

async function listarDuenos(req, res){
    const listaDuenos = await vehiculosService.listarDuenos(req.params.id)
    res.json(listaDuenos)
}

async function buscarDueno(req, res){
    const dueno = await vehiculosService.buscarDueno(req.params.id, req.params.idCliente)
    res.json(dueno)
}

async function asociarDueno(req, res){
    const dueno = await vehiculosService.asociarDueno(req.params.id, req.params.idCliente)
    res.status(201).json(dueno)
}

async function desasociarDueno(req, res) {
    await vehiculosService.desasociarDueno(req.params.id, req.params.idCliente)
    res.status(204).send()
}

export default {listar, buscar, alta, modificar, eliminar, listarDuenos, buscarDueno, asociarDueno, desasociarDueno}