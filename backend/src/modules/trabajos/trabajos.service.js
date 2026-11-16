
import repository from "./trabajos.repository.js";
import { httpError } from "../../utils/httpError.js";
import { validarTextoObligatorio, validarMonto } from "../../utils/validsTexto.js";

const CATEGORIAS = ["MANTENIMIENTO", "REPARACION", "DIAGNOSTICO"];
const maxNombre = 120;

// Validar y convertir ID
function validarId(id, nombre = "El id") {
    const idNumerico = Number(id);

    if (!Number.isInteger(idNumerico) || idNumerico <= 0) {
        throw httpError(400, `${nombre} debe ser un número entero positivo`);
    }

    return idNumerico;
}

function validarDatos(datos) {
    validarTextoObligatorio(datos.nombre, "nombre", maxNombre);

    if (!CATEGORIAS.includes(datos.categoria)) {
        throw httpError(400, `La categoría debe ser una de: ${CATEGORIAS.join(", ")}`);
    }

    const precio = validarMonto(datos.precio_estandar, "precio_estandar");

    if (typeof datos.activo !== "boolean") {
        throw httpError(400, "El campo activo debe ser verdadero o falso");
    }

    return {
        nombre: datos.nombre.trim(),
        categoria: datos.categoria,
        precio_estandar: precio,
        activo: datos.activo
    };
}

// Listar tipos de trabajo
function listar() {
    return repository.listar();
}

// Cargar tipo de trabajo: nace activo
function cargar(datos) {
    return repository.cargar(validarDatos({ activo: true, ...datos }));
}

// Buscar tipo de trabajo
async function buscar(id) {
    const idValido = validarId(id, "El id del tipo de trabajo");
    const tipo = await repository.buscar(idValido);

    if (!tipo) {
        throw httpError(404, `El tipo de trabajo con id ${id} no está registrado`);
    }

    return tipo;
}

// Modificar tipo de trabajo: lo que no se manda queda como estaba
async function modificar(datos) {
    const id = validarId(datos.id, "El id del tipo de trabajo");
    const actual = await buscar(id);

    return repository.modificar({ id, ...validarDatos({ ...actual, ...datos }) });
}

// Eliminar tipo de trabajo: si ya se usó en alguna orden hay que desactivarlo
async function eliminar(id) {
    const idValido = validarId(id, "El id del tipo de trabajo");
    await buscar(idValido);

    if (await repository.contarUsos(idValido) > 0) {
        throw httpError(409, "El tipo de trabajo ya se usó en órdenes: no se puede eliminar, desactivalo");
    }

    return repository.eliminar(idValido);
}

// Buscar tipo de trabajo (lo usa el módulo de órdenes; devuelve undefined si no existe)
function buscarTipoTrabajo(id) {
    validarId(id, "El id del tipo de trabajo");
    return repository.buscar(id);
}

export default {
    listar,
    cargar,
    buscar,
    modificar,
    eliminar,
    buscarTipoTrabajo
};
