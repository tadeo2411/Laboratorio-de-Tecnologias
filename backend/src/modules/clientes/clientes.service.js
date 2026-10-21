// aca va la logica de negocio. Genera id y llama a repository
import clientesRepository from "./clientes.repository.js";

function listar() {
    const objetoCliente = clientesRepository.obtenerClientes();

    return objetoCliente;
}

export default listar ;