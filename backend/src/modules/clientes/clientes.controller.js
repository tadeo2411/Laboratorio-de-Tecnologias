// es quien recibe las req y responde res
// llama al service y responde con status + JSON.
// Si el service lanza un error (400, 404, 409...), Express lo manda al errorHandler.
const clientes = require('./clientes.service')


function listarClientes(req, res){
    const listaClientes = clientes.listarClientes(req.query.activo)
    res.json(listaClientes)
}

function buscarCliente(req,res){
    const documento = req.params.documento
    const clienteBuscado = clientes.buscarCliente(documento)
    res.json(clienteBuscado)
}

function altaCliente(req,res){
    const clienteCreado = clientes.altaCliente(req.body)
    res.status(201).json(clienteCreado)
}

function modificarCliente(req,res){
    const documento = req.params.documento
    const clienteModificado = clientes.modificarCliente(documento, req.body)
    res.json(clienteModificado)
}


module.exports = {listarClientes, buscarCliente, altaCliente, modificarCliente}
