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

export async function eliminarTurno(idTurno) {
    const respuesta = await fetch(`${URL}/turnos/${idTurno}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("gestorTaller303:token")}`
        }
    });

    if (!respuesta.ok) {
        const error = await respuesta.json();
        throw new Error(error.message || "Error al eliminar el turno");
    }

    return await respuesta.json();
}

export async function modificarTurno(idTurno, datos) {
    const respuesta = await fetch(`${URL}/turnos/${idTurno}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("gestorTaller303:token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
        const error = await respuesta.json();
        throw new Error(error.message || "No se pudo modificar el turno");
    }

    return await respuesta.json();
}