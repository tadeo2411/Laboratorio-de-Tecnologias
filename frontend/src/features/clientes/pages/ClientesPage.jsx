import { useCallback, useEffect, useState } from 'react'
import ClientesForm from '../components/ClientesForm'
import { obtenerClientes, crearCliente, modificarCliente, eliminarCliente } from '../services/clientesServices'
import img_list from "../../../assets/icons/clientesIcono.svg"
import "../clientes.css";
import "../../estilos.css"
import BotonNuevo from '../../../shared/components/BotonNuevo'
import Table from '../../../shared/components/Table'
import BotonEditar from '../../../shared/components/BotonEditar'
import BotonEliminar from '../../../shared/components/BotonEliminar'
import Modal from '../../../shared/components/Modal'

const columnasClientes = [
    { key: "nombre", nombre: "Nombre" },
    { key: "documento", nombre: "DNI / CUIT" },
    { key: "telefono", nombre: "Teléfono" },
    { key: "acciones", nombre: "Acciones" }
];

function ClientesPage() {
    const [clientes, setClientes] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)
    const [errorFormulario, setErrorFormulario] = useState(null)
    const [clienteAEditar, setClienteAEditar] = useState(null)
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [busqueda, setBusqueda] = useState('')
    const cerrarFormulario = useCallback(() => setMostrarFormulario(false), [])

    useEffect(() => {
        let activo = true

        async function cargarClientes() {
            try {
                const listaClientes = await obtenerClientes()
                if (activo) {
                    setClientes(listaClientes)
                }
            } catch (err) {
                if (activo) {
                    setError(err instanceof Error ? err.message : 'No se pudieron cargar los clientes')
                }
            } finally {
                if (activo) setCargando(false)
            }
        }

        cargarClientes()
        return () => { activo = false }
    }, [])

    const termino = busqueda.toLowerCase().trim()
    const clientesFiltrados = clientes.filter(
        cliente =>
        cliente.nombre.toLowerCase().includes(termino) ||
        cliente.documento.includes(termino)
    )

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
            setClientes(anteriores => anteriores.map(cliente =>
                cliente.id === clienteAEditar.id ? modificado : cliente
            ))
        } else {
            const creado = await crearCliente(datos)
            setClientes(anteriores => [...anteriores, creado])
        }
        cerrarFormulario()
    } catch (err) {
        setErrorFormulario(err.message)
    }
}

async function handleEliminarCliente(idCliente) {
    if (!window.confirm('¿Desea eliminar el cliente?')) return
    try {
        await eliminarCliente(idCliente)
        setClientes(anteriores => anteriores.filter(cliente => cliente.id !== idCliente))
    } catch (err) {
        window.alert(err.message)
    }
}

    return (
        <div>
            {error && <p role="alert">{error}</p>}
            {cargando && <p role="status">Cargando clientes…</p>}
            {!cargando && !error && (
                <div className="contenedor">
                   <div className="page-header">
                   
                           <div className="page-header-image">
                   
                             <img src={img_list} alt="Listado" />
                           </div>
                           <div className="page-header-title">
                            <h1>Clientes</h1>
                            <p>Listado de clientes registrados en el sistema.</p>
                        </div>

                        <BotonNuevo
                            onClick={handleNuevoCliente}
                            componente={"cliente"}
                        />
                    </div>

                    <Table
                        inputPlaceholder="Buscar por nombre, apellido, DNI..."
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
                                    {cliente.telefono}
                                </td>

                                <td className="cliente-acciones" data-label="Acciones">
                                    <div className="acciones-container">

                                        <BotonEditar
                                        onClick={() => handleEditarCliente(cliente)}
                                        componente = "Cliente"
                                        aria-label={`Editar cliente ${cliente.nombre} y documento ${cliente.documento}`}
                                        />

                                        <BotonEliminar
                                            onClick={() => handleEliminarCliente(cliente.id)}
                                            aria-label={`Eliminar cliente ${cliente.nombre} `}

                                        />

                                    </div>
                                </td>

                            </tr>
                        )}
                    />
                </div>
            )}
            {mostrarFormulario && (
                
                <Modal
                    titulo={clienteAEditar ? 'Editar cliente' : 'Nuevo cliente'}
                    onCerrar={cerrarFormulario}
                >
                    <ClientesForm
                        clienteInicial={clienteAEditar}
                        onGuardar={handleGuardarCliente}
                        error={errorFormulario}
                    />
                </Modal>
            )}
        </div>
    )
}

export default ClientesPage
