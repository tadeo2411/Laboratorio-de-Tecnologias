import { useState } from 'react';
import { useLoaderData } from 'react-router';
import EtiquetaEstado from "../components/EtiquetaEstado.jsx";
import Table from '../../../shared/components/Table.jsx';
import BotonNuevo from '../../../shared/components/BotonNuevo.jsx';
import BotonEditar from '../../../shared/components/BotonEditar.jsx';
import Modal from '../../../shared/components/Modal.jsx';
import ModalNotificacion from '../../../shared/components/ModalNotification.jsx';
import MasInfo from "../components/MasInfo.jsx"
import OrdenForm from "../components/OrdenForm.jsx";
import EditarOrden from "../components/EditarOrden.jsx";
import { numeroOrden, formatearFecha, fechaIngreso, describirVehiculo } from "../utils/ordenes";
import { crearOrden, actualizarOrden, agregarFicha, agregarTrabajo, quitarTrabajo, obtenerOrden } from "../services/ordenesService";
import { esEstadoFinal } from "../utils/estados";
import { crearVehiculo } from "../../vehiculos";
import img_list from "../../../assets/icons/img_presupuesto.png"
import "../ordenes.css"
import "../../estilos.css"

const columnasOrdenes = [
    { key: "numero", nombre: "N°" },
    { key: "vehiculo", nombre: "Vehículo" },
    { key: "cliente", nombre: "Cliente" },
    { key: "ingreso", nombre: "Ingreso" },
    { key: "estado", nombre: "Estado" },
    { key: "esService", nombre: "Service" },
    { key: "esUrgencia", nombre: "Urgencia" },
    { key: "acciones", nombre: "Acciones" },
];

// La búsqueda compara contra el número, la patente y el cliente (nombre o documento).
function coincideBusqueda(orden, texto) {
    if (!texto) return true;
    return [numeroOrden(orden.id), String(orden.id), orden.vehiculoPatente, orden.clienteNombre, orden.clienteDocumento]
        .some(valor => valor?.toLowerCase().includes(texto));
}

function OrdenesPage() {
    const datos = useLoaderData();
    const [ordenes, setOrdenes] = useState(datos.ordenes);
    const [vehiculos, setVehiculos] = useState(datos.vehiculos);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modalMasInfoAbierto, setModalMasInfoAbierto] = useState(false);
    const [ordenSeleccionado, setOrdenSeleccionado] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [ordenEnEdicion, setOrdenEnEdicion] = useState(null);
    const [mensajeExito, setMensajeExito] = useState("");
    const [mensajeError, setMensajeError] = useState("");
    const [confirmacion, setConfirmacion] = useState(null);

    function abrirFormulario(orden = null) {
        setOrdenEnEdicion(orden);
        setModalAbierto(true);
    }

    function cerrarFormulario() {
        setModalAbierto(false);
        setOrdenEnEdicion(null);
    }

    function handleGuardarOrden(datosFormulario, fichasNuevas = []) {
        const seCancela = ordenEnEdicion && datosFormulario.estado === "CANCELADO" && ordenEnEdicion.estado !== "CANCELADO";
        if (!seCancela) return guardarOrden(datosFormulario, fichasNuevas);

        setConfirmacion({
            titulo: "Cancelar orden",
            mensaje: "¿Seguro que querés cancelar la orden? Después no se va a poder modificar.",
            textoAceptar: "Sí, cancelar orden",
            textoCancelar: "Volver",
            onAceptar: async () => {
                setConfirmacion(null);
                try {
                    await guardarOrden(datosFormulario, fichasNuevas);
                } catch (errorGuardado) {
                    setMensajeError(errorGuardado.message);
                }
            }
        });
    }

    async function guardarOrden(datosFormulario, fichasNuevas) {
        if (ordenEnEdicion) {
            for (const ficha of fichasNuevas) {
                const ordenConFicha = await agregarFicha(ordenEnEdicion.id, ficha);
                setOrdenEnEdicion(ordenConFicha);
                setOrdenes(anteriores => anteriores.map(orden => orden.id === ordenConFicha.id ? ordenConFicha : orden));
            }
            const ordenActualizada = await actualizarOrden(ordenEnEdicion.id, datosFormulario);
            setOrdenes(anteriores => anteriores.map(orden => orden.id === ordenActualizada.id ? ordenActualizada : orden));
            setMensajeExito(`La orden ${numeroOrden(ordenActualizada.id)} se guardó correctamente.`);
        } else {
            const vehiculo = vehiculos.find(vehiculo => vehiculo.patente === datosFormulario.vehiculoPatente);
            const nuevaOrden = await crearOrden({
                vehiculoId: vehiculo.id,
                clienteId: datosFormulario.clienteId,
                diagnostico: datosFormulario.diagnostico,
                esService: datosFormulario.esService,
                esUrgencia: datosFormulario.esUrgencia,
                fichaIngreso: fichasNuevas.find(ficha => ficha.tipo === "INGRESO")
            });
            setOrdenes(anteriores => [...anteriores, nuevaOrden]);
            setMensajeExito(`La orden ${numeroOrden(nuevaOrden.id)} se creó correctamente.`);
        }
        cerrarFormulario();
    }

    // El vehículo registrado desde la orden se suma a la lista para poder elegirlo enseguida.
    async function handleCrearVehiculo(datosVehiculo) {
        const vehiculoCreado = await crearVehiculo(datosVehiculo);
        setVehiculos(anteriores => [...anteriores, vehiculoCreado]);
        return vehiculoCreado;
    }

    function mostrarOrdenActualizada(ordenActualizada) {
        setOrdenes(anteriores => anteriores.map(orden => orden.id === ordenActualizada.id ? ordenActualizada : orden));
        setOrdenSeleccionado(ordenActualizada);
    }

    // Enviar o aprobar un presupuesto puede mover la orden de estado: se vuelve a pedir para mostrarla al día.
    async function handlePresupuestoActualizado(idOrden) {
        const ordenActualizada = await obtenerOrden(idOrden);
        setOrdenes(anteriores => anteriores.map(orden => orden.id === ordenActualizada.id ? ordenActualizada : orden));
        setOrdenEnEdicion(ordenActualizada);
        return ordenActualizada;
    }

    async function handleAgregarTrabajo(idOrden, trabajo) {
        const ordenActualizada = await agregarTrabajo(idOrden, trabajo);
        mostrarOrdenActualizada(ordenActualizada);
    }

    async function handleQuitarTrabajo(idOrden, idTrabajo) {
        const ordenActualizada = await quitarTrabajo(idOrden, idTrabajo);
        mostrarOrdenActualizada(ordenActualizada);
    }

    return (
        <>
            {modalAbierto && (
                <Modal
                    titulo={ordenEnEdicion ? `Orden #${ordenEnEdicion.id} · ${ordenEnEdicion.vehiculoPatente}` : "Nueva orden"}
                    onCerrar={cerrarFormulario}
                    cerrarAlTocarFondo={false}
                >
                    {ordenEnEdicion ? (
                        <EditarOrden
                            orden={ordenEnEdicion}
                            vehiculos={vehiculos}
                            clientes={datos.clientes}
                            onGuardar={handleGuardarOrden}
                            onCerrar={cerrarFormulario}
                            onPresupuestoActualizado={handlePresupuestoActualizado}
                        />
                    ) : (
                        <OrdenForm
                            vehiculos={vehiculos}
                            clientes={datos.clientes}
                            onGuardar={handleGuardarOrden}
                            onCrearVehiculo={handleCrearVehiculo}
                            onCerrar={cerrarFormulario}
                        />
                    )}
                </Modal>
            )}
            {modalMasInfoAbierto && (
                <Modal
                    titulo="Más información"
                    onCerrar={() => setModalMasInfoAbierto(false)}
                >
                    <MasInfo
                        orden={ordenSeleccionado}
                        vehiculos={vehiculos}
                        tiposTrabajo={datos.tiposTrabajo}
                        repuestos={datos.repuestos}
                        empleados={datos.empleados}
                        onAgregarTrabajo={handleAgregarTrabajo}
                        onQuitarTrabajo={handleQuitarTrabajo}
                        onCerrar={() => setModalMasInfoAbierto(false)}
                    />
                </Modal>
            )}

            <div className="contenedor">
                <div className="page-header">
                
                        <div className="page-header-image">
                
                          <img src={img_list} alt="Listado" />
                        </div>
                        <div className="page-header-title">
                        <h1>Órdenes</h1>
                        <p>Listado de órdenes registradas en el sistema.</p>
                    </div>

                    <BotonNuevo onClick={() => abrirFormulario()} componente={"orden"} esFemenino />
                </div>
                <Table
                    inputPlaceholder="Buscar por patente, número de orden o cliente..."
                    columnas={columnasOrdenes}
                    datos={ordenes.filter(orden => coincideBusqueda(orden, busqueda.trim().toLowerCase()))}
                    valorBusqueda={busqueda}
                    alCambiarBusqueda={setBusqueda}
                    mensajeVacio={busqueda ? "No hay órdenes que coincidan con la búsqueda." : "Todavía no hay órdenes cargadas."}
                    renderFila={(orden) => (
                        <tr key={orden.id} className="orden-row">
                            
                            <td className="orden-numero" data-label="N°">
                                {numeroOrden(orden.id)}
                            </td>

                            <td className="orden-vehiculo" data-label="Vehículo">
                                <strong>{orden.vehiculoPatente}</strong>
                                <div>
                                    {describirVehiculo(vehiculos, orden.vehiculoPatente)}
                                </div>
                            </td>

                            <td className="orden-cliente" data-label="Cliente">
                                {orden.clienteNombre ?? "-"}
                                {orden.clienteDocumento && <div>{orden.clienteDocumento}</div>}
                            </td>

                            <td className="orden-ingreso" data-label="Ingreso">
                                {formatearFecha(fechaIngreso(orden))}
                            </td>

                            <td className="orden-estado" data-label="Estado">
                                <EtiquetaEstado estado={orden.estado} />
                            </td>

                            <td className="orden-service" data-label="Service">
                                {orden.esService ? "Sí" : "No"}
                            </td>

                            <td className="orden-urgencia" data-label="Urgencia">
                                {orden.esUrgencia ? "Sí" : "No"}
                            </td>

                            <td className="orden-acciones" data-label="Acciones">
                                <div className="acciones-container">

                                    <button
                                        type="button"
                                        className="accion-button accion-info"
                                        title="Más información"
                                        aria-label={`Más información de la orden ${numeroOrden(orden.id)}`}
                                        onClick={() => {
                                            setOrdenSeleccionado(orden);
                                            setModalMasInfoAbierto(true)
                                        }
                                        }
                                    >
                                        <span aria-hidden="true">ⓘ</span>
                                    </button>

                                    {!esEstadoFinal(orden.estado) && (
                                        <BotonEditar
                                            onClick={() => abrirFormulario(orden)}
                                            etiqueta={`Editar orden ${numeroOrden(orden.id)}`}
                                        />
                                    )}

                                </div>
                            </td>
                        </tr>
                    )}
                />
            </div>

            <ModalNotificacion
                tipo="exito"
                mensaje={mensajeExito}
                onCerrar={() => setMensajeExito("")}
            />
            <ModalNotificacion
                tipo="error"
                mensaje={mensajeError}
                onCerrar={() => setMensajeError("")}
            />
            {confirmacion && (
                <ModalNotificacion
                    tipo="confirmacion"
                    {...confirmacion}
                    onCerrar={() => setConfirmacion(null)}
                />
            )}
        </>

    );

}

export default OrdenesPage;