// aca va la logica de negocio. Genera id y llama a repository
import  repository  from "./turnos.repository.js";

// El id llega como texto desde la URL (/:id). Devuelve el número ya convertido.
function validarId(id){
    const idNumerico = Number(id)
    if (!Number.isInteger(idNumerico) || idNumerico <= 0) {
        throw httpError(400, 'El id debe ser un número entero positivo')
    }
    return idNumerico
}

function listar() {
    return repository.listar();
}

function cargar(datos) {
    return repository.cargar(datos);
}

function eliminar(id) {
    validarId(datos.id, 'El id del repuesto');
    return repository.eliminar(id);
}

function modificar(datos) {
    validarId(datos.id, 'El id del repuesto');
    return repository.modificar(datos);
}

function buscar(id) {
    validarId(datos.id, 'El id del repuesto');
    return repository.buscar(id);
}

export default { listar, cargar, eliminar, modificar, buscar };