import { useState, useEffect } from 'react';
import { obtenerOrdenes } from "../services/ordenesService";
import Table from '../../../shared/components/Table.jsx';
import BotonNuevo from '../../../shared/components/BotonNuevo.jsx';
import BotonEditar from '../../../shared/components/BotonEditar.jsx';
import BotonEliminar from '../../../shared/components/BotonEliminar.jsx';
import Modal from '../../../shared/components/Modal.jsx';
import MasInfo from "../components/MasInfo.jsx"
import OrdenForm from "../components/OrdenForm.jsx";
import img_list from "../../../assets/icons/img_presupuesto.png"
import "../ordenes.css"
import "../../estilos.css"

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
    const [ordenEnEdicion, setOrdenEnEdicion] = useState(null);

    useEffect(() => {
        async function pedirOrdenes() {
            const ordenes = await obtenerOrdenes();
            setOrdenes(ordenes);
        }
        pedirOrdenes();
    }, []);

    function abrirFormulario(orden = null) {
        setOrdenEnEdicion(orden);
        setModalAbierto(true);
    }

    function cerrarFormulario() {
        setModalAbierto(false);
        setOrdenEnEdicion(null);
    }

    function handleEliminarOrden(idOrden) {
        if (!window.confirm('¿Desea eliminar la orden?')) return;
        setOrdenes(anteriores => anteriores.filter(orden => orden.id !== idOrden));
    }

    return (
        <>
            {modalAbierto && (
                <Modal
                    titulo={ordenEnEdicion ? "Editar orden" : "Nueva orden"}
                    onCerrar={cerrarFormulario}
                >
                    <OrdenForm onCerrar={cerrarFormulario} />
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
                <div className="page-header">
                
                        <div className="page-header-image">
                
                          <img src={img_list} alt="Listado" />
                        </div>
                        <div className="page-header-title">
                        <h1>Ordenes</h1>
                        <p>Listado de ordenes registradas en el sistema.</p>
                    </div>

                    <BotonNuevo onClick={() => abrirFormulario()} componente={"orden"} />
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

                                    <BotonEditar onClick={() => abrirFormulario(orden)} />

                                    <BotonEliminar onClick={() => handleEliminarOrden(orden.id)} />

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