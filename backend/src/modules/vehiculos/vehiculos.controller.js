// es quien recibe las req y responde res
// llama al service y responde con status + JSON.
import vehiculos from './vehiculos.service'


async function listar(req, res){
    const listaVehiculos = await vehiculos.listar()
    return res.json(listaVehiculos)
}

async function buscar(req, res){
    const id = req.params.id
    const vehiculoBuscado = await vehiculos.buscar(id)
    res.json(vehiculoBuscado)
}

async function alta(req, res){
    const vehiculo = await vehiculos.alta(req.body)
    res.status(201).json(vehiculo)
}

async function modificar(req, res){
    const id =req.params.id
    const vehiculoModificado = await vehiculos.modificar(id, req.body)
    res.json(vehiculoModificado)
}

export default {listar, buscar, alta, modificar}