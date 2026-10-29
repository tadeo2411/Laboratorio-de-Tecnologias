// aca va la logica de negocio. Genera id y llama a repository
import repository from "./trabajos.repository.js";
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
    if (datos.repuestos !== undefined && !Array.isArray(datos.repuestos)) {
        throw new httpError(400,'Los repuestos deben enviarse como un array');
    }

    validarId(datos.id)

    return repository.cargar(datos);
}

async function eliminar(id) {
    validarId(id, 'El id del repuesto');
    const trabajo = await repository.eliminar(id);

     if (!trabajo) {
        throw httpError(404, `El trabajo con id ${id} no esta registrado`)
    }
    return trabajo;
}

async function modificar(datos) {
    validarId(datos.id, 'El id del repuesto');
    const trabajo = await repository.modificar(datos);

    if (!trabajo) {
        throw httpError(404, `El trabajo con id ${datos.id} no esta registrado`)
    }
    return trabajo;
}

async function buscar(id) {
    validarId(id, 'El id del repuesto');
    const trabajo = await repository.buscar(id);

    if (!trabajo) {
        throw httpError(404, `El trabajo con id ${id} no esta registrado`)
    }
    return trabajo;
}

function buscarTipoTrabajo(id) {
    return repository.buscarTipoTrabajo(id);
}

export default { listar, cargar, eliminar, modificar, buscar, buscarTipoTrabajo };