import { useState } from 'react'

function crearValoresIniciales(repuesto) {
  return {
    codigo: repuesto?.codigo ?? '',
    nombre: repuesto?.nombre ?? '',
    precioCosto: repuesto?.precioCosto ?? '',
    precioVenta: repuesto?.precioVenta ?? '',
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
        precioVenta: Number(formulario.precioVenta),
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
    <form onSubmit={manejarEnvio}>
      {error && <p className="alert alert-danger" role="alert">{error}</p>}

      <div className="grilla">
        <div className="formulario">
          <label htmlFor="repuesto-codigo">Código</label>
          <input id="repuesto-codigo" name="codigo" type="text" value={formulario.codigo} onChange={actualizarCampo} required />
        </div>
        <div className="formulario">
          <label htmlFor="repuesto-nombre">Nombre</label>
          <input id="repuesto-nombre" name="nombre" type="text" value={formulario.nombre} onChange={actualizarCampo} required />
        </div>
        <div className="formulario">
          <label htmlFor="repuesto-precio-costo">Precio de costo</label>
          <input id="repuesto-precio-costo" name="precioCosto" type="number" min="0" step="0.01" value={formulario.precioCosto} onChange={actualizarCampo} required />
        </div>
        <div className="formulario">
          <label htmlFor="repuesto-precio-venta">Precio de venta</label>
          <input id="repuesto-precio-venta" name="precioVenta" type="number" min="0" step="0.01" value={formulario.precioVenta} onChange={actualizarCampo} required />
        </div>
        <div className="formulario">
          <label htmlFor="repuesto-stock">Stock</label>
          <input id="repuesto-stock" name="stock" type="number" min="0" step="1" value={formulario.stock} onChange={actualizarCampo} required />
        </div>
        <div className="formulario">
          <label htmlFor="repuesto-stock-minimo">Stock mínimo</label>
          <input id="repuesto-stock-minimo" name="stockMinimo" type="number" min="0" step="1" value={formulario.stockMinimo} onChange={actualizarCampo} required />
        </div>
      </div>

      <div className="formulario">
        <label htmlFor="repuesto-descripcion">Descripción</label>
        <textarea id="repuesto-descripcion" name="descripcion" rows="3" value={formulario.descripcion} onChange={actualizarCampo} />
      </div>

      <div className="acciones-formulario">
        <button type="submit" className="btnGuardar" disabled={guardando}>
          {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear repuesto'}
        </button>
        <button type="button" className="btnCancelar" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default RepuestoForm
