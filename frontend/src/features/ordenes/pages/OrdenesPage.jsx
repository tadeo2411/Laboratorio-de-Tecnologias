import { useState, useEffect } from 'react';
import { obtenerOrdenes } from "../services/ordenesService";
import Table from '../../../shared/components/Table.jsx';
import BotonNuevo from '../../../shared/components/BotonNuevo.jsx';
import Modal from '../../../shared/components/Modal.jsx';
import MasInfo from "../components/MasInfo.jsx"
import OrdenForm from "../components/OrdenForm.jsx";
import img_list from "../../../assets/icons/img_list.png"
import "../ordenes.css"

const columnasOrdenes = [
    { key: "diagnostico", nombre: "Diagnóstico" },
    { key: "estado", nombre: "Estado" },
    { key: "garantia", nombre: "Garantía" },
    { key: "esService", nombre: "Service" },
    { key: "esUrgencia", nombre: "Urgencia" },
    { key: "acciones", nombre: "Acciones" },
];

function OrdenesPage() {
    const [ordenes, setOrdenes] = useState([]);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modalMasInfoAbierto, setModalMasInfoAbierto] = useState(false);
    const [ordenSeleccionado, setOrdenSeleccionado] = useState(null);

    useEffect(() => {
        async function pedirOrdenes() {
            const ordenes = await obtenerOrdenes();
            setOrdenes(ordenes);
        }
        pedirOrdenes();
    }, []);

    return (
        <>
            {modalAbierto && (
                <Modal
                    titulo="Nueva orden"
                    onCerrar={() => setModalAbierto(false)}
                >
                    <OrdenForm onCerrar={() => setModalAbierto(false)} />
                </Modal>
            )}
            {modalMasInfoAbierto && (
                <Modal
                    titulo="Más información"
                    onCerrar={() => setModalMasInfoAbierto(false)}
                >
                    <MasInfo orden={ordenSeleccionado} onCerrar={() => setModalMasInfoAbierto(false)} />
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

                    <BotonNuevo onClick={() => setModalAbierto(true)} componente={"orden"} />
                </div>
                <Table
                    inputPlaceholder="Buscar por descripción, orden, trabajo..."
                    columnas={columnasOrdenes}
                    datos={ordenes}
                    mensajeVacio="Todavía no hay ordenes cargadas."
                    renderFila={(orden) => (
                        <tr key={orden.id} className="orden-row">
                            {/* Diagnóstico */}
                            <td className="orden-diagnostico" data-label="Diagnóstico">
                                {orden.diagnostico}
                            </td>

                            {/* Estado */}
                            <td className="orden-estado" data-label="Estado">
                            
                            <span
                                className={`estado-badge ${
                                orden.estado === "RECIBIDO"
                                    ? "estado-recibido"
                                    : orden.estado === "DIAGNOSTICANDO"
                                    ? "estado-diagnosticando"
                                    : orden.estado === "ESPERANDO_APROBACION"
                                    ? "estado-aprobacion"
                                    : orden.estado === "ESPERANDO_REPUESTO"
                                    ? "estado-repuesto"
                                    : orden.estado === "EN_REPARACION"
                                    ? "estado-reparacion"
                                    : orden.estado === "TERMINADO"
                                    ? "estado-terminado"
                                    : orden.estado === "ENTREGADO"
                                    ? "estado-entregado"
                                    : orden.estado === "CANCELADO"
                                    ? "estado-cancelado"
                                    : "estado-pendiente"
                                }`}
                            >
                                
                                {orden.estado === "ESPERANDO_APROBACION"
                                ? "Esperando aprobación"
                                : orden.estado === "ESPERANDO_REPUESTO"
                                ? "Esperando repuesto"
                                : orden.estado === "EN_REPARACION"
                                ? "En reparación"
                                : orden.estado.charAt(0) + orden.estado.slice(1).toLowerCase()}
                            </span>
                            </td>


                            <td className="orden-garantia" data-label="Garantía">
                                {orden.garantia ? "Sí" : "No"}
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

                                    <button
                                        className="accion-button accion-modificar"
                                        title="Modificar"
                                    >
                                        ✎
                                    </button>

                                    <button
                                        className="accion-button accion-eliminar"
                                        title="Eliminar"
                                    >
                                        🗑
                                    </button>

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