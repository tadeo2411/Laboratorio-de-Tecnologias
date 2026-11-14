import { obtenerToken, manejarSesionVencida } from '../../auth';
import { API_URL } from '../../../shared/config/api';

const URL = API_URL

let tiposTrabajo = null

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
        throw new Error(datos?.error || 'Ocurrió un error con los trabajos.');
    }
    return datos;
}

async function obtenerTrabajos() {
    return pedir('/trabajos');
}

export async function obtenerTiposTrabajo() {
    if (tiposTrabajo === null) {
        tiposTrabajo = await pedir('/trabajos/tipoTrabajos');
    }
    return tiposTrabajo
}

async function obtenerEmpleados() {
    return pedir('/auth/empleados');
}

async function obtenerOrdenes() {
    return pedir('/ordenes');
}

async function obtenerRepuestos() {
    return pedir('/repuestos');
}

async function cargarTrabajo(trabajo) {
    return pedir('/trabajos', { method: 'POST', body: JSON.stringify(trabajo) });
}

export async function eliminarTrabajo(idTrabajo) {
    return pedir(`/trabajos/${idTrabajo}`, { method: 'DELETE' });
}

async function obtenerTrabajoPorId(idTrabajo) {
    return pedir(`/trabajos/${idTrabajo}`);
}

async function modificarTrabajo(idTrabajo, datos) {
    return pedir(`/trabajos/${idTrabajo}`, { method: 'PATCH', body: JSON.stringify(datos) });
}

export default { obtenerTrabajos, obtenerTiposTrabajo, obtenerEmpleados, obtenerOrdenes, obtenerRepuestos, cargarTrabajo, eliminarTrabajo, obtenerTrabajoPorId, modificarTrabajo };
