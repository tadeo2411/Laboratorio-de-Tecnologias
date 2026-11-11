// Simula la API de repuestos mientras no exista el backend.
// Los registros iniciales se leen del JSON que sirve Vite y los cambios quedan
// en memoria: se pierden al recargar la página.
// Cada función corresponde a una operación de la futura API
// (GET, POST, PUT y DELETE sobre /api/repuestos). Cuando exista el backend,
// solo se reemplaza el interior de estas funciones; las páginas no cambian.
const URL = 'http://localhost:3000/api'
const CLAVE_TOKEN = 'gestorTaller303:token'

let repuestos = null

export async function obtenerRepuestos() {
  const respuesta = await fetch(URL + '/repuestos', {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem(CLAVE_TOKEN)}`
    }
  });

  if (!respuesta.ok) {
    throw new Error('No se pudieron cargar los repuestos');
  }

  return await respuesta.json();
}

export async function crearRepuesto(repuesto) {
  const respuesta = await fetch(URL + '/repuestos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem(CLAVE_TOKEN)}`
    },
    body: JSON.stringify(repuesto)
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.message || datos.mensaje || 'No se pudo crear el repuesto'
    );
  }

  return datos;
}

export async function modificarRepuesto(idRepuesto, datos) {
  const respuesta = await fetch(`${URL}/repuestos/${idRepuesto}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("gestorTaller303:token")}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(datos)
  });

  if (!respuesta.ok) {
    const error = await respuesta.json();
    throw new Error(error.message || "No se pudo modificar el repuesto");
  }

  return await respuesta.json();
}

export async function eliminarRepuesto(idRepuesto) {
  const respuesta = await fetch(`${URL}/repuestos/${idRepuesto}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("gestorTaller303:token")}`
    }
  });

  if (!respuesta.ok) {
    const error = await respuesta.json();
    throw new Error(error.message || "Error al eliminar el repuesto");
  }

  return await respuesta.json();
}