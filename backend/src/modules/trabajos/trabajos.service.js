// aca va la logica de negocio. Genera id y llama a repository
import  repository  from "./trabajos.repository.js";

function listar() {
    return repository.listar();
}

function cargar(datos) {
    return repository.cargar(datos);
}

function eliminar(id) {
    return repository.eliminar(id);
}

function modificar(datos) {
    return repository.modificar(datos);
}

function buscarTipoTrabajo(id) {
    return repository.buscarTipoTrabajo(id);
}

export default { listar, cargar, eliminar, modificar, buscarTipoTrabajo };
