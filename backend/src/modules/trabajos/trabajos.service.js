// aca va la logica de negocio. Genera id y llama a repository
import repository from "./trabajos.repository.js";


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
    if (datos.repuestos !== undefined && !Array.isArray(datos.repuestos)) {
        throw new Error('Los repuestos deben enviarse como un array');
    }

    return repository.cargar(datos);
}

function eliminar(id) {
    validarId(id, 'El id del repuesto');
    return repository.eliminar(id);
}

function modificar(datos) {
    validarId(datos.id, 'El id del repuesto');
    return repository.modificar(datos);
}

function buscar(id) {
    validarId(id, 'El id del repuesto');
    return repository.buscar(id);
}

function buscarTipoTrabajo(id) {
    return repository.buscarTipoTrabajo(id);
}

export default { listar, cargar, eliminar, modificar, buscar, buscarTipoTrabajo };