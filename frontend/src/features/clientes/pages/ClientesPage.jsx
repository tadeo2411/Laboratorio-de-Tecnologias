import { useCallback, useEffect, useState, useDeferredValue } from 'react'
import ClientesForm from '../components/ClientesForm'
import {
  obtenerClientes,
  crearCliente,
  modificarCliente,
  eliminarCliente,
} from '../services/clientesServices'
import img_list from '../../../assets/icons/clientesIcono.svg'
import '../clientes.css'
import '../../estilos.css'
import BotonNuevo from '../../../shared/components/BotonNuevo'
import Table from '../../../shared/components/Table'
import BotonEditar from '../../../shared/components/BotonEditar'
import BotonEliminar from '../../../shared/components/BotonEliminar'
import Modal from '../../../shared/components/Modal'
import ModalNotificacion from "../../../shared/components/ModalNotification";
import Spinner from '../../../shared/components/Spinner'

const columnasClientes = [
  { key: 'nombre', nombre: 'Nombre' },
  { key: 'documento', nombre: 'DNI / CUIT' },
  { key: 'telefono', nombre: 'Teléfono' },
  { key: 'acciones', nombre: 'Acciones' },
]

function ClientesPage() {
  const [clientes, setClientes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [errorFormulario, setErrorFormulario] = useState(null)
  const [clienteAEditar, setClienteAEditar] = useState(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [notificacion, setNotificacion] = useState(null);

  const busquedaDiferida = useDeferredValue(busqueda)

  const cerrarFormulario = useCallback(() => {
    setMostrarFormulario(false)
    setErrorFormulario(null)
    setClienteAEditar(null)
  }, [])

  const cargarClientes = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const listaClientes = await obtenerClientes()
      setClientes(listaClientes)
    } catch (err) {
      setNotificacion({
        tipo: "error",
        mensaje : err.message || 'No se pudieron cargar los clientes'})
    } finally {
      setCargando(false)
    }
  }, [])


  useEffect(() => {
    let activo = true

    async function inicializar() {
      try {
        const listaClientes = await obtenerClientes()
        if (activo) setClientes(listaClientes)
      } catch (err) {
        if (activo)
          setNotificacion({
            tipo: "error",
            mensaje: err.message || 'No se pudieron cargar los clientes',
          })
      } finally {
        if (activo) setCargando(false)
      }
    }

    inicializar()
    return () => {
      activo = false
    }
  }, [])

  const termino = busquedaDiferida.toLowerCase().trim()
  const clientesFiltrados = clientes.filter((cliente) => {
    if (!termino) return true
    const coincideNombre = cliente.nombre?.toLowerCase().includes(termino)
    const coincideDoc = cliente.documento?.toString().includes(termino)
    const coincideTel = cliente.telefono?.toString().includes(termino)
    return Boolean(coincideNombre || coincideDoc || coincideTel)
  })

  function handleNuevoCliente() {
    setClienteAEditar(null)
    setErrorFormulario(null)
    setMostrarFormulario(true)
  }

  function handleEditarCliente(cliente) {
    setClienteAEditar(cliente)
    setErrorFormulario(null)
    setMostrarFormulario(true)
  }

  async function handleGuardarCliente(datos) {
    try {
      const esEdicion = Boolean(clienteAEditar)

      if (esEdicion) {
        const modificado = await modificarCliente(clienteAEditar.id, datos)
        setClientes((anteriores) =>
          anteriores.map((cliente) =>
            cliente.id === clienteAEditar.id ? modificado : cliente
          )
        )
      } else {
        const creado = await crearCliente(datos)
        setClientes((anteriores) => [...anteriores, creado])
      }

      cerrarFormulario()

      setNotificacion({
        tipo: 'exito',
        mensaje: esEdicion
          ? 'Cliente modificado correctamente.'
          : 'Cliente registrado correctamente.',
      })
    } catch (err) {
      setErrorFormulario(err.message)
      throw err
    }
  }

  async function handleEliminarCliente(idCliente, nombreCliente) {
    setNotificacion({
      tipo: "confirmacion",
      titulo: "Eliminar Cliente",
      mensaje : `¿Desea eliminar el cliente "${nombreCliente}"?`,
      textoAceptar : 'Eliminar',
      textoCancelar : 'Cancelar',

      onAceptar: async () =>{
        setNotificacion(null)
        try {
          await eliminarCliente(idCliente)
          setClientes((anteriores) => anteriores.filter((c) => c.id !== idCliente))
          
          setNotificacion({
          tipo: 'exito',
          mensaje: 'Cliente eliminado correctamente.',
          })
        
        } catch (err) {
          setNotificacion({
            tipo: "error",
            mensaje : err.message || 'No se pudo eliminar el cliente.'
          })
        }
      }
    })
  }

  return (
    <div className="contenedor">
      <div className="page-header">
        <div className="page-header-image" aria-hidden="true">
          <img src={img_list} alt="" />
        </div>
        <div className="page-header-title">
          <h1>Clientes</h1>
          <p>Listado de clientes registrados en el sistema.</p>
        </div>

        <BotonNuevo onClick={handleNuevoCliente} componente="cliente" />
      </div>

      {error && (
        <div
          className="alert alert-danger d-flex align-items-center justify-content-between mb-4"
          role="alert"
        >
          <div>
            <strong>Error:</strong> {error}
          </div>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={cargarClientes}
          >
            Reintentar
          </button>
        </div>
      )}

      {cargando && (
        <div className="text-center py-5">
          <Spinner />
          <p className="mt-2 text-muted">Cargando clientes…</p>
        </div>
      )}

      {!cargando && !error && (
        <Table
          inputPlaceholder="Buscar por nombre, DNI/CUIT o teléfono..."
          columnas={columnasClientes}
          datos={clientesFiltrados}
          mensajeVacio="No hay clientes registrados"
          valorBusqueda={busqueda}
          alCambiarBusqueda={setBusqueda}
          renderFila={(cliente) => (
            <tr key={cliente.id} className="cliente-row">
              <td className="cliente-nombre" data-label="Nombre">
                {cliente.nombre}
              </td>

              <td className="cliente-dni" data-label="DNI / CUIT">
                {cliente.documento}
              </td>

              <td className="cliente-telefono" data-label="Teléfono">
                {cliente.telefono || '-'}
              </td>

              <td className="cliente-acciones" data-label="Acciones">
                <div className="acciones-container">
                  <BotonEditar
                    onClick={() => handleEditarCliente(cliente)}
                    componente="Cliente"
                    aria-label={`Editar cliente ${cliente.nombre}, documento ${cliente.documento}`}
                  />
                  <BotonEliminar
                    onClick={() => handleEliminarCliente(cliente.id, cliente.nombre)}
                    aria-label={`Eliminar cliente ${cliente.nombre}`}
                  />
                </div>
              </td>
            </tr>
          )}
        />
      )}

      {mostrarFormulario && (
        <Modal
          titulo={clienteAEditar ? 'Editar cliente' : 'Nuevo cliente'}
          onCerrar={cerrarFormulario}
        >
          <ClientesForm
            clienteInicial={clienteAEditar}
            onGuardar={handleGuardarCliente}
            onCancelar={cerrarFormulario}
            error={errorFormulario}
          />
        </Modal>
      )}
      {notificacion && (
        <ModalNotificacion
          {...notificacion}
          onCerrar={() => setNotificacion(null)}
        />
      )}
    </div>
  )
}

export default ClientesPage
