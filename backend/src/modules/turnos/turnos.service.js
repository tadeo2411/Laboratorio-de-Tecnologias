// aca va la logica de negocio. Genera id y llama a repository
import  repository  from "./turnos.repository.js";
import { httpError } from "../../utils/httpError.js";

// El id llega como texto desde la URL (/:id). Devuelve el número ya convertido.
function validarId(id){
    const idNumerico = Number(id)
    if (!Number.isInteger(idNumerico) || idNumerico <= 0) {
        throw httpError(400, 'El id debe ser un número entero positivo')
    }
    return id
}

function listar() {
    return repository.listar();
}

function cargar(datos) {
    validarId(datos.id_vehiculo);
    validarId(datos.id_cliente);
    return repository.cargar(datos);
}

async function eliminar(id) {
    validarId(id);
    const turno = await repository.eliminar(id);
    if (!turno) {
        throw httpError(404, `El turno con id ${id} no esta registrado`)
    }
    return turno;
}

async function modificar(datos) {
    validarId(datos.id);
    const turno = await repository.modificar(datos);

    if (!turno) {
        throw httpError(404, `El turno con id ${datos.id} no esta registrado`)
    }
    return turno;
}

async function buscar(id) {
    validarId(id);
    
    const turno = await repository.buscar(id);

    if (!turno) {
        throw httpError(404, `El turno con id ${id} no esta registrado`)
    }

    return turno;
}

export default { listar, cargar, eliminar, modificar, buscar };