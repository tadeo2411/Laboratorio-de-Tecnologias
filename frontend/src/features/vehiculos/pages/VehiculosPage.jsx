import { useEffect, useState } from 'react'
import Modal from '../../../shared/components/Modal/Modal'
import VehiculoForm from '../components/VehiculoForm'
import VehiculosList from '../components/VehiculosList'
import HistorialVehiculo from '../components/HistorialVehiculo'
import AvisoService from '../components/AvisoService'
import BotonNuevo from '../../../shared/components/BotonNuevo'
import {
  actualizarEstadoAviso,
  actualizarVehiculo,
  crearVehiculo,
  eliminarVehiculo,
  obtenerClientes,
  obtenerVehiculos,
} from '../services/vehiculosService'
import './VehiculosPage.css'
import Spinner from '../../../shared/components/Spinner/Spinner'

function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState([])
  const [clientes, setClientes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [vehiculoEnEdicion, setVehiculoEnEdicion] = useState(null)
  const [vehiculoConHistorial, setVehiculoConHistorial] = useState(null)
  const [vehiculoConAviso, setVehiculoConAviso] = useState(null)

  // Carga vehículos y clientes desde el servicio al entrar a la página.
  // "activo" evita actualizar el estado si la página se cerró antes de recibir los datos.
  useEffect(() => {
    let activo = true

    async function cargarDatos() {
      try {
        const [vehiculosGuardados, clientesGuardados] = await Promise.all([
          obtenerVehiculos(),
          obtenerClientes(),
        ])

        if (activo) {
          setVehiculos(vehiculosGuardados)
          setClientes(clientesGuardados)
        }
      } catch (errorCarga) {
        if (activo) setError(errorCarga.message)
      } finally {
        if (activo) setCargando(false)
      }
    }

    cargarDatos()

    return () => {
      activo = false
    }
  }, [])

  function mostrarMensaje(texto) {
    setError('')
    setMensaje(texto)
  }

  function mostrarError(texto) {
    setMensaje('')
    setError(texto)
  }

  // vehiculo = null abre el formulario para registrar uno nuevo.
  function abrirFormulario(vehiculo = null) {
    setVehiculoEnEdicion(vehiculo)
    setFormularioAbierto(true)
  }

  function cerrarFormulario() {
    setFormularioAbierto(false)
    setVehiculoEnEdicion(null)
  }

  // No captura errores: si el servicio rechaza los datos, el formulario
  // muestra el motivo y queda abierto para corregirlos.
  async function guardarVehiculo(datos) {
    if (vehiculoEnEdicion) {
      const vehiculoActualizado = await actualizarVehiculo(vehiculoEnEdicion.id, datos)
      setVehiculos((vehiculosActuales) =>
        vehiculosActuales.map((vehiculo) =>
          vehiculo.id === vehiculoActualizado.id ? vehiculoActualizado : vehiculo,
        ),
      )
      mostrarMensaje('Vehículo actualizado correctamente.')
    } else {
      const vehiculoCreado = await crearVehiculo(datos)
      setVehiculos((vehiculosActuales) => [...vehiculosActuales, vehiculoCreado])
      mostrarMensaje('Vehículo agregado correctamente.')
    }
    cerrarFormulario()
  }

  async function confirmarEliminacion(vehiculo) {
    if (!window.confirm(`¿Eliminar el vehículo ${vehiculo.patente}? Esta acción no se puede deshacer.`)) return

    try {
      await eliminarVehiculo(vehiculo.id)
      setVehiculos((vehiculosActuales) => vehiculosActuales.filter(({ id }) => id !== vehiculo.id))
      mostrarMensaje('Vehículo eliminado correctamente.')
    } catch (errorEliminacion) {
      mostrarError(errorEliminacion.message)
    }
  }

  async function registrarAviso(estado) {
    try {
      const vehiculoActualizado = await actualizarEstadoAviso(vehiculoConAviso.id, estado)
      setVehiculos((vehiculosActuales) =>
        vehiculosActuales.map((vehiculo) =>
          vehiculo.id === vehiculoActualizado.id ? vehiculoActualizado : vehiculo,
        ),
      )
      mostrarMensaje(estado === 'enviado' ? 'Aviso de service marcado como enviado.' : 'Aviso de service descartado.')
    } catch (errorAviso) {
      mostrarError(errorAviso.message)
    } finally {
      setVehiculoConAviso(null)
    }
  }

  return (
    <div className="contenedor">
      <div className="vehiculos-page__encabezado">
        <h1>Gestión de vehículos</h1>
        <BotonNuevo
        onClick={()=>abrirFormulario()}
        componente = "Vehículo"/>

      </div>

      {mensaje && (
        <div className="alert alert-success alert-dismissible" role="status">
          {mensaje}
          <button type="button" className="btn-close" aria-label="Cerrar mensaje" onClick={() => setMensaje('')} />
        </div>
      )}

      {error && (
        <div className="alert alert-danger alert-dismissible" role="alert">
          {error}
          <button type="button" className="btn-close" aria-label="Cerrar error" onClick={() => setError('')} />
        </div>
      )}

      {cargando ? (
        <Spinner />
      ) : (
        <VehiculosList
          vehiculos={vehiculos}
          onEditar={abrirFormulario}
          onEliminar={confirmarEliminacion}
          onGestionarAviso={setVehiculoConAviso}
          onVerHistorial={setVehiculoConHistorial}
        />
      )}

      {formularioAbierto && (
        <Modal
          titulo={vehiculoEnEdicion ? 'Editar vehículo' : 'Registrar vehículo'}
          onCerrar={cerrarFormulario}
          cerrarAlTocarFondo={false}
        >
          <VehiculoForm
            vehiculo={vehiculoEnEdicion}
            clientes={clientes}
            onCancelar={cerrarFormulario}
            onGuardar={guardarVehiculo}
          />
        </Modal>
      )}

      {vehiculoConHistorial && (
        <HistorialVehiculo vehiculo={vehiculoConHistorial} onCerrar={() => setVehiculoConHistorial(null)} />
      )}

      {vehiculoConAviso && (
        <AvisoService
          vehiculo={vehiculoConAviso}
          onCerrar={() => setVehiculoConAviso(null)}
          onConfirmar={registrarAviso}
        />
      )}
    </div>
  )
}

export default VehiculosPage
