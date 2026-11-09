const URL = 'http://localhost:3000/api'

let tiposTrabajo = null

async function obtenerTrabajos() {
    const respuesta = await fetch(`${URL}/trabajos`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem("gestorTaller303:token")}`,
            'Content-Type': 'application/json'
        }
    });
    if (!respuesta.ok) {
        throw new Error("No se pudo cargar el catálogo de trabajos")
    }
    const trabajos = await respuesta.json()
    console.log(trabajos);
    return trabajos
}

export async function obtenerTiposTrabajo() {
    if (tiposTrabajo === null) {
        const respuesta = await fetch(`${URL}/trabajos/tipoTrabajos`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem("gestorTaller303:token")}`,
                'Content-Type': 'application/json'
            }
        });

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar el catálogo de trabajos")
        }
        tiposTrabajo = await respuesta.json()

    }
    return tiposTrabajo
}

async function obtenerEmpleados() {
    const respuesta = await fetch(`${URL}/auth/empleados`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem("gestorTaller303:token")}`,
            'Content-Type': 'application/json'
        }
    });

    if (!respuesta.ok) {
        throw new Error("No se pudo cargar el catálogo de empleados");
    }

    const empleados = await respuesta.json();
    return empleados;
}

async function obtenerOrdenes() {
    const respuesta = await fetch(`${URL}/ordenes`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem("gestorTaller303:token")}`,
            'Content-Type': 'application/json'
        }
    });

    if (!respuesta.ok) {
        throw new Error("No se pudo cargar el catálogo de órdenes");
    }

    const ordenes = await respuesta.json();
    return ordenes;
}

async function obtenerRepuestos() {
    const respuesta = await fetch(`${URL}/repuestos`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem("gestorTaller303:token")}`,
            'Content-Type': 'application/json'
        }
    });

    if (!respuesta.ok) {
        throw new Error("No se pudo cargar el catálogo de repuestos");
    }

    const repuestos = await respuesta.json();
    return repuestos;
}

async function cargarTrabajo(trabajo) {
    const respuesta = await fetch(`${URL}/trabajos`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem("gestorTaller303:token")}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(trabajo)
    });

    if (!respuesta.ok) {
        const error = await respuesta.json();
        throw new Error(error.message || "No se pudo cargar el trabajo");
    }

    const datos = await respuesta.json();

    return datos;
}

export async function eliminarTrabajo(idTrabajo) {
    const respuesta = await fetch(`${URL}/trabajos/${idTrabajo}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("gestorTaller303:token")}`
        }
    });

    if (!respuesta.ok) {
        const error = await respuesta.json();
        throw new Error(error.message || "Error al eliminar el trabajo");
    }

    return await respuesta.json();
}

async function obtenerTrabajoPorId(idTrabajo) {
    const respuesta = await fetch(`${URL}/trabajos/${idTrabajo}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("gestorTaller303:token")}`,
            "Content-Type": "application/json"
        }
    });

    if (!respuesta.ok) {
        throw new Error("No se pudo obtener el trabajo");
    }

    return await respuesta.json();
}

async function modificarTrabajo(idTrabajo, datos) {
    const respuesta = await fetch(`${URL}/trabajos/${idTrabajo}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("gestorTaller303:token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
        const error = await respuesta.json();
        throw new Error(error.message || "No se pudo modificar el trabajo");
    }

    return await respuesta.json();
}

export default { obtenerTrabajos, obtenerTiposTrabajo, obtenerEmpleados, obtenerOrdenes, obtenerRepuestos, cargarTrabajo, eliminarTrabajo, obtenerTrabajoPorId, modificarTrabajo };