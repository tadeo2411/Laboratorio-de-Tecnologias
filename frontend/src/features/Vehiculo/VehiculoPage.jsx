import { useState } from 'react'
import VehiculosForm from './components/VehiculosForm'
import VehiculosList from './components/VehiculosList'
import HistorialVehiculo from './components/HistorialVehiculo'
import AvisoService from './components/AvisoService'
import vehiculosIniciales from './data/vehiculos.json'
import './vehiculos.css'

function VehiculoPage() {
  const [vehiculos, setVehiculos] = useState(vehiculosIniciales)
  const [vehiculoEnEdicion, setVehiculoEnEdicion] = useState(null)
  const [vehiculoConHistorial, setVehiculoConHistorial] = useState(null)
  const [vehiculoConAviso, setVehiculoConAviso] = useState(null)
  const [mensaje, setMensaje] = useState('')

  function guardarVehiculo(vehiculo) {
    if (vehiculoEnEdicion && !vehiculoEnEdicion.isNew) {
      setVehiculos((vehiculosActuales) =>
        vehiculosActuales.map((vehiculoActual) =>
          vehiculoActual.id === vehiculoEnEdicion.id
            ? { ...vehiculoActual, ...vehiculo }
            : vehiculoActual,
        ),
      )
      setVehiculoEnEdicion(null)
      setMensaje('Vehículo actualizado correctamente.')
      return
    }

    setVehiculos((vehiculosActuales) => [
      ...vehiculosActuales,
      {
        id: crypto.randomUUID(),
        ...vehiculo,
        estadoAvisoService: vehiculo.proximoService ? 'pendiente' : 'sin-aviso',
        historialServices: [],
      },
    ])
    setVehiculoEnEdicion(null) // Cierra el modal al guardar nuevo
    setMensaje('Vehículo agregado correctamente.')
  }

  function eliminarVehiculo(vehiculo) {
    if (!window.confirm(`¿Eliminar el vehículo ${vehiculo.patente}? Esta acción no se puede deshacer.`)) return
    setVehiculos((vehiculosActuales) => vehiculosActuales.filter(({ id }) => id !== vehiculo.id))
    if (vehiculoEnEdicion?.id === vehiculo.id) setVehiculoEnEdicion(null)
    setMensaje('Vehículo eliminado correctamente.')
  }

  function actualizarAviso(estado) {
    setVehiculos((vehiculosActuales) =>
      vehiculosActuales.map((vehiculo) =>
        vehiculo.id === vehiculoConAviso.id ? { ...vehiculo, estadoAvisoService: estado } : vehiculo,
      ),
    )
    setMensaje(estado === 'enviado' ? 'Aviso de service marcado como enviado.' : 'Aviso de service descartado.')
    setVehiculoConAviso(null)
  }

  return (
    <div className="gestion-page container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="m-0">Gestión de Taller</h1>
        {/* Botón para crear uno nuevo disparando el modal */}
        <button className="btn btn-primary" onClick={() => setVehiculoEnEdicion({ isNew: true })}>
          + Nuevo Vehículo
        </button>
      </div>

      {mensaje && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {mensaje}
          <button type="button" className="btn-close" onClick={() => setMensaje('')}></button>
        </div>
      )}

      <VehiculosList
        vehiculos={vehiculos}
        onEditar={setVehiculoEnEdicion}
        onEliminar={eliminarVehiculo}
        onEnviarAviso={setVehiculoConAviso}
        onVerHistorial={setVehiculoConHistorial}
      />

      {/* MODAL DE EDICIÓN / CREACIÓN (Bootstrap Nativo con React) */}
      {vehiculoEnEdicion && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {vehiculoEnEdicion.isNew ? 'Registrar Nuevo Vehículo' : 'Editar Vehículo'}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setVehiculoEnEdicion(null)}></button>
                </div>
                <div className="modal-body">
                  <VehiculosForm
                    vehiculoEnEdicion={vehiculoEnEdicion.isNew ? null : vehiculoEnEdicion}
                    onCancelar={() => setVehiculoEnEdicion(null)}
                    onGuardar={guardarVehiculo}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {vehiculoConHistorial && <HistorialVehiculo vehiculo={vehiculoConHistorial} onCerrar={() => setVehiculoConHistorial(null)} />}
      {vehiculoConAviso && <AvisoService vehiculo={vehiculoConAviso} onCerrar={() => setVehiculoConAviso(null)} onConfirmar={actualizarAviso} />}
    </div>
  )
}

export default VehiculoPage