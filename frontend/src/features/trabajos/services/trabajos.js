import { obtenerToken, manejarSesionVencida } from '../../auth';
import { API_URL } from '../../../shared/config/api';

const URL = `${API_URL}/trabajos`;

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

export async function obtenerTiposTrabajo() {
    return pedir('');
}

export async function crearTipoTrabajo(tipo) {
    return pedir('', { method: 'POST', body: JSON.stringify(tipo) });
}

export async function modificarTipoTrabajo(idTipo, datos) {
    return pedir(`/${idTipo}`, { method: 'PATCH', body: JSON.stringify(datos) });
}

export async function eliminarTipoTrabajo(idTipo) {
    return pedir(`/${idTipo}`, { method: 'DELETE' });
}
