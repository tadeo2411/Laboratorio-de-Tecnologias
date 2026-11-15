//ESTADOS SOLICITADO, CONFIRMADO, CUMPLIDO, CANCELADO, AUSENTE
import { obtenerToken, manejarSesionVencida } from '../../auth';
import { API_URL } from '../../../shared/config/api';

export const estadosTurno = [ 'CONFIRMADO', 'CUMPLIDO', 'CANCELADO', 'AUSENTE' ]
const URL = API_URL

async function pedir(ruta, opciones = {}) {
    const headers = { Authorization: `Bearer ${obtenerToken()}` };
    if (opciones.body) headers['Content-Type'] = 'application/json';

    let respuesta;
    try {
        respuesta = await fetch(`${URL}${ruta}`, { ...opciones, headers });
    } catch {
        throw new Error('No se pudo conectar con el servidor.');
    }

    manejarSesionVencida(respuesta);
    const datos = respuesta.status === 204 ? null : await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos?.error || 'Ocurrió un error con los turnos.');
    }
    return datos;
}

export async function obtenerTurnos() {
    return pedir('/turnos');
}

export async function obtenerAutos() {
    return pedir('/vehiculos');
}

export async function obtenerClientes() {
    return pedir('/clientes');
}

export async function crearTurno(turno) {
    return pedir('/turnos', { method: 'POST', body: JSON.stringify(turno) });
}

export async function eliminarTurno(idTurno) {
    return pedir(`/turnos/${idTurno}`, { method: 'DELETE' });
}

export async function modificarTurno(idTurno, datos) {
    return pedir(`/turnos/${idTurno}`, { method: 'PATCH', body: JSON.stringify(datos) });
}
