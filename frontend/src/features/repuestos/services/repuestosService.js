// Simula la API de repuestos mientras no exista el backend.
// Los registros iniciales se leen del JSON que sirve Vite y los cambios quedan
// en memoria: se pierden al recargar la página.
// Cada función corresponde a una operación de la futura API
// (GET, POST, PUT y DELETE sobre /api/repuestos). Cuando exista el backend,
// solo se reemplaza el interior de estas funciones; las páginas no cambian.
const URL = '/backend/data'

let repuestos = null

async function cargarRepuestos() {
  if (repuestos === null) {
    const respuesta = await fetch(`${URL}/repuestos.json`)

    if (!respuesta.ok) {
      throw new Error('No se pudieron cargar los repuestos.')
    }
    repuestos = await respuesta.json()
  }
  return repuestos
}

function buscarRepuesto(lista, id) {
  const repuesto = lista.find((repuestoActual) => repuestoActual.id === id)

  if (!repuesto) {
    throw new Error('El repuesto no existe o ya fue eliminado.')
  }
  return repuesto
}

// El código identifica al repuesto en el catálogo: se guarda sin espacios
// en los extremos y en mayúsculas para que "fil-001" y "FIL-001" sean el mismo.
function normalizarCodigo(codigo) {
  return codigo.trim().toUpperCase()
}

function validarCodigoUnico(lista, codigo, idExcluido = null) {
  const repetido = lista.some(
    (repuesto) => repuesto.codigo === codigo && repuesto.id !== idExcluido,
  )

  if (repetido) {
    throw new Error(`Ya existe un repuesto con el código ${codigo}.`)
  }
}

export async function obtenerRepuestos() {
  return cargarRepuestos()
}

export async function crearRepuesto(datos) {
  const lista = await cargarRepuestos()
  const codigo = normalizarCodigo(datos.codigo)
  validarCodigoUnico(lista, codigo)

  const nuevoRepuesto = { ...datos, id: crypto.randomUUID(), codigo }

  repuestos = [...lista, nuevoRepuesto]
  return nuevoRepuesto
}

export async function actualizarRepuesto(id, datos) {
  const lista = await cargarRepuestos()
  const repuestoActual = buscarRepuesto(lista, id)
  const codigo = normalizarCodigo(datos.codigo)
  validarCodigoUnico(lista, codigo, id)

  const repuestoActualizado = { ...repuestoActual, ...datos, codigo }

  repuestos = lista.map((repuesto) => (repuesto.id === id ? repuestoActualizado : repuesto))
  return repuestoActualizado
}

export async function eliminarRepuesto(id) {
  const lista = await cargarRepuestos()
  buscarRepuesto(lista, id)

  repuestos = lista.filter((repuesto) => repuesto.id !== id)
}
