import { useEffect, useState } from 'react'
import Modal from '../../../shared/components/Modal'
import VehiculoForm from '../components/VehiculoForm'
import HistorialVehiculo from '../components/HistorialVehiculo'
import AvisoService from '../components/AvisoService'
import BotonNuevo from '../../../shared/components/BotonNuevo'
import BotonEditar from '../../../shared/components/BotonEditar'
import BotonEliminar from '../../../shared/components/BotonEliminar'
import botonHistorial from '../../../assets/icons/botonHistorial.svg'
import IconoVehiculo from '../../../assets/icons/vehiculosIcono.svg?react'
import {
  modificarVehiculo,
  crearVehiculo,
  eliminarVehiculo,
  obtenerVehiculos,
  obtenerDuenos,
  sincronizarDuenos
} from '../services/vehiculosService'
import { obtenerClientes } from '../../clientes'
import '../VehiculosPage.css'
import Spinner from '../../../shared/components/Spinner'
import Table from '../../../shared/components/Table'
import '../../estilos.css'
import ModalNotificacion from '../../../shared/components/ModalNotification'

const columnasVehiculos = [
  { key: 'patente', nombre: 'Patente' },
  { key: 'marca', nombre: 'Marca' },
  { key: 'modelo', nombre: 'Modelo' },
  { key: 'anio', nombre: 'Año' },
  { key: 'kilometraje', nombre: 'Kilometraje' },
  { key: 'acciones', nombre: 'Acciones' }
]

function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState([])
  const [clientes, setClientes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [vehiculoEnEdicion, setVehiculoEnEdicion] = useState(null)
  const [vehiculoConHistorial, setVehiculoConHistorial] = useState(null)
  const [vehiculoConAviso, setVehiculoConAviso] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [notificacion, setNotificacion] = useState(null)

  // Carga vehículos y clientes desde el servicio al entrar a la página.
  // "activo" evita actualizar el estado si la página se cerró antes de recibir los datos.
  useEffect(() => {
    let activo = true

    async function cargarDatos() {
      try {
        const [vehiculosGuardados, clientesGuardados] = await Promise.all([
          obtenerVehiculos(),
          obtenerClientes()
        ])

        if (activo) {
          setVehiculos(vehiculosGuardados)
          setClientes(clientesGuardados)
        }
      } catch (errorCarga) {
        if (activo) {
          setNotificacion({
            tipo: 'error',
            mensaje: errorCarga.message || 'No se pudieron cargar los vehículos.'
          })
        }
      } finally {
        if (activo) setCargando(false)
      }
    }

    cargarDatos()

    return () => {
      activo = false
    }
  }, [])

  async function abrirFormulario(vehiculo = null) {
    if (vehiculo) {
      try {
        const duenos = await obtenerDuenos(vehiculo.id)
        setVehiculoEnEdicion({
          ...vehiculo,
          clienteIds: duenos.map((d) => d.id)
        })
      } catch (err) {
        setNotificacion({
          tipo: 'error',
          mensaje: 'No se pudieron obtener los dueños: ' + err.message
        })
        return
      }
    } else {
      setVehiculoEnEdicion(null)
    }
    setFormularioAbierto(true)
  }

  function cerrarFormulario() {
    setFormularioAbierto(false)
    setVehiculoEnEdicion(null)
  }

  // Si el servicio rechaza los datos, se propaga el error para que el
  // formulario lo muestre inline y quede abierto para corregirlo.
  async function guardarVehiculo(datos) {
    if (vehiculoEnEdicion) {
      const vehiculoActualizado = await modificarVehiculo(vehiculoEnEdicion.id, datos)
      await sincronizarDuenos(
        vehiculoEnEdicion.id,
        vehiculoEnEdicion.clienteIds || [],
        datos.clienteIds || []
      )

      setVehiculos((vehiculosActuales) =>
        vehiculosActuales.map((vehiculo) =>
          vehiculo.id === vehiculoActualizado.id ? vehiculoActualizado : vehiculo
        )
      )
      setNotificacion({
        tipo: 'exito',
        mensaje: 'Vehículo actualizado correctamente.'
      })
    } else {
      const vehiculoCreado = await crearVehiculo(datos)
      setVehiculos((vehiculosActuales) => [...vehiculosActuales, vehiculoCreado])
      setNotificacion({
        tipo: 'exito',
        mensaje: 'Vehículo registrado correctamente.'
      })
    }
    cerrarFormulario()
  }

  function confirmarEliminacion(vehiculo) {
    setNotificacion({
      tipo: 'confirmacion',
      titulo: 'Eliminar vehículo',
      mensaje: `¿Desea eliminar el vehículo ${vehiculo.patente} (${vehiculo.marca} ${vehiculo.modelo})? Esta acción no se puede deshacer.`,
      textoAceptar: 'Eliminar',
      textoCancelar: 'Cancelar',
      onAceptar: async () => {
        setNotificacion(null)
        try {
          await eliminarVehiculo(vehiculo.id)
          setVehiculos((vehiculosActuales) =>
            vehiculosActuales.filter(({ id }) => id !== vehiculo.id)
          )
          setNotificacion({
            tipo: 'exito',
            mensaje: 'Vehículo eliminado correctamente.'
          })
        } catch (errorEliminacion) {
          setNotificacion({
            tipo: 'error',
            mensaje: errorEliminacion.message || 'No se pudo eliminar el vehículo.'
          })
        }
      }
    })
  }

  function avisoGestionado(idVehiculo, estado) {
    setVehiculos((vehiculosActuales) =>
      vehiculosActuales.map((vehiculo) =>
        vehiculo.id === idVehiculo ? { ...vehiculo, proximoService: null } : vehiculo
      )
    )
    setVehiculoConAviso(null)
    setNotificacion({
      tipo: 'exito',
      mensaje: estado === 'ENVIADO' ? 'Aviso de service marcado como enviado.' : 'Aviso de service descartado.'
    })
  }

  const termino = busqueda.toLowerCase().trim()
  const vehiculosFiltrados = vehiculos.filter((vehiculo) => {
    if (!termino) return true
    const coincidePatente = vehiculo.patente?.toLowerCase().includes(termino)
    const coincideMarca = vehiculo.marca?.toLowerCase().includes(termino)
    const coincideModelo = vehiculo.modelo?.toLowerCase().includes(termino)
    return Boolean(coincidePatente || coincideMarca || coincideModelo)
  })

  return (
    <div className="contenedor">
      <div className="page-header">
        <div className="page-header-image">
          <IconoVehiculo aria-hidden="true" />
        </div>
        <div className="page-header-title">
          <h1>Vehículos</h1>
          <p>Listado de vehículos registrados en el sistema.</p>
        </div>
        <BotonNuevo
          onClick={() => abrirFormulario()}
          componente="vehiculo"
        />
      </div>

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
              <td className="vehiculo-patente" data-label="Patente">
                {vehiculo.patente}
              </td>

              <td className="vehiculo-marca" data-label="Marca">
                {vehiculo.marca}
              </td>

              <td className="vehiculo-modelo" data-label="Modelo">
                {vehiculo.modelo}
              </td>

              <td className="vehiculo-anio" data-label="Año">
                {vehiculo.anio}
              </td>

              <td className="vehiculo-kilometraje" data-label="Kilometraje">
                {vehiculo.kilometraje?.toLocaleString('es-AR')} km
              </td>

              <td className="vehiculo-acciones" data-label="Acciones">
                <div className="acciones-container">
                  <button
                    type="button"
                    className="botonHistorial"
                    onClick={() => setVehiculoConHistorial(vehiculo)}
                    aria-label={`Ver historial de services de ${vehiculo.patente}`}
                    title="Ver historial de services"
                  >
                    <img src={botonHistorial} alt="" aria-hidden="true" />
                  </button>

                  <BotonEditar onClick={() => abrirFormulario(vehiculo)} />
                  <BotonEliminar onClick={() => confirmarEliminacion(vehiculo)} />
                  {vehiculo.proximoService && (
                    <button
                      type="button"
                      className="botonAviso"
                      onClick={() => setVehiculoConAviso(vehiculo)}
                      aria-label={`Aviso de service pendiente de ${vehiculo.patente}`}
                      title="Aviso de service pendiente"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                      </svg>
                    </button>
                  )}
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
        <HistorialVehiculo
          vehiculo={vehiculoConHistorial}
          onCerrar={() => setVehiculoConHistorial(null)}
        />
      )}

      {vehiculoConAviso && (
        <AvisoService
          vehiculo={vehiculoConAviso}
          onCerrar={() => setVehiculoConAviso(null)}
          onGestionado={avisoGestionado}
        />
      )}

      {notificacion && (
        <ModalNotificacion
          {...notificacion}
          onCerrar={() => {
            if (notificacion.onCerrar) {
              notificacion.onCerrar()
            } else {
              setNotificacion(null)
            }
          }}
        />
      )}
    </div>
  )
}

export default VehiculosPage
