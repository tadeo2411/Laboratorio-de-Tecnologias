// es quien recibe las req y responde res
// Lee `req.params` / `req.body`,
// llama al service y responde con status + JSON.
const clientes = require('./clientes.service')

function listarClientes(req, res){
    const listaClientes = clientes.listarClientes()
    res.json(listaClientes)
}
module.exports = {listarClientes}