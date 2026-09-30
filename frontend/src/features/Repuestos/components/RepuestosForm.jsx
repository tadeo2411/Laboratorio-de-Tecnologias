import { useState } from 'react'

const valoresIniciales = {
  codigo: '',
  nombre: '',
  precioCosto: '',
  precioVenta: '',
  stock: '',
  stockMinimo: '',
  descripcion: '',
}

function RepuestosForm({ onGuardar }) {
  const [formulario, setFormulario] = useState(valoresIniciales)

  function actualizarCampo(event) {
    const { name, value } = event.target
    setFormulario((valoresActuales) => ({ ...valoresActuales, [name]: value }))
  }

  function manejarEnvio(event) {
    event.preventDefault()
    onGuardar(formulario)
    setFormulario(valoresIniciales)
  }

  return (
    <form onSubmit={manejarEnvio}>
      <div className="grilla">
        <div className="formulario">
          <label htmlFor="codigo">Código</label>
          <input id="codigo" name="codigo" type="text" value={formulario.codigo} onChange={actualizarCampo} required />
        </div>
        <div className="formulario">
          <label htmlFor="nombre">Nombre</label>
          <input id="nombre" name="nombre" type="text" value={formulario.nombre} onChange={actualizarCampo} required />
        </div>
        <div className="formulario">
          <label htmlFor="precio-costo">Precio de costo</label>
          <input id="precio-costo" name="precioCosto" type="number" min="0" step="0.01" value={formulario.precioCosto} onChange={actualizarCampo} required />
        </div>
        <div className="formulario">
          <label htmlFor="precio-venta">Precio de venta</label>
          <input id="precio-venta" name="precioVenta" type="number" min="0" step="0.01" value={formulario.precioVenta} onChange={actualizarCampo} required />
        </div>
        <div className="formulario">
          <label htmlFor="stock">Stock</label>
          <input id="stock" name="stock" type="number" min="0" step="1" value={formulario.stock} onChange={actualizarCampo} required />
        </div>
        <div className="formulario">
          <label htmlFor="stock-minimo">Stock mínimo</label>
          <input id="stock-minimo" name="stockMinimo" type="number" min="0" step="1" value={formulario.stockMinimo} onChange={actualizarCampo} required />
        </div>
      </div>

      <div className="formulario anchoComp">
        <label htmlFor="descripcion">Descripción</label>
        <textarea id="descripcion" name="descripcion" rows="3" value={formulario.descripcion} onChange={actualizarCampo} />
      </div>

      <button type="submit" className="btnGuardar">Guardar</button>
    </form>
  )
}

export default RepuestosForm
