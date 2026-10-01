function HistorialVehiculo({ vehiculo, onCerrar }) {
  const historial = vehiculo.historialServices ?? []

  return (
    <div className="modal-fondo" role="presentation" onMouseDown={onCerrar}>
      <section className="modal-contenido" role="dialog" aria-modal="true" aria-labelledby="historial-titulo" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-cabecera">
          <h2 id="historial-titulo">Historial de {vehiculo.patente}</h2>
          <button type="button" className="btnCerrar" onClick={onCerrar} aria-label="Cerrar historial">×</button>
        </div>
        {historial.length === 0 ? (
          <p className="sinDatos">Este vehículo todavía no tiene services registrados.</p>
        ) : (
          <ul className="historial-lista">
            {historial.map((service) => (
              <li key={service.id}>
                <strong>{service.fecha}</strong> · {service.kilometraje.toLocaleString('es-AR')} km<br />
                <span>{service.detalle}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default HistorialVehiculo
