import { useState } from 'react'

function crearValoresIniciales(repuesto) {
  return {
    codigo: repuesto?.codigo ?? '',
    nombre: repuesto?.nombre ?? '',
    precioCosto: repuesto?.precioCosto ?? '',
    precioEstandar: repuesto?.precioEstandar ?? '',
    stock: repuesto?.stock ?? '',
    stockMinimo: repuesto?.stockMinimo ?? '',
    descripcion: repuesto?.descripcion ?? '',
  }
}

// Si recibe un repuesto, el formulario lo edita; si recibe null, registra uno nuevo.
function RepuestoForm({ repuesto, onCancelar, onGuardar }) {
  const [formulario, setFormulario] = useState(() => crearValoresIniciales(repuesto))
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)
  const esEdicion = Boolean(repuesto)

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
        precioCosto: Number(formulario.precioCosto),
        precioEstandar: Number(formulario.precioEstandar),
        stock: Number(formulario.stock),
        stockMinimo: Number(formulario.stockMinimo),
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
                <label htmlFor="repuesto-codigo">
                    Código <span className="asterisco">*</span>
                </label>
                <input
                    id="repuesto-codigo"
                    name="codigo"
                    type="text"
                    value={formulario.codigo}
                    onChange={actualizarCampo}
                    required
                />
            </div>

            <div>
                <label htmlFor="repuesto-nombre">
                    Nombre <span className="asterisco">*</span>
                </label>
                <input
                    id="repuesto-nombre"
                    name="nombre"
                    type="text"
                    value={formulario.nombre}
                    onChange={actualizarCampo}
                    required
                />
            </div>
        </div>

        <div>
            <div>
                <label htmlFor="repuesto-precio-costo">
                    Precio de costo <span className="asterisco">*</span>
                </label>
                <input
                    id="repuesto-precio-costo"
                    name="precioCosto"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formulario.precioCosto}
                    onChange={actualizarCampo}
                    required
                />
            </div>

            <div>
                <label htmlFor="repuesto-precio-venta">
                    Precio de venta <span className="asterisco">*</span>
                </label>
                <input
                    id="repuesto-precio-venta"
                    name="precioEstandar"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formulario.precioEstandar}
                    onChange={actualizarCampo}
                    required
                />
            </div>
        </div>

        <div>
            <div>
                <label htmlFor="repuesto-stock">
                    Stock <span className="asterisco">*</span>
                </label>
                <input
                    id="repuesto-stock"
                    name="stock"
                    type="number"
                    min="0"
                    step="1"
                    value={formulario.stock}
                    onChange={actualizarCampo}
                    required
                />
            </div>

            <div>
                <label htmlFor="repuesto-stock-minimo">
                    Stock mínimo <span className="asterisco">*</span>
                </label>
                <input
                    id="repuesto-stock-minimo"
                    name="stockMinimo"
                    type="number"
                    min="0"
                    step="1"
                    value={formulario.stockMinimo}
                    onChange={actualizarCampo}
                    required
                />
            </div>
        </div>

        <div>
            <div>
                <label htmlFor="repuesto-descripcion">Descripción</label>
                <div>
                    <textarea
                        id="repuesto-descripcion"
                        name="descripcion"
                        rows="3"
                        placeholder="Describí el repuesto..."
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
                        : 'Crear repuesto'}
            </button>
        </div>
    </form>
</div>
  )
}

export default RepuestoForm
