// aca va la logica de negocio. Genera id y llama a repository
import  repository  from "./repuestos.repository.js";
import { httpError } from "../../utils/httpError.js";

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

async function eliminar(id) {
    validarId(id);
    const repuesto = await repository.eliminar(id);

     if (!repuesto) {
        throw httpError(404, `El repuesto con id ${id} no esta registrado`)
    }
    return repuesto;
}

async function modificar(datos) {
    validarId(datos.id, 'El id del repuesto');
    const repuesto = await repository.modificar(datos);

     if (!repuesto) {
        throw httpError(404, `El repuesto con id ${datos.id} no esta registrado`)
    }
    return repuesto;
}

async function buscar(id) {
    validarId(id, 'El id del repuesto');
    const repuesto = await repository.buscar(id);

     if (!repuesto) {
        throw httpError(404, `El repuesto con id ${id} no esta registrado`)
    }
    return repuesto;
}

export default { listar, cargar, eliminar, modificar, buscar };