// aca va la logica de negocio. Genera id y llama a repository
const clientesRepository = require("./clientes.repository");



function listarClientes(){
    const objetoCliente=clientesRepository.obtenerClientes()
    return objetoCliente
}

function buscarCliente(documento){
    const clienteBuscado = clientesRepository.buscarPorDocumento(documento)
    return clienteBuscado
}


module.exports = {listarClientes, buscarCliente}