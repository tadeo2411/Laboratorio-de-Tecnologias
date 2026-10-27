// es quien recibe las req y responde res
// llama al service y responde con status + JSON.
// Si el service lanza un error (400, 404, 409...), Express lo manda al errorHandler.
import clientes from './clientes.service.js'


async function listar(req, res){
    const listaClientes = await clientes.listar()
    res.json(listaClientes)
}

async function buscar(req,res){
    const clienteBuscado = await clientes.buscar(req.params.id)
    res.json(clienteBuscado)
}

async function alta(req,res){
    const clienteCreado = await clientes.alta(req.body)
    res.status(201).json(clienteCreado)
}

async function modificar(req,res){
    const clienteModificado = await clientes.modificar(req.params.id, req.body)
    res.json(clienteModificado)
}

async function eliminar(req, res){
    await clientes.eliminar(req.params.id)
    res.status(204).send()
}


export default {listar, buscar, alta, modificar, eliminar}
