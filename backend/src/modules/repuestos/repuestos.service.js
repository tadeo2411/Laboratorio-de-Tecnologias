// aca va la logica de negocio. Genera id y llama a repository
import  repository  from "./repuestos.repository.js";
import { httpError } from "../../utils/httpError.js";
import { validarTextoObligatorio, validarMonto } from "../../utils/validsTexto.js";

const maxNombre = 120;

// El id llega como texto desde la URL (/:id). Devuelve el número ya convertido.
function validarId(id){
    const idNumerico = Number(id)
    if (!Number.isInteger(idNumerico) || idNumerico <= 0) {
        throw httpError(400, 'El id debe ser un número entero positivo')
    }
    return idNumerico
}

function validarDatos(datos) {
    validarTextoObligatorio(datos.nombre, "nombre", maxNombre);
    const precio = validarMonto(datos.precio_estandar, "precio_estandar");

    return { nombre: datos.nombre.trim(), precio_estandar: precio };
}

function listar() {
    return repository.listar();
}

function cargar(datos) {
    return repository.cargar(validarDatos(datos));
}

async function eliminar(id) {
    const idValido = validarId(id);
    const repuesto = await repository.eliminar(idValido);

    if (!repuesto) {
        throw httpError(404, `El repuesto con id ${id} no esta registrado`)
    }
    return repuesto;
}

async function modificar(datos) {
    const id = validarId(datos.id);
    const actual = await buscar(id);
    const validos = validarDatos({ ...actual, ...datos });

    return repository.modificar({ id, ...validos });
}

async function buscar(id) {
    const idValido = validarId(id);
    const repuesto = await repository.buscar(idValido);

    if (!repuesto) {
        throw httpError(404, `El repuesto con id ${id} no esta registrado`)
    }
    return repuesto;
}

export default { listar, cargar, eliminar, modificar, buscar };
