import { useState } from 'react'

const ANIO_MAXIMO = new Date().getFullYear() + 1

function crearValoresIniciales(vehiculo) {
  return {
    clienteIds: vehiculo?.clienteIds ?? [],
    patente: vehiculo?.patente ?? '',
    marca: vehiculo?.marca ?? '',
    modelo: vehiculo?.modelo ?? '',
    anio: vehiculo?.anio ?? '',
    kilometraje: vehiculo?.kilometraje ?? '',
    descripcion: vehiculo?.descripcion ?? '',
  }
}

// Si recibe un vehículo, el formulario lo edita; si recibe null, registra uno nuevo.
function VehiculoForm({ vehiculo, clientes, onCancelar, onGuardar }) {
  const [formulario, setFormulario] = useState(() => crearValoresIniciales(vehiculo))
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)
  const esEdicion = Boolean(vehiculo)

  function actualizarCampo(event) {
    const { name, value } = event.target
    setFormulario((valoresActuales) => ({ ...valoresActuales, [name]: value }))
  }

  // Un vehículo puede tener varios dueños (1..* en el diagrama): el select es múltiple
  // y guarda la lista de ids de los clientes elegidos.
  function actualizarDuenos(event) {
    const clienteIds = Array.from(event.target.selectedOptions, (opcion) => opcion.value)
    setFormulario((valoresActuales) => ({ ...valoresActuales, clienteIds }))
  }

  async function manejarEnvio(event) {
    event.preventDefault()
    setError('')
    setGuardando(true)

    try {
      // Los inputs siempre entregan texto: los campos numéricos se convierten antes de guardar.
      await onGuardar({
        ...formulario,
        anio: Number(formulario.anio),
        kilometraje: Number(formulario.kilometraje),
      })
    } catch (errorGuardado) {
      setError(errorGuardado.message)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form onSubmit={manejarEnvio}>
      {error && <p className="alert alert-danger" role="alert">{error}</p>}

      <div className="formulario">
        <label htmlFor="vehiculo-duenos">Dueños (Ctrl + clic para elegir más de uno)</label>
        <select
          id="vehiculo-duenos"
          name="clienteIds"
          multiple
          size={Math.min(clientes.length, 4) || 1}
          value={formulario.clienteIds}
          onChange={actualizarDuenos}
          required
        >
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre} · {cliente.documento}
            </option>
          ))}
        </select>
      </div>

      <div className="grilla">
        <div className="formulario">
          <label htmlFor="vehiculo-patente">Patente</label>
          <input
            id="vehiculo-patente"
            name="patente"
            type="text"
            placeholder="AA000AA"
            value={formulario.patente}
            onChange={actualizarCampo}
            required
          />
        </div>

        <div className="formulario">
          <label htmlFor="vehiculo-marca">Marca</label>
          <input id="vehiculo-marca" name="marca" type="text" value={formulario.marca} onChange={actualizarCampo} required />
        </div>

        <div className="formulario">
          <label htmlFor="vehiculo-modelo">Modelo</label>
          <input id="vehiculo-modelo" name="modelo" type="text" value={formulario.modelo} onChange={actualizarCampo} required />
        </div>

        <div className="formulario">
          <label htmlFor="vehiculo-anio">Año</label>
          <input
            id="vehiculo-anio"
            name="anio"
            type="number"
            min="1900"
            max={ANIO_MAXIMO}
            value={formulario.anio}
            onChange={actualizarCampo}
            required
          />
        </div>

        <div className="formulario">
          <label htmlFor="vehiculo-kilometraje">Kilometraje</label>
          <input
            id="vehiculo-kilometraje"
            name="kilometraje"
            type="number"
            min="0"
            step="1"
            value={formulario.kilometraje}
            onChange={actualizarCampo}
            required
          />
        </div>
      </div>

      <div className="formulario">
        <label htmlFor="vehiculo-descripcion">Descripción</label>
        <textarea
          id="vehiculo-descripcion"
          name="descripcion"
          rows="3"
          value={formulario.descripcion}
          onChange={actualizarCampo}
        />
      </div>

      <div className="acciones-formulario">
        <button type="submit" className="btnGuardar" disabled={guardando}>
          {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear vehículo'}
        </button>
        <button type="button" className="btnCancelar" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default VehiculoForm
