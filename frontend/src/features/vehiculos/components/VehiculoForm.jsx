import { useState } from 'react'

const ANIO_MAXIMO = new Date().getFullYear() + 1

function crearValoresIniciales(vehiculo) {
  return {
    dueno: vehiculo?.dueno ?? '',
    patente: vehiculo?.patente ?? '',
    marca: vehiculo?.marca ?? '',
    modelo: vehiculo?.modelo ?? '',
    anio: vehiculo?.anio ?? '',
    kilometraje: vehiculo?.kilometraje ?? '',
    observaciones: vehiculo?.observaciones ?? '',
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
    <div>
      <p className="campos-obligatorios">
        Los campos con <span className="asterisco">*</span> son obligatorios.
      </p>

      {error && <p className="alert alert-danger" role="alert">{error}</p>}

      <form className="form-ordenes" onSubmit={manejarEnvio}>
        <div>
          <div>
            <label htmlFor="vehiculo-dueno">
              Dueño <span className="asterisco">*</span>
            </label>
            <div className="campo-icono">
              <select
                id="vehiculo-dueno"
                name="dueno"
                className="select"
                value={formulario.dueno}
                onChange={actualizarCampo}
                required
              >
                <option value="">Elegir dueño</option>
                {clientes.map((cliente) => (
                  <option key={cliente.dni} value={cliente.nombre}>
                    {cliente.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <div>
            <label htmlFor="vehiculo-patente">
              Patente <span className="asterisco">*</span>
            </label>
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

          <div>
            <label htmlFor="vehiculo-marca">
              Marca <span className="asterisco">*</span>
            </label>
            <input
              id="vehiculo-marca"
              name="marca"
              type="text"
              value={formulario.marca}
              onChange={actualizarCampo}
              required
            />
          </div>
        </div>

        <div>
          <div>
            <label htmlFor="vehiculo-modelo">
              Modelo <span className="asterisco">*</span>
            </label>
            <input
              id="vehiculo-modelo"
              name="modelo"
              type="text"
              value={formulario.modelo}
              onChange={actualizarCampo}
              required
            />
          </div>

          <div>
            <label htmlFor="vehiculo-anio">
              Año <span className="asterisco">*</span>
            </label>
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
        </div>

        <div>
          <div>
            <label htmlFor="vehiculo-kilometraje">
              Kilometraje <span className="asterisco">*</span>
            </label>
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

        <div>
          <div>
            <label htmlFor="vehiculo-observaciones">Observaciones</label>
            <div>
              <textarea
                id="vehiculo-observaciones"
                name="observaciones"
                rows="3"
                placeholder="Escribí las observaciones del vehículo..."
                value={formulario.observaciones}
                onChange={actualizarCampo}
              />
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancelar}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn btn-success"
            disabled={guardando}
          >
            {guardando
              ? 'Guardando...'
              : esEdicion
                ? 'Guardar cambios'
                : 'Crear vehículo'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default VehiculoForm
