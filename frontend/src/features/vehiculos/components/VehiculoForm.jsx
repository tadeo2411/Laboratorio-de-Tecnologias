import { useState } from 'react'
import Modal from '../../../shared/components/Modal'
import { BuscadorClientes, ClientesForm, crearCliente } from '../../clientes'
import { normalizarPatente } from '../services/vehiculosService'

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
  const [buscandoOtroDueno, setBuscandoOtroDueno] = useState(false)

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

  function asociarOtroDueno(cliente) {
    if (formulario.clienteIds.includes(cliente.id)) {
      setError('Este cliente ya está asociado como dueño.')
      return
    }
    setError('')
    setFormulario((prev) => ({
      ...prev,
      clienteIds: [...prev.clienteIds, cliente.id],
    }))
    setBuscandoOtroDueno(false)
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
      <p className="campos-obligatorios mb-3">
        Los campos con <span className="text-danger" aria-hidden="true">*</span> son obligatorios.
      </p>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={manejarEnvio} noValidate>
        {esEdicion ? (
          // Modificación
          <div className="mb-3">
            <span className="form-label fw-bold d-block mb-2">
              Dueños / Conductores asignados <span className="text-danger" aria-hidden="true">*</span>
            </span>
            <ul className="list-group mb-2">
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
                      className="btn btn-outline-danger btn-sm px-2"
                      aria-label={`Desasociar a ${dueno.nombre}`}
                      title={`Desasociar a ${dueno.nombre}`}
                      onClick={() => quitarDuenos(dueno.id)}
                    >
                      -
                    </button>
                  )}
                </li>
              ))}
            </ul>
            {buscandoOtroDueno ? (
              <div className="border p-2 rounded bg-light mt-2">
                <span className="form-label small fw-bold d-block mb-1">Seleccionar cliente a asociar:</span>
                <BuscadorClientes
                  clientes={clientes.filter((c) => !formulario.clienteIds.includes(c.id))}
                  onSeleccionar={asociarOtroDueno}
                  onRegistrarNuevo={() => setMostrarModalCliente(true)}
                />
                <button
                  type="button"
                  className="btn btn-link btn-sm text-secondary mt-1 p-0"
                  onClick={() => setBuscandoOtroDueno(false)}
                >
                  Cancelar búsqueda
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() => setBuscandoOtroDueno(true)}
              >
                + Asociar otro dueño
              </button>
            )}
          </div>
        ) : (
          // Alta
          <div className="mb-3">
            <span className="form-label fw-bold d-block mb-2">
              Dueño / Conductor <span className="text-danger" aria-hidden="true">*</span>
            </span>
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

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label htmlFor="vehiculo-patente" className="form-label fw-semibold">
              Patente <span className="text-danger" aria-hidden="true">*</span>
            </label>
            <input
              id="vehiculo-patente"
              name="patente"
              type="text"
              className="form-control text-uppercase"
              placeholder="ABC123 o AB123CD"
              value={formulario.patente}
              onChange={(e) => {
                const valor = normalizarPatente(e.target.value)
                setFormulario((prev) => ({ ...prev, patente: valor }))
              }}
              maxLength={7}
              autoCapitalize="characters"
              autoComplete="off"
              spellCheck={false}
              required
            />
          </div>

          <div className="col-12 col-md-6">
            <label htmlFor="vehiculo-marca" className="form-label fw-semibold">
              Marca <span className="text-danger" aria-hidden="true">*</span>
            </label>
            <input
              id="vehiculo-marca"
              name="marca"
              type="text"
              className="form-control"
              placeholder="Ej: Ford, Toyota..."
              value={formulario.marca}
              onChange={actualizarCampo}
              required
            />
          </div>

          <div className="col-12 col-md-6">
            <label htmlFor="vehiculo-modelo" className="form-label fw-semibold">
              Modelo <span className="text-danger" aria-hidden="true">*</span>
            </label>
            <input
              id="vehiculo-modelo"
              name="modelo"
              type="text"
              className="form-control"
              placeholder="Ej: Focus, Corolla..."
              value={formulario.modelo}
              onChange={actualizarCampo}
              required
            />
          </div>

          <div className="col-12 col-md-3">
            <label htmlFor="vehiculo-anio" className="form-label fw-semibold">
              Año <span className="text-danger" aria-hidden="true">*</span>
            </label>
            <input
              id="vehiculo-anio"
              name="anio"
              type="number"
              inputMode="numeric"
              className="form-control"
              min="1900"
              max={ANIO_MAXIMO}
              value={formulario.anio}
              onChange={actualizarCampo}
              required
            />
          </div>

          <div className="col-12 col-md-3">
            <label htmlFor="vehiculo-kilometraje" className="form-label fw-semibold">
              Kilometraje <span className="text-danger" aria-hidden="true">*</span>
            </label>
            <input
              id="vehiculo-kilometraje"
              name="kilometraje"
              type="number"
              inputMode="numeric"
              className="form-control"
              min="0"
              step="1"
              value={formulario.kilometraje}
              onChange={actualizarCampo}
              required
            />
          </div>

          <div className="col-12">
            <label htmlFor="vehiculo-descripcion" className="form-label fw-semibold">
              Descripción / Observaciones
            </label>
            <textarea
              id="vehiculo-descripcion"
              name="descripcion"
              rows="3"
              className="form-control"
              placeholder="Detalles particulares del estado del vehículo..."
              value={formulario.descripcion}
              onChange={actualizarCampo}
            />
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <button
            type="button"
            className="btn btn-secondary px-4"
            onClick={onCancelar}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn btn-success px-4"
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
