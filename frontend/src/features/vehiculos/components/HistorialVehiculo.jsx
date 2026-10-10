import Modal from '../../../shared/components/Modal'

function HistorialVehiculo({ vehiculo, onCerrar }) {
  const historial = vehiculo.historialServices ?? []

  return (
    <Modal titulo={`Historial de ${vehiculo.patente}`} onCerrar={onCerrar}>
      {historial.length === 0 ? (
        <p className="sinDatos">Este vehículo todavía no tiene services registrados.</p>
      ) : (
        <ul className="historial-lista">
          {historial.map((service) => (
            <li key={service.id}>
              <strong>{service.fecha}</strong> · {service.kilometraje.toLocaleString('es-AR')} km
              <br />
              <span>{service.detalle}</span>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  )
}

export default HistorialVehiculo
