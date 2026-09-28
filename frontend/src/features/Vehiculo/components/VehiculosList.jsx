import { useState } from 'react'

function VehiculosList({ vehiculos }) {
  const [busqueda, setBusqueda] = useState('')
  const termino = busqueda.trim().toLowerCase()
  const vehiculosFiltrados = vehiculos.filter((vehiculo) =>
    [vehiculo.patente, vehiculo.marca, vehiculo.modelo].some((valor) =>
      valor.toLowerCase().includes(termino),
    ),
  )

  return (
    <section className="contenedor">
      <h2 className="titContenedor">Vehículos</h2>
      <label className="sr-only" htmlFor="buscar-vehiculo">Buscar vehículos</label>
      <input
        id="buscar-vehiculo"
        className="input-busqueda"
        type="search"
        placeholder="Buscar por patente, marca o modelo..."
        value={busqueda}
        onChange={(event) => setBusqueda(event.target.value)}
      />

      <div className="formatoTabla">
        <table className="datosTabla">
          <thead>
            <tr>
              <th>Patente</th><th>Marca</th><th>Modelo</th><th>Año</th><th>Kilometraje</th><th>Dueño</th><th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {vehiculosFiltrados.length === 0 ? (
              <tr><td colSpan="7" className="sinDatos">{vehiculos.length === 0 ? 'Todavía no hay vehículos cargados.' : 'No hay vehículos que coincidan con la búsqueda.'}</td></tr>
            ) : (
              vehiculosFiltrados.map((vehiculo) => (
                <tr key={vehiculo.id}>
                  <td>{vehiculo.patente}</td><td>{vehiculo.marca}</td><td>{vehiculo.modelo}</td><td>{vehiculo.anio || '—'}</td><td>{vehiculo.kilometraje || '—'}</td><td>{vehiculo.dueno || '—'}</td><td>{vehiculo.observaciones || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default VehiculosList
