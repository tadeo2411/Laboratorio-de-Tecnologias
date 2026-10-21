// es quien recibe las req y responde res
// Lee `req.params` / `req.body`,
// llama al service y responde con status + JSON.
const clientes = require('./clientes.service')


function listarClientes(req, res){
    const listaClientes = clientes.listarClientes()
    res.json(listaClientes)
}

function buscarCliente(req,res){
    const documento = req.params.documento
    const clienteBuscado = clientes.buscarCliente(documento)
    if(!clienteBuscado){
        return res.status(404).json({error: `El cliente con documento ${documento} no esta registrado`})
    }
    res.json(clienteBuscado)
}
function altaCliente(req,res){
    const cliente = req.params
}




module.exports = {listarClientes, buscarCliente}