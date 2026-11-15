import { useState, useId } from 'react'
import { tipoCliente } from '../services/clientesServices'

const valoresIniciales = {
    nombre: '',
    telefono: '',
    documento: '',
    tipo: 'PERSONA',
}

function ClientesForm({ clienteInicial, onGuardar, error, onCancelar }) {
    const [formulario, setFormulario] = useState(
        clienteInicial ? { ...valoresIniciales, ...clienteInicial } : valoresIniciales
    )

  const idNombre = useId()
  const idTelefono = useId()
  const idDocumento = useId()
  const idTipo = useId()
  const idError = useId()

  function actualizarCampo(evento) {
    const { name, value } = evento.target
    setFormulario((anteriores) => ({ ...anteriores, [name]: value }))
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    if (enviando) return

    setEnviando(true)
    try {
      await onGuardar({
        nombre: formulario.nombre.trim(),
        telefono: formulario.telefono.trim(),
        documento: formulario.documento.trim(),
        tipo: formulario.tipo,
      })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div>
      <p className="text-muted small mb-3">Los campos con * son obligatorios.</p>

      {error && (
        <div id={idError} role="alert" className="alert alert-danger py-2 mb-3">
          {error}
        </div>
      )}

      <form onSubmit={manejarEnvio}>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label htmlFor={idNombre} className="form-label fw-semibold">
              Nombre y Apellido / Razón social *
            </label>
            <input
              id={idNombre}
              name="nombre"
              type="text"
              className="form-control"
              value={formulario.nombre}
              onChange={actualizarCampo}
              maxLength={120}
              autoComplete="name"
              pattern=".*\S.*"
              title="Escribí un nombre válido que no contenga solo espacios."
              aria-invalid={Boolean(error)}
              aria-describedby={error ? idError : undefined}
              required
              disabled={enviando}
            />
          </div>

          <div className="col-12 col-md-6">
            <label htmlFor={idTelefono} className="form-label fw-semibold">
              Teléfono *
            </label>
            <input
              id={idTelefono}
              name="telefono"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              className="form-control"
              value={formulario.telefono}
              onChange={actualizarCampo}
              maxLength={30}
              pattern="[0-9+ \-]{8,}"
              title="El teléfono debe tener al menos 8 dígitos (podés incluir guiones y espacios)."
              aria-invalid={Boolean(error)}
              aria-describedby={error ? idError : undefined}
              required
              disabled={enviando}
            />
          </div>

          <div className="col-12 col-md-6">
            <label htmlFor={idDocumento} className="form-label fw-semibold">
              DNI / CUIT *
            </label>
            <input
              id={idDocumento}
              name="documento"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              className="form-control"
              value={formulario.documento}
              onChange={actualizarCampo}
              maxLength={14}
              pattern="[0-9. \-]{7,14}"
              title="Ingresá entre 7 y 11 dígitos numéricos."
              aria-invalid={Boolean(error)}
              aria-describedby={error ? idError : undefined}
              required
              disabled={enviando}
            />
          </div>

          <div className="col-12 col-md-6">
            <label htmlFor={idTipo} className="form-label fw-semibold">
              Tipo *
            </label>
            <select
              id={idTipo}
              name="tipo"
              className="form-select"
              value={formulario.tipo}
              onChange={actualizarCampo}
              required
              disabled={enviando}
            >
              {tipoCliente.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-4 pt-2 border-top">
          {onCancelar && (
            <button
              type="button"
              className="btn btn-secondary px-3"
              onClick={onCancelar}
              disabled={enviando}
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="btn btn-success px-4 d-inline-flex align-items-center gap-2"
            disabled={enviando}
          >
            {enviando && (
              <span className="spinner-border spinner-border-sm" aria-hidden="true" />
            )}
            <span>{enviando ? 'Guardando…' : 'Guardar'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default ClientesForm
