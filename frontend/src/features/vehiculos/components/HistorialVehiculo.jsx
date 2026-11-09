import { useEffect, useState } from 'react'
import Modal from '../../../shared/components/Modal'
import Spinner from '../../../shared/components/Spinner'

import { verHistorialService } from '../services/vehiculosService'

function formatearFecha(fecha) {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString('es-AR')
}

function HistorialVehiculo({ vehiculo, onCerrar }) {
  const [historial, setHistorial] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    async function cargarHistorial() {
      try {
        setCargando(true)
        setError('')
        const datos = await verHistorialService(vehiculo.id)
        if (activo) {
          setHistorial(datos || [])
        }
      } catch (err) {
        if (activo) {
          setError(err.message || 'No se pudo cargar el historial.')
        }
      } finally {
        if (activo) {
          setCargando(false)
        }
      }
    }

    if (vehiculo?.id) {
      cargarHistorial()
    }

    return () => {
      activo = false
    }
  }, [vehiculo?.id])

  return (
    <Modal titulo={`Historial de ${vehiculo.patente}`} onCerrar={onCerrar}>
      {cargando && <Spinner />}

      {error && (
        <p className="alert alert-danger" role="alert">
          {error}
        </p>
      )}

      {!cargando && !error && historial.length === 0 && (
        <p className="sinDatos">Este vehículo todavía no tiene services registrados.</p>
      )}

      {!cargando && !error && historial.length > 0 && (
        <ul className="historial-lista">
          {historial.map((service) => (
            <li key={service.id}>
              <strong>{formatearFecha(service.fecha)}</strong>
              {service.kilometraje != null && (
                <> · {service.kilometraje.toLocaleString('es-AR')} km</>
              )}
              {service.detalle && (
                <>
                  <br />
                  <span>{service.detalle}</span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </Modal>
  )
}

export default HistorialVehiculo
