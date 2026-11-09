
import repository from "./trabajos.repository.js";
import { httpError } from "../../utils/httpError.js";

// Validar y convertir ID
function validarId(id, nombre = "El id") {
    const idNumerico = Number(id);

    if (!Number.isInteger(idNumerico) || idNumerico <= 0) {
        throw httpError(400, `${nombre} debe ser un número entero positivo`);
    }

    return idNumerico;
}

// Validar array de repuestos
function validarRepuestos(repuestos) {
    if (repuestos !== undefined && !Array.isArray(repuestos)) {
        throw httpError(400, "Los repuestos deben enviarse como un array");
    }

    if (repuestos !== undefined) {
        for (const repuesto of repuestos) {
            validarId(repuesto.repuesto_id, "El id del repuesto");

            const cantidad = Number(repuesto.cantidad);

            if (!Number.isFinite(cantidad) || cantidad <= 0) {
                throw httpError(400, "La cantidad del repuesto debe ser mayor a cero");
            }
        }
    }
}

// Listar trabajos
function listar() {
    return repository.listar();
}

// Cargar trabajo
function cargar(datos) {
    validarId(datos.orden_id, "El id de la orden");
    validarId(datos.tipo_trabajo_id, "El id del tipo de trabajo");

    // Validar empleados
    if (
        !Array.isArray(datos.empleados) ||
        datos.empleados.length === 0
    ) {
        throw httpError(400, "Debe seleccionar al menos un empleado");
    }

    datos.empleados.forEach((empleado_id) => {
        validarId(empleado_id, "El id del empleado");
    });

    if (
        datos.mano_de_obra === undefined ||
        !Number.isFinite(Number(datos.mano_de_obra)) ||
        Number(datos.mano_de_obra) < 0
    ) {
        throw httpError(400, "El precio de mano de obra no es válido");
    }

    validarRepuestos(datos.repuestos);

    return repository.cargar(datos);
}

// Eliminar trabajo
async function eliminar(id) {
    validarId(id, "El id del trabajo");

    const trabajo = await repository.eliminar(id);

    if (!trabajo) {
        throw httpError(404, `El trabajo con id ${id} no está registrado`);
    }

    return trabajo;
}

// Modificar trabajo
async function modificar(datos) {
    validarId(datos.id, "El id del trabajo");

    if (datos.orden_id !== undefined) {
        validarId(datos.orden_id, "El id de la orden");
    }

    if (datos.tipo_trabajo_id !== undefined) {
        validarId(datos.tipo_trabajo_id, "El id del tipo de trabajo");
    }

    if (datos.empleado_id !== undefined && datos.empleado_id !== null) {
        validarId(datos.empleado_id, "El id del empleado");
    }

    if (
        datos.mano_de_obra !== undefined &&
        (
            !Number.isFinite(Number(datos.mano_de_obra)) ||
            Number(datos.mano_de_obra) < 0
        )
    ) {
        throw httpError(400, "El precio de mano de obra no es válido");
    }

    validarRepuestos(datos.repuestos);

    if (datos.estado !== undefined && typeof datos.estado !== "string") {
        throw httpError(400, "El estado debe ser un texto válido");
    }

    const trabajo = await repository.modificar(datos);

    if (!trabajo) {
        throw httpError(404, `El trabajo con id ${datos.id} no está registrado`);
    }

    return trabajo;
}

// Buscar trabajo
async function buscar(id) {
    validarId(id, "El id del trabajo");

    const trabajo = await repository.buscar(id);

    if (!trabajo) {
        throw httpError(404, `El trabajo con id ${id} no está registrado`);
    }

    return trabajo;
}

// Buscar tipo de trabajo
function buscarTipoTrabajo(id) {
    validarId(id, "El id del tipo de trabajo");
    return repository.buscarTipoTrabajo(id);
}

// Listar tipos de trabajo
function listarTipos() {
    return repository.listarTipos();
}

export default {
    listar,
    cargar,
    eliminar,
    modificar,
    buscar,
    buscarTipoTrabajo,
    listarTipos
};
