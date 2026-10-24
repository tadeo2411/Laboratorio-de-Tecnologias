// aca va la logica de negocio. Genera id y llama a repository
import  repository  from "./repuestos.repository.js";

function listar() {
    return repository.listar();
}

function cargar(datos) {
    return repository.cargar(datos);
}

function eliminar(id) {
    return repository.eliminar(id);
}

function modificar(id) {
    return repository.modificar(datos);
}

export default { listar, cargar, eliminar, modificar };