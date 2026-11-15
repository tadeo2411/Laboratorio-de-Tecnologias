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

  const busquedaDiferida = useDeferredValue(busqueda)

  const cerrarFormulario = useCallback(() => {
    setMostrarFormulario(false)
    setErrorFormulario(null)
  }, [])

  const cargarClientes = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const listaClientes = await obtenerClientes()
      setClientes(listaClientes)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los clientes')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargarClientes()
  }, [cargarClientes])

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
      if (clienteAEditar) {
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
    } catch (err) {
      setErrorFormulario(err.message)
      throw err
    }
  }

  async function handleEliminarCliente(idCliente, nombreCliente) {
    const confirmacion = window.confirm(`¿Desea eliminar el cliente "${nombreCliente}"?`)
    if (!confirmacion) return

    try {
      await eliminarCliente(idCliente)
      setClientes((anteriores) => anteriores.filter((cliente) => cliente.id !== idCliente))
    } catch (err) {
      window.alert(err.message || 'No se pudo eliminar el cliente.')
    }
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
        <div className="text-center py-5" role="status">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando clientes…</span>
          </div>
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
    </div>
  )
}

export default ClientesPage
