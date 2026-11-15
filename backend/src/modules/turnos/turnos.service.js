// aca va la logica de negocio. Genera id y llama a repository
import repository from "./turnos.repository.js";
import vehiculosService from "../vehiculos/vehiculos.service.js";
import clientesService from "../clientes/clientes.service.js";
import { httpError } from "../../utils/httpError.js";
import { validarTextoObligatorio } from "../../utils/validsTexto.js";

const ESTADOS = ["CONFIRMADO", "CUMPLIDO", "CANCELADO", "AUSENTE"];
const TRANSICIONES = {
    "CONFIRMADO": ["CUMPLIDO", "CANCELADO", "AUSENTE"]
}
const DURACION_POR_DEFECTO = 60;
const DURACION_MAXIMA = 1440;
const maxMotivo = 500;

// El id llega como texto desde la URL (/:id). Devuelve el número ya convertido.
function validarId(id, nombre = "El id") {
    const idNumerico = Number(id)
    if (!Number.isInteger(idNumerico) || idNumerico <= 0) {
        throw httpError(400, `${nombre} debe ser un número entero positivo`)
    }
    return idNumerico
}

// Si lo que se busca no existe, para quien carga el turno es un dato inválido (400), no una ruta inexistente (404).
async function exigirExistente(buscarRegistro, mensaje) {
    try {
        return await buscarRegistro();
    } catch (error) {
        if (error.status === 404) {
            throw httpError(400, mensaje);
        }
        throw error;
    }
}

async function validarDatos(datos) {
    if (datos.id_cliente === undefined || datos.id_cliente === null) {
        throw httpError(400, "Tenés que elegir un cliente");
    }

    const idCliente = validarId(datos.id_cliente, "El cliente");

    await exigirExistente(
        () => clientesService.buscar(idCliente),
        "El cliente elegido no existe"
    );

    if (typeof datos.fecha_hora !== "string" || Number.isNaN(Date.parse(datos.fecha_hora))) {
        throw httpError(400, "La fecha y hora no son válidas");
    }

    const duracion = datos.duracion_min ?? DURACION_POR_DEFECTO;

    if (!Number.isInteger(duracion) || duracion <= 0 || duracion > DURACION_MAXIMA) {
        throw httpError(400, `La duración debe ser un número entero de minutos entre 1 y ${DURACION_MAXIMA}`);
    }

    validarTextoObligatorio(datos.motivo, "motivo", maxMotivo);

    const estado = datos.estado ?? "SOLICITADO";

    if (!ESTADOS.includes(estado)) {
        throw httpError(400, `El estado debe ser uno de: ${ESTADOS.join(", ")}`);
    }

    return {
        id_cliente: idCliente,
        fecha_hora: datos.fecha_hora,
        duracion_min: duracion,
        motivo: datos.motivo.trim(),
        estado
    };
}

function listar() {
    return repository.listar();
}

async function cargar(datos) {
    return repository.cargar(await validarDatos(datos));
}

async function eliminar(id) {
    const idValido = validarId(id);
    const turno = await repository.eliminar(idValido);
    if (!turno) {
        throw httpError(404, `El turno con id ${id} no esta registrado`)
    }
    return turno;
}

async function modificar(datos) {
    const id = validarId(datos.id);
    const actual = await buscar(id);

    // Si cambia el vehículo, el cliente se vuelve a buscar en sus dueños.
    const base = { ...actual };
    if (datos.id_vehiculo !== undefined && Number(datos.id_vehiculo) !== actual.id_vehiculo) {
        base.id_cliente = null;
    }

    const validos = await validarDatos({ ...base, ...datos });
    return repository.modificar({ id, ...validos });
}

async function buscar(id) {
    const idValido = validarId(id);

    const turno = await repository.buscar(idValido);

    if (!turno) {
        throw httpError(404, `El turno con id ${id} no esta registrado`)
    }

    return turno;
}

export default { listar, cargar, eliminar, modificar, buscar };
