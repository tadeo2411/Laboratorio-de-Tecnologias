//ESTADOS SOLICITADO, CONFIRMADO, CUMPLIDO, CANCELADO, AUSENTE
export const estadosTurno = ['SOLICITADO', 'CONFIRMADO', 'CUMPLIDO', 'CANCELADO', 'AUSENTE']
const URL = 'http://localhost:3000/api'
const CLAVE_TOKEN = 'gestorTaller303:token'

export async function obtenerTurnos() {
    const respuesta = await fetch(URL + '/turnos', {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem(CLAVE_TOKEN)}`
        }
    });

    if (!respuesta.ok) {
        throw new Error('No se pudieron cargar los turnos');
    }

    return await respuesta.json();
}

export async function obtenerAutos() {
    const respuesta = await fetch(URL + '/vehiculos', {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem(CLAVE_TOKEN)}`
        }
    });


    if (!respuesta.ok) {
        throw new Error('No se pudieron cargar los turnos');
    }

    return await respuesta.json();
}

export async function obtenerClientes() {
    const respuesta = await fetch(URL + '/clientes', {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem(CLAVE_TOKEN)}`
        }
    });


    if (!respuesta.ok) {
        throw new Error('No se pudieron cargar los turnos');
    }

    return await respuesta.json();
}

export async function crearTurno(turno) {
    const respuesta = await fetch(URL + '/turnos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem(CLAVE_TOKEN)}`
        },
        body: JSON.stringify(turno)
    });

    if (!respuesta.ok) {
        throw new Error('No se pudo crear el turno');
    }

    return await respuesta.json();
}