import { useState } from 'react'
import BotonEliminar from '../../../shared/components/BotonEliminar'
import BotonEditar from '../../../shared/components/BotonEditar'

function formatoMoneda(valor) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(valor))
}

function RepuestosList({ repuestos, onEditar, onEliminar }) {
  const [busqueda, setBusqueda] = useState('')
  const termino = busqueda.trim().toLowerCase()

  // La búsqueda se calcula desde los datos recibidos: no se guarda una segunda lista.
  const repuestosFiltrados = repuestos.filter((repuesto) =>
    [repuesto.codigo, repuesto.nombre].some((valor) => valor?.toLowerCase().includes(termino)),
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
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Precio de costo</th>
              <th>Precio de venta</th>
              <th>Stock</th>
              <th>Stock mínimo</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {repuestosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="8" className="sinDatos">
                  {repuestos.length === 0
                    ? 'Todavía no hay repuestos cargados.'
                    : 'No hay repuestos que coincidan con la búsqueda.'}
                </td>
              </tr>
            ) : (
              repuestosFiltrados.map((repuesto) => (
                <tr key={repuesto.id}>
                  <td data-label="Código"><strong>{repuesto.codigo}</strong></td>
                  <td data-label="Nombre">{repuesto.nombre}</td>
                  <td data-label="Precio de costo">{formatoMoneda(repuesto.precioCosto)}</td>
                  <td data-label="Precio de venta">{formatoMoneda(repuesto.precioEstandar)}</td>
                  <td data-label="Stock">{repuesto.stock}</td>
                  <td data-label="Stock mínimo">{repuesto.stockMinimo}</td>
                  <td data-label="Descripción">{repuesto.descripcion || '—'}</td>
                  <td data-label="Acciones" className="celda-acciones">
                    <div className="acciones-tabla">
                      <BotonEditar onClick={() => onEditar(repuesto)} />
                      <BotonEliminar onClick={() => onEliminar(repuesto)} />
                    </div>
                  </td>
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
