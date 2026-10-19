// aca va la logica de negocio. Genera id y llama a repository
const clientesRepository = require("./clientes.repository");



function listarClientes(){
    const objetoCliente=clientesRepository.obtenerClientes()
    return objetoCliente
}


module.exports = {listarClientes}