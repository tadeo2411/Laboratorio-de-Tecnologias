// es quien recibe las req y responde res
// Lee `req.params` / `req.body`,
// llama al service y responde con status + JSON.
import listar from './clientes.service.js'

function listarClientes(req, res){
    const listaClientes = listar()
    res.json(listaClientes)
}
export default {listarClientes}