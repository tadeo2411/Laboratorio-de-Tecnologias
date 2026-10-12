import { useCallback, useEffect, useState } from 'react'
import Clientes from '../components/Clientes'
import ClientesForm from '../components/ClientesForm'
import ClientesModal from '../components/ClientesModal'
import { obtenerClientes } from '../services/clientesServices'
import img_list from "../../../assets/icons/img_list.png"
import "../clientes.css";
import BotonNuevo from '../../../shared/components/BotonNuevo'
import Table from '../../../shared/components/Table'
import BotonEditar from '../../../shared/components/BotonEditar'
import BotonEliminar from '../../../shared/components/BotonEliminar'

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

    function handleGuardarCliente(datos) {
        // El id identifica al cliente en el sistema; el documento (DNI o CUIT) es un dato
        // del cliente que igual no se puede repetir.
        const documento = datos.documento.replace(/[.\s-]/g, '')
        const repetido = clientes.some(cliente =>
            cliente.id !== clienteAEditar?.id &&
            cliente.documento.replace(/[.\s-]/g, '') === documento
        )

        if (repetido) {
            setErrorFormulario('Ya existe un cliente con ese DNI / CUIT.')
            return
        }

        // Como en turnos, las altas y modificaciones quedan en el estado local.
        if (clienteAEditar) {
            setClientes(anteriores => anteriores.map(cliente =>
                cliente.id === clienteAEditar.id ? { ...cliente, ...datos } : cliente
            ))
        } else {
            setClientes(anteriores => [...anteriores, { ...datos, id: crypto.randomUUID() }])
        }
        cerrarFormulario()
    }

    function handleEliminarCliente(idCliente) {
        if (!window.confirm('¿Desea eliminar el cliente?')) return
        setClientes(anteriores => anteriores.filter(cliente => cliente.id !== idCliente))
    }

    return (
        <div className="clientes-page">
            {error && <p role="alert">{error}</p>}
            {cargando && <p role="status">Cargando clientes…</p>}
            {!cargando && !error && (
                <div className="contenedor">
                    <div className="clientes-page">
                        <div className="img-container">
                            <img src={img_list} />
                        </div>

                        <div className="title-container">
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
                        datos={clientes}
                        mensajeVacio="No hay clientes registrados"
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
                <ClientesModal
                    titulo={clienteAEditar ? 'Editar cliente' : 'Nuevo cliente'}
                    onCerrar={cerrarFormulario}
                >
                    <ClientesForm
                        clienteInicial={clienteAEditar}
                        onGuardar={handleGuardarCliente}
                        error={errorFormulario}
                    />
                </ClientesModal>
            )}
        </div>
    )
}

export default ClientesPage
