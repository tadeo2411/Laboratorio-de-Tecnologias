
import repository from "./trabajos.repository.js";
import ordenesService from "../ordenes/ordenes.service.js";
import repuestosService from "../repuestos/repuestos.service.js";
import authService from "../auth/auth.service.js";
import { httpError } from "../../utils/httpError.js";
import { validarTexto, validarMonto } from "../../utils/validsTexto.js";

const ESTADOS = ["PENDIENTE", "EN_PROCESO", "ESPERANDO_APROBACION", "TERMINADO", "CANCELADO"];
const maxDescripcion = 500;
const CANTIDAD_MAXIMA = 99999999.99;

// Validar y convertir ID
function validarId(id, nombre = "El id") {
    const idNumerico = Number(id);

    if (!Number.isInteger(idNumerico) || idNumerico <= 0) {
        throw httpError(400, `${nombre} debe ser un número entero positivo`);
    }

    return idNumerico;
}

async function exigirTipoActivo(id) {
    const tipo = await repository.buscarTipoTrabajo(id);

    if (!tipo || !tipo.activo) {
        throw httpError(400, "Elegí un tipo de trabajo válido");
    }
}

// Los empleados tienen que existir, estar activos y no repetirse
async function validarEmpleados(empleados) {
    if (!Array.isArray(empleados) || empleados.length === 0) {
        throw httpError(400, "Debe seleccionar al menos un empleado");
    }

    const ids = empleados.map((empleado) => validarId(empleado, "El id del empleado"));

    if (new Set(ids).size !== ids.length) {
        throw httpError(400, "Hay un empleado repetido");
    }

    const activos = await authService.obtenerEmpleadosActivos();

    for (const id of ids) {
        if (!activos.some((activo) => activo.id === id)) {
            throw httpError(400, `El empleado ${id} no existe o está dado de baja`);
        }
    }

    return ids;
}

// Los repuestos tienen que existir, estar activos y no repetirse
async function validarRepuestos(repuestos) {
    if (!Array.isArray(repuestos)) {
        throw httpError(400, "Los repuestos deben enviarse como un array");
    }

    const disponibles = await repuestosService.listar();
    const vistos = new Set();

    return repuestos.map((repuesto) => {
        const id = validarId(repuesto?.repuesto_id, "El id del repuesto");

        if (vistos.has(id)) {
            throw httpError(400, "Hay un repuesto repetido, usá una sola fila con la cantidad total");
        }
        vistos.add(id);

        if (!disponibles.some((disponible) => disponible.id === id && disponible.activo)) {
            throw httpError(400, `El repuesto ${id} no existe o está inactivo`);
        }

        const cantidad = Number(repuesto.cantidad);

        if (!Number.isFinite(cantidad) || cantidad <= 0 || cantidad > CANTIDAD_MAXIMA) {
            throw httpError(400, "La cantidad del repuesto debe ser mayor a cero");
        }

        return { repuesto_id: id, cantidad };
    });
}

function validarEstado(estado) {
    if (estado !== undefined && !ESTADOS.includes(estado)) {
        throw httpError(400, `El estado debe ser uno de: ${ESTADOS.join(", ")}`);
    }
}

function limpiarDescripcion(descripcion) {
    if (descripcion === undefined || descripcion === null) {
        return null;
    }

    validarTexto(descripcion, "descripcion", maxDescripcion);
    return descripcion.trim() || null;
}

// Listar trabajos
function listar() {
    return repository.listar();
}

// Cargar trabajo
async function cargar(datos) {
    const ordenId = validarId(datos.orden_id, "El id de la orden");
    await ordenesService.validarOrdenParaTrabajos(ordenId);

    const tipoId = validarId(datos.tipo_trabajo_id, "El id del tipo de trabajo");
    await exigirTipoActivo(tipoId);

    const empleados = await validarEmpleados(datos.empleados);
    const manoDeObra = validarMonto(datos.mano_de_obra, "mano_de_obra");
    const repuestos = await validarRepuestos(datos.repuestos ?? []);
    validarEstado(datos.estado);

    return repository.cargar({
        orden_id: ordenId,
        tipo_trabajo_id: tipoId,
        descripcion: limpiarDescripcion(datos.descripcion),
        empleados,
        mano_de_obra: manoDeObra,
        estado: datos.estado,
        repuestos
    });
}

// Eliminar trabajo
async function eliminar(id) {
    const idValido = validarId(id, "El id del trabajo");
    const trabajo = await buscar(idValido);

    await ordenesService.validarOrdenParaTrabajos(trabajo.orden_id);

    return repository.eliminar(idValido);
}

// Modificar trabajo: lo que no se manda queda como estaba
async function modificar(datos) {
    const id = validarId(datos.id, "El id del trabajo");
    const actual = await buscar(id);

    await ordenesService.validarOrdenParaTrabajos(actual.orden_id);

    let ordenId = actual.orden_id;
    if (datos.orden_id !== undefined) {
        ordenId = validarId(datos.orden_id, "El id de la orden");
        if (ordenId !== actual.orden_id) {
            await ordenesService.validarOrdenParaTrabajos(ordenId);
        }
    }

    let tipoId = actual.tipo_trabajo_id;
    if (datos.tipo_trabajo_id !== undefined) {
        tipoId = validarId(datos.tipo_trabajo_id, "El id del tipo de trabajo");
        if (tipoId !== actual.tipo_trabajo_id) {
            await exigirTipoActivo(tipoId);
        }
    }

    const manoDeObra = datos.mano_de_obra !== undefined
        ? validarMonto(datos.mano_de_obra, "mano_de_obra")
        : actual.mano_de_obra;

    const descripcion = datos.descripcion !== undefined
        ? limpiarDescripcion(datos.descripcion)
        : actual.descripcion;

    const empleados = datos.empleados !== undefined
        ? await validarEmpleados(datos.empleados)
        : undefined;

    const repuestos = datos.repuestos !== undefined
        ? await validarRepuestos(datos.repuestos)
        : undefined;

    validarEstado(datos.estado);

    return repository.modificar({
        id,
        orden_id: ordenId,
        tipo_trabajo_id: tipoId,
        descripcion,
        mano_de_obra: manoDeObra,
        estado: datos.estado,
        empleados,
        repuestos
    });
}

// Buscar trabajo
async function buscar(id) {
    const idValido = validarId(id, "El id del trabajo");

    const trabajo = await repository.buscar(idValido);

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
