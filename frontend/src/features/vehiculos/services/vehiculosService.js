// Simula la API de vehículos mientras no exista el backend.
// Los registros iniciales se leen del JSON que sirve Vite y los cambios quedan
// en memoria: se pierden al recargar la página.
// Cada función corresponde a una operación de la futura API
// (GET, POST, PUT y DELETE sobre /api/vehiculos). Cuando exista el backend,
// solo se reemplaza el interior de estas funciones; las páginas no cambian.
const URL = '/backend/data'

let vehiculos = null

async function leerJson(archivo, mensajeError) {
  const respuesta = await fetch(`${URL}/${archivo}`)

  if (!respuesta.ok) {
    throw new Error(mensajeError)
  }
  return respuesta.json()
}

async function cargarVehiculos() {
  if (vehiculos === null) {
    vehiculos = await leerJson('vehiculos.json', 'No se pudieron cargar los vehículos.')
  }
  return vehiculos
}

function buscarVehiculo(lista, id) {
  const vehiculo = lista.find((vehiculoActual) => vehiculoActual.id === id)

  if (!vehiculo) {
    throw new Error('El vehículo no existe o ya fue eliminado.')
  }
  return vehiculo
}

// La patente identifica al vehículo: se guarda sin espacios y en mayúsculas
// para que "ab 123 cd" y "AB123CD" se reconozcan como la misma.
function normalizarPatente(patente) {
  return patente.replace(/\s+/g, '').toUpperCase()
}

function validarPatenteUnica(lista, patente, idExcluido = null) {
  const repetida = lista.some(
    (vehiculo) => vehiculo.patente === patente && vehiculo.id !== idExcluido,
  )

  if (repetida) {
    throw new Error(`Ya existe un vehículo con la patente ${patente}.`)
  }
}

export async function obtenerVehiculos() {
  return cargarVehiculos()
}

export async function crearVehiculo(datos) {
  const lista = await cargarVehiculos()
  const patente = normalizarPatente(datos.patente)
  validarPatenteUnica(lista, patente)

  // El id, el aviso y el historial los asigna el sistema, no el formulario.
  const nuevoVehiculo = {
    ...datos,
    id: crypto.randomUUID(),
    patente,
    proximoService: null,
    estadoAvisoService: 'sin-aviso',
    historialServices: [],
  }

  vehiculos = [...lista, nuevoVehiculo]
  return nuevoVehiculo
}

export async function actualizarVehiculo(id, datos) {
  const lista = await cargarVehiculos()
  const vehiculoActual = buscarVehiculo(lista, id)
  const patente = normalizarPatente(datos.patente)
  validarPatenteUnica(lista, patente, id)

  const vehiculoActualizado = { ...vehiculoActual, ...datos, patente }

  vehiculos = lista.map((vehiculo) => (vehiculo.id === id ? vehiculoActualizado : vehiculo))
  return vehiculoActualizado
}

export async function eliminarVehiculo(id) {
  const lista = await cargarVehiculos()
  buscarVehiculo(lista, id)

  vehiculos = lista.filter((vehiculo) => vehiculo.id !== id)
}

// Registra qué hizo el empleado con el aviso de service: enviarlo o descartarlo.
export async function actualizarEstadoAviso(id, estado) {
  if (!['enviado', 'descartado'].includes(estado)) {
    throw new Error('Estado de aviso no válido.')
  }

  const lista = await cargarVehiculos()
  const vehiculoActualizado = { ...buscarVehiculo(lista, id), estadoAvisoService: estado }

  vehiculos = lista.map((vehiculo) => (vehiculo.id === id ? vehiculoActualizado : vehiculo))
  return vehiculoActualizado
}

// Temporal: el selector de dueño necesita los clientes. Cuando la feature de
// clientes tenga su API, este dato debería venir de ese endpoint.
export async function obtenerClientes() {
  return leerJson('clientes.json', 'No se pudieron cargar los clientes.')
}
