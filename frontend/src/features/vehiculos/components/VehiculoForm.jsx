import { useState } from 'react'
import Modal from '../../../shared/components/Modal'
import { BuscadorClientes, ClientesForm, crearCliente } from '../../clientes'

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
function VehiculoForm({ vehiculo, clientes, onCancelar, onGuardar, onClienteCreado }) {
  const [formulario, setFormulario] = useState(() => crearValoresIniciales(vehiculo))
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [mostrarModalCliente, setMostrarModalCliente] = useState(false)
  const [errorCliente, setErrorCliente] = useState('')

  const esEdicion = Boolean(vehiculo)
  const duenosAsociados = clientes.filter((c) => formulario.clienteIds.includes(c.id))

  function actualizarCampo(event) {
    const { name, value } = event.target
    setFormulario((valoresActuales) => ({ ...valoresActuales, [name]: value }))
  }

  function seleccionarDueno(cliente) {
    setError('')
    setFormulario((prev) => ({
      ...prev,
      clienteIds: [cliente.id],
    }))
  }

  function quitarDuenos(idCliente) {
    if (esEdicion && formulario.clienteIds.length === 1) {
      setError('No se puede desvincular porque un vehículo debe tener mínimo un dueño.')
      return
    }
    setError('')
    setFormulario((prev) => ({
      ...prev,
      clienteIds: prev.clienteIds.filter((id) => id !== idCliente),
    }))
  }

  async function handleGuardarCliente(datosNuevoCliente) {
    try {
      setErrorCliente('')
      const clienteCreado = await crearCliente(datosNuevoCliente)

      if (onClienteCreado) {
        onClienteCreado(clienteCreado)
      }

      seleccionarDueno(clienteCreado)
      setMostrarModalCliente(false)
    } catch (err) {
      setErrorCliente(err.message)
    }
  }

  async function manejarEnvio(event) {
    event.preventDefault()
    setError('')

    if (formulario.clienteIds.length === 0) {
      setError('El vehículo debe tener al menos un dueño asignado.')
      return
    }

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
        {esEdicion ? (
          // Modificación
          <div className="mb-3">
            <label className="fw-bold mb-2">Dueños / Conductores</label>
            <ul className="list-group">
              {duenosAsociados.map((dueno) => (
                <li
                  key={dueno.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{dueno.nombre}</strong> · <span className="text-muted">Doc: {dueno.documento}</span>
                  </div>
                  {duenosAsociados.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      title="Desasociar dueño"
                      onClick={() => quitarDuenos(dueno.id)}
                    >
                      Desasociar
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          // Alta
          <div className="mb-3">
            <label htmlFor="vehiculo-duenos" className="form-label">
              Dueño / Conductor <span className="asterisco">*</span>
            </label>
            {duenosAsociados.length > 0 ? (
              <div className="d-flex justify-content-between align-items-center p-2 bg-light border rounded">
                <span>
                  <strong>{duenosAsociados[0].nombre}</strong> ·{' '}
                  <span className="text-muted">Doc: {duenosAsociados[0].documento}</span>
                </span>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => quitarDuenos(duenosAsociados[0].id)}
                >
                  Cambiar
                </button>
              </div>
            ) : (
              <BuscadorClientes
                clientes={clientes}
                onSeleccionar={seleccionarDueno}
                onRegistrarNuevo={() => setMostrarModalCliente(true)}
              />
            )}
          </div>
        )}

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
            <label htmlFor="vehiculo-descripcion">Descripción</label>
            <div>
              <textarea
                id="vehiculo-descripcion"
                name="descripcion"
                rows="3"
                placeholder="Describí el vehículo..."
                value={formulario.descripcion}
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

      {mostrarModalCliente && (
        <Modal
          titulo="Registrar nuevo cliente"
          onCerrar={() => setMostrarModalCliente(false)}
          cerrarAlTocarFondo={true}
        >
          <ClientesForm
            onGuardar={handleGuardarCliente}
            onCancelar={() => setMostrarModalCliente(false)}
            error={errorCliente}
          />
        </Modal>
      )}
    </div>
  )
}

export default VehiculoForm
