// aca va la logica de negocio. Genera id y llama a repository
import  repository  from "./repuestos.repository.js";

function listar() {
    const objetoRepuestos = repository.listarRepuestos();

    return objetoRepuestos;
}

export default { listar };