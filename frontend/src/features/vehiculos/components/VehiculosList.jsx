import { useState } from 'react'
import BotonEliminar from '../../../shared/components/BotonEliminar'
import BotonEditar from '../../../shared/components/BotonEditar'
import botonHistorial from '../../../assets/icons/botonHistorial.png'

function textoEstadoAviso(estado) {
  if (estado === 'pendiente') return 'Pendiente'
  if (estado === 'enviado') return 'Enviado'
  if (estado === 'descartado') return 'Descartado'
  return 'Sin aviso'
}

function VehiculosList({ vehiculos, onEditar, onEliminar, onGestionarAviso, onVerHistorial }) {
  const [busqueda, setBusqueda] = useState('')
  const termino = busqueda.trim().toLowerCase()

  // La búsqueda se calcula desde los datos recibidos: no se guarda una segunda lista.
  const vehiculosFiltrados = vehiculos.filter((vehiculo) =>
    [vehiculo.patente, vehiculo.marca, vehiculo.modelo, vehiculo.dueno].some((valor) =>
      valor?.toLowerCase().includes(termino),
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
        placeholder="Buscar por patente, marca, modelo o dueño..."
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
                  <td data-label="Kilometraje">
                    {vehiculo.kilometraje ? `${vehiculo.kilometraje.toLocaleString('es-AR')} km` : '—'}
                  </td>
                  <td data-label="Dueño">{vehiculo.dueno || '—'}</td>
                  <td data-label="Próximo service">{vehiculo.proximoService || '—'}</td>
                  <td data-label="Aviso">
                    <span className={`estado-aviso estado-aviso--${vehiculo.estadoAvisoService || 'sin-aviso'}`}>
                      {textoEstadoAviso(vehiculo.estadoAvisoService)}
                    </span>
                  </td>
                  <td data-label="Acciones" className="celda-acciones">
                    <div className="acciones-tabla">
                      <button type="button" className="botonHistorial" onClick={() => onVerHistorial(vehiculo)}>
                        <img src={botonHistorial} alt={`historial del vehículo de patente ${vehiculo.patente}`}  />
                      </button> 
                      <BotonEditar onClick={() => onEditar(vehiculo)} /> 
                      
                      {vehiculo.estadoAvisoService === 'pendiente' && (
                        <button type="button" className="btnAccion" onClick={() => onGestionarAviso(vehiculo)}>
                          Gestionar aviso
                        </button>
                      )}
                      <BotonEliminar  onClick={() => onEliminar(vehiculo)} />
                      
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
