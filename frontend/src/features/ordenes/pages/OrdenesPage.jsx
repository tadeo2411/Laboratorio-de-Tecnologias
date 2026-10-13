import { useState } from 'react';
import { useLoaderData } from 'react-router';
import EtiquetaEstado from "../components/EtiquetaEstado.jsx";
import Table from '../../../shared/components/Table.jsx';
import BotonNuevo from '../../../shared/components/BotonNuevo.jsx';
import BotonEditar from '../../../shared/components/BotonEditar.jsx';
import Modal from '../../../shared/components/Modal.jsx';
import MasInfo from "../components/MasInfo.jsx"
import OrdenForm from "../components/OrdenForm.jsx";
import EditarOrden from "../components/EditarOrden.jsx";
import img_list from "../../../assets/icons/img_list.png"
import { numeroOrden, formatearFecha, fechaIngreso, describirVehiculo } from "../utils/ordenes";
import { crearOrden, actualizarOrden, agregarFicha, agregarTrabajo, quitarTrabajo } from "../services/ordenesService";
import { esEstadoFinal } from "../utils/estados";
import { crearVehiculo } from "../../vehiculos";
import "../ordenes.css"

const columnasOrdenes = [
    { key: "numero", nombre: "N°" },
    { key: "vehiculo", nombre: "Vehículo" },
    { key: "ingreso", nombre: "Ingreso" },
    { key: "estado", nombre: "Estado" },
    { key: "esService", nombre: "Service" },
    { key: "esUrgencia", nombre: "Urgencia" },
    { key: "acciones", nombre: "Acciones" },
];

function OrdenesPage() {
    const datos = useLoaderData();
    const [ordenes, setOrdenes] = useState(datos.ordenes);
    const [vehiculos, setVehiculos] = useState(datos.vehiculos);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modalMasInfoAbierto, setModalMasInfoAbierto] = useState(false);
    const [ordenSeleccionado, setOrdenSeleccionado] = useState(null);
    const [ordenEnEdicion, setOrdenEnEdicion] = useState(null);

    function abrirFormulario(orden = null) {
        setOrdenEnEdicion(orden);
        setModalAbierto(true);
    }

    function cerrarFormulario() {
        setModalAbierto(false);
        setOrdenEnEdicion(null);
    }

    async function handleGuardarOrden(datosFormulario, fichasNuevas = []) {
        if (ordenEnEdicion) {
            const seCancela = datosFormulario.estado === "CANCELADO" && ordenEnEdicion.estado !== "CANCELADO";
            if (seCancela && !window.confirm('¿Seguro que querés cancelar la orden? Después no se va a poder modificar.')) return;

            for (const ficha of fichasNuevas) {
                await agregarFicha(ordenEnEdicion.id, ficha);
            }
            const ordenActualizada = await actualizarOrden(ordenEnEdicion.id, datosFormulario);
            setOrdenes(anteriores => anteriores.map(orden => orden.id === ordenActualizada.id ? ordenActualizada : orden));
        } else {
            const nuevaOrden = await crearOrden(datosFormulario);
            setOrdenes(anteriores => [...anteriores, nuevaOrden]);
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
                    titulo={ordenEnEdicion ? "Editar orden" : "Nueva orden"}
                    onCerrar={cerrarFormulario}
                >
                    {ordenEnEdicion ? (
                        <EditarOrden
                            orden={ordenEnEdicion}
                            vehiculos={vehiculos}
                            onGuardar={handleGuardarOrden}
                            onCerrar={cerrarFormulario}
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
                <div className="ordenes-page">
                    <div className="img-container">
                        <img src={img_list} />
                    </div>

                    <div className="title-container">
                        <h1>Ordenes</h1>
                        <p>Listado de ordenes registradas en el sistema.</p>
                    </div>

                    <BotonNuevo onClick={() => abrirFormulario()} componente={"orden"} />
                </div>
                <Table
                    inputPlaceholder="Buscar por patente o numero de orden..."
                    columnas={columnasOrdenes}
                    datos={ordenes}
                    mensajeVacio="Todavía no hay ordenes cargadas."
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
                                        className="accion-button accion-info"
                                        title="Más información"
                                        onClick={() => {
                                            setOrdenSeleccionado(orden);
                                            setModalMasInfoAbierto(true)
                                        }
                                        }
                                    >
                                        ⓘ
                                    </button>

                                    {!esEstadoFinal(orden.estado) && (
                                        <BotonEditar onClick={() => abrirFormulario(orden)} />
                                    )}

                                </div>
                            </td>
                        </tr>
                    )}
                />
            </div>
        </>

    );

}

export default OrdenesPage;