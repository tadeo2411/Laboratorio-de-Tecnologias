import { useState } from 'react'

function textoEstadoAviso(estado) {
  if (estado === 'pendiente') return 'Pendiente'
  if (estado === 'enviado') return 'Enviado'
  if (estado === 'descartado') return 'Descartado'
  return 'Sin aviso'
}

function VehiculosList({ vehiculos, onEditar, onEliminar, onEnviarAviso, onVerHistorial }) {
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
              <th>Patente</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Año</th>
              <th>Kilometraje</th>
              <th>Dueño</th>
              <th>Próximo service</th>
              <th>Aviso</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vehiculosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="9" className="sinDatos">
                  {vehiculos.length === 0
                    ? 'Todavía no hay vehículos cargados.'
                    : 'No hay vehículos que coincidan con la búsqueda.'}
                </td>
              </tr>
            ) : (
              vehiculosFiltrados.map((vehiculo) => (
                <tr key={vehiculo.id}>
                  <td data-label="Patente"><strong>{vehiculo.patente}</strong></td>
                  <td data-label="Marca">{vehiculo.marca}</td>
                  <td data-label="Modelo">{vehiculo.modelo}</td>
                  <td data-label="Año">{vehiculo.anio || '—'}</td>
                  <td data-label="Kilometraje">{vehiculo.kilometraje || '—'}</td>
                  <td data-label="Dueño">{vehiculo.dueno || '—'}</td>
                  <td data-label="Próximo service">{vehiculo.proximoService || '—'}</td>
                  <td data-label="Aviso">
                    <span className={`estado-aviso estado-aviso--${vehiculo.estadoAvisoService || 'sin-aviso'}`}>
                      {textoEstadoAviso(vehiculo.estadoAvisoService)}
                    </span>
                  </td>
                  <td data-label="Acciones" className="celda-acciones">
  <div className="acciones-tabla">
    <button
      type="button"
      className="btnAccion"
      onClick={() => onVerHistorial(vehiculo)}
    >
      Historial
    </button>

    <button
      type="button"
      className="btnAccion"
      onClick={() => onEditar(vehiculo)}
    >
      Editar
    </button>

    {vehiculo.estadoAvisoService === 'pendiente' && (
      <button
        type="button"
        className="btnAccion"
        onClick={() => onEnviarAviso(vehiculo)}
      >
        Gestionar aviso
      </button>
    )}

    <button
      type="button"
      className="btnAccion btnAccion--peligro"
      onClick={() => onEliminar(vehiculo)}
    >
      Eliminar
    </button>
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

export default VehiculosList