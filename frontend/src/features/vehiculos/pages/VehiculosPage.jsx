import { useEffect, useState } from 'react'
import Modal from '../../../shared/components/Modal'
import VehiculoForm from '../components/VehiculoForm'
import HistorialVehiculo from '../components/HistorialVehiculo'
import AvisoService from '../components/AvisoService'
import BotonNuevo from '../../../shared/components/BotonNuevo'
import BotonEditar from '../../../shared/components/BotonEditar'
import BotonEliminar from '../../../shared/components/BotonEliminar'
import botonHistorial from '../../../assets/icons/botonHistorial.svg'
import {
  modificarVehiculo,
  crearVehiculo,
  eliminarVehiculo,
  obtenerClientes,
  obtenerVehiculos,
  obtenerDuenos,
  asociarDueno,
  desasociarDueno
} from '../services/vehiculosService'
import '../VehiculosPage.css'
import Spinner from '../../../shared/components/Spinner'
import Table from '../../../shared/components/Table'
import img_list from "../../../assets/icons/vehiculosIcono.svg"
import "../../estilos.css"

const columnasVehiculos = [
  { key: "patente", nombre: "Patente" },
  { key: "marca", nombre: "Marca" },
  { key: "modelo", nombre: "Modelo" },
  { key: "anio", nombre: "Año" },
  { key: "kilometraje", nombre: "Kilometraje" },
  { key: "acciones", nombre: "Acciones" }
];

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
  const [busqueda, setBusqueda] = useState('')


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

  async function abrirFormulario(vehiculo = null) {
    if(vehiculo){
      try{
        const duenos = await obtenerDuenos(vehiculo.id)
        setVehiculoEnEdicion({
          ...vehiculo,
          clienteIds: duenos.map((d) => d.id)
        })
      }catch(err){
        mostrarError('No se pudieron obtener los Dueños: ' + err.message )
        return
      }
    }else{
        setVehiculoEnEdicion(null)
      }
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
      const vehiculoActualizado = await modificarVehiculo(vehiculoEnEdicion.id, datos)
      const duenosPrevios = vehiculoEnEdicion.clienteIds || []
      const duenosNuevos = datos.clienteIds || []

      const aAgregar = duenosNuevos.filter(id => !duenosPrevios.includes(id))
      const aQuitar = duenosPrevios.filter(id => !duenosNuevos.includes(id))

      for(const idCliente of aAgregar){
        await asociarDueno(vehiculoEnEdicion.id, idCliente)
      }

      for(const idCliente of aQuitar){
        await desasociarDueno(vehiculoEnEdicion.id, idCliente)
      }

      setVehiculos((vehiculosActuales) =>
        vehiculosActuales.map((vehiculo) =>
          (vehiculo.id === vehiculoActualizado.id ? vehiculoActualizado : vehiculo)),
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

  const termino = busqueda.toLowerCase()
  const vehiculosFiltrados = vehiculos.filter(
    vehiculo => {
      const coincidePatente = vehiculo.patente.toLowerCase().includes(termino)
      const coincideMarca = vehiculo.marca.toLowerCase().includes(termino)
      return coincideMarca || coincidePatente
    }
  )
  return (

    <div className="contenedor">
      <div className="page-header">

        <div className="page-header-image">

          <img src={img_list} alt="Listado" />
        </div>
        <div className="page-header-title">

          <h1>Vehículos</h1> <p>Listado de vehículos registrados en el sistema.</p>
          <BotonNuevo
            onClick={() => abrirFormulario()}
            componente="vehiculo"
          />
        </div>
        
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

        <Table
          inputPlaceholder="Buscar por patente, marca, modelo..."
          columnas={columnasVehiculos}
          datos={vehiculosFiltrados}
          mensajeVacio="Todavía no hay vehículos cargados."
          valorBusqueda={busqueda}
          alCambiarBusqueda={setBusqueda}
          renderFila={(vehiculo) => (
            <tr key={vehiculo.id} className="vehiculo-row">

              <td
                className="vehiculo-patente"
                data-label="Patente"
              >
                {vehiculo.patente}
              </td>

              <td
                className="vehiculo-marca"
                data-label="Marca"
              >
                {vehiculo.marca}
              </td>

              <td
                className="vehiculo-modelo"
                data-label="Modelo"
              >
                {vehiculo.modelo}
              </td>

              <td
                className="vehiculo-anio"
                data-label="Año"
              >
                {vehiculo.anio}
              </td>

              <td
                className="vehiculo-kilometraje"
                data-label="Kilometraje"
              >
                {vehiculo.kilometraje.toLocaleString("es-AR")} km
              </td>

              <td
                className="vehiculo-acciones"
                data-label="Acciones"
              >
                <div className="acciones-container">

                  <button type="button" className="botonHistorial" onClick={() => setVehiculoConHistorial(vehiculo)}>
                    <img src={botonHistorial} alt={`Historial del vehículo de patente ${vehiculo.patente}`} />
                  </button>

                  <BotonEditar onClick={() => abrirFormulario(vehiculo)} />

                  {vehiculo.estadoAvisoService === 'pendiente' && (
                    <button type="button" className="btnAccion" onClick={() => setVehiculoConAviso(vehiculo)}>
                      Gestionar aviso
                    </button>
                  )}

                  <BotonEliminar onClick={() => confirmarEliminacion(vehiculo)} />

                </div>
              </td>

            </tr>
          )}
        />
      )}


      {formularioAbierto && (
        <Modal
          titulo={vehiculoEnEdicion ? 'Editar vehículo' : 'Registrar vehículo'}
          onCerrar={cerrarFormulario}
          cerrarAlTocarFondo={true}
        >
          <VehiculoForm
            vehiculo={vehiculoEnEdicion}
            clientes={clientes}
            onCancelar={cerrarFormulario}
            onGuardar={guardarVehiculo}
            onClienteCreado={(nuevoCliente) =>
              setClientes((actuales) => [...actuales, nuevoCliente])
            }
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
