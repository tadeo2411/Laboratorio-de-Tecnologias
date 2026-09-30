import { useState } from 'react'

function formatoMoneda(valor) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(valor))
}

function RepuestosList({ repuestos }) {
  const [busqueda, setBusqueda] = useState('')
  const termino = busqueda.trim().toLowerCase()
  const repuestosFiltrados = repuestos.filter((repuesto) =>
    [repuesto.codigo, repuesto.nombre].some((valor) => valor.toLowerCase().includes(termino)),
  )

  return (
    <section className="contenedor">
      <h2 className="titContenedor">Repuestos</h2>
      <label className="sr-only" htmlFor="buscar-repuesto">Buscar repuestos</label>
      <input
        id="buscar-repuesto"
        className="input-busqueda"
        type="search"
        placeholder="Buscar por código o nombre..."
        value={busqueda}
        onChange={(event) => setBusqueda(event.target.value)}
      />

      <div className="formatoTabla">
        <table className="datosTabla">
          <thead>
            <tr><th>Código</th><th>Nombre</th><th>Precio de costo</th><th>Precio de venta</th><th>Stock</th><th>Stock mínimo</th><th>Descripción</th></tr>
          </thead>
          <tbody>
            {repuestosFiltrados.length === 0 ? (
              <tr><td colSpan="7" className="sinDatos">{repuestos.length === 0 ? 'Todavía no hay repuestos cargados.' : 'No hay repuestos que coincidan con la búsqueda.'}</td></tr>
            ) : (
              repuestosFiltrados.map((repuesto) => (
                <tr key={repuesto.id}>
                  <td>{repuesto.codigo}</td><td>{repuesto.nombre}</td><td>{formatoMoneda(repuesto.precioCosto)}</td><td>{formatoMoneda(repuesto.precioVenta)}</td><td>{repuesto.stock}</td><td>{repuesto.stockMinimo}</td><td>{repuesto.descripcion || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default RepuestosList
