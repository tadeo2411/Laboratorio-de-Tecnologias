import "../trabajosPage.css"
import "../../estilos.css"
import img_list from "../../../assets/icons/trabajosIcono.svg"
import BotonNuevo from "../../../shared/components/BotonNuevo";
import Table from "../../../shared/components/Table";
import Modal from "../../../shared/components/Modal";
import { useEffect, useState } from "react";
import TrabajosForm from "../components/TrabajosForm";
import MasInfo from "../components/MasInfo"
import BotonEditar from "../../../shared/components/BotonEditar";
import BotonEliminar from "../../../shared/components/BotonEliminar";
import service from "../services/trabajos";
import ModalNotificacion from "../../../shared/components/ModalNotification";

const columnasTrabajos = [
    { key: "ordenTrabajo", nombre: "Orden" },
    { key: "descripcion", nombre: "Descripción" },
    { key: "empleado", nombre: "Empleado" },
    { key: "estado", nombre: "Estado" },
    { key: "total", nombre: "Total" },
    { key: "acciones", nombre: "Acciones" },
];

function TrabajosPage() {
    const [trabajos, setTrabajos] = useState([]);
    const [trabajoEnEdicion, setTrabajoEnEdicion] = useState(null);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modalMasInfoAbierto, setModalMasInfoAbierto] = useState(false);
    const [trabajoSeleccionado, setTrabajoSeleccionado] = useState(null);

    const [notificacion, setNotificacion] = useState(null);

    useEffect(() => {
        const obtenerTrabajos = async () => {
            try {
                setTrabajos(await service.obtenerTrabajos());
            } catch (error) {
                setNotificacion({
                    tipo: "error",
                    mensaje: error.message || "No se pudieron cargar los trabajos."
                });
            }
        }
        obtenerTrabajos();

    }, []);

    function abrirFormulario(trabajo = null) {
        setTrabajoEnEdicion(trabajo);
        setModalAbierto(true);
    }

    function cerrarFormulario() {
        setModalAbierto(false);
        setTrabajoEnEdicion(null);
    }

    async function handleEliminarTrabajo(idTrabajo) {
        setNotificacion({
            tipo: "confirmacion",
            titulo: "Eliminar trabajo",
            mensaje: `¿Estás seguro de que deseas eliminar el trabajo? Esta acción no se puede deshacer.`,
            onAceptar: async () => {
                setNotificacion(null);

                try {
                    await service.eliminarTrabajo(idTrabajo);

                    setTrabajos((anteriores) =>
                        anteriores.filter((trabajo) => trabajo.id !== idTrabajo)
                    );

                } catch (error) {
                    setNotificacion({
                        tipo: "error",
                        mensaje: error.message || "No se pudo eliminar el trabajo."
                    });
                }
            }
        });


    }

    return (
        <div className="contenedor">
            {modalAbierto && (
                <Modal
                    titulo={trabajoEnEdicion ? "Editar trabajo" : "Nuevo trabajo"}
                    onCerrar={cerrarFormulario}
                >
                    <TrabajosForm
                        trabajo={trabajoEnEdicion}
                        onCerrar={cerrarFormulario}
                        onGuardar={(trabajoActualizado) => {
                            if (trabajoEnEdicion) {
                                setTrabajos((anteriores) =>
                                    anteriores.map((t) =>
                                        t.id === trabajoActualizado.id
                                            ? trabajoActualizado
                                            : t
                                    )
                                );
                            } else {
                                setTrabajos((anteriores) => [
                                    trabajoActualizado,
                                    ...anteriores
                                ]);
                            }
                        }}
                    />
                </Modal>
            )}
            {modalMasInfoAbierto && (
                <Modal
                    titulo="Más información"
                    onCerrar={() => setModalMasInfoAbierto(false)}
                >
                    <MasInfo trabajo={trabajoSeleccionado} onCerrar={() => setModalMasInfoAbierto(false)} />
                </Modal>
            )}
            <div className="page-header">

                <div className="page-header-image">

                    <img src={img_list} alt="Listado" />
                </div>
                <div className="page-header-title">
                    <h1>Trabajos</h1>
                    <p>Listado de trabajos registrados en el sistema.</p>
                </div>

                <BotonNuevo onClick={() => abrirFormulario()} componente={"trabajo"} />
            </div>

            <div>
                <Table
                    inputPlaceholder="Buscar por descripción, orden, trabajo..."
                    columnas={columnasTrabajos}
                    datos={trabajos}
                    mensajeVacio="Todavía no hay trabajos cargados."
                    renderFila={(trabajo) => (
                        <tr key={trabajo.id} className="trabajo-row">

                            {/* Orden */}
                            <td className="trabajo-orden" data-label="Orden">
                                #{trabajo.orden_id}
                            </td>

                            {/* Descripción */}
                            <td className="trabajo-descripcion" data-label="Descripción">
                                <div>
                                    <div className="descripcion-principal">
                                        {trabajo.descripcion}
                                    </div>

                                    <div className="descripcion-tipo">
                                        Tipo de trabajo: {trabajo.tipo_trabajo}
                                    </div>
                                </div>
                            </td>

                            <td className="trabajo-empleado" data-label="Empleados">
                                <div className="empleados-lista">
                                    {trabajo.empleados?.length > 0
                                        ? trabajo.empleados.map((empleado) => (
                                            <span key={empleado.empleado_id} className="empleado-badge">
                                                {empleado.nombre}
                                            </span>
                                        ))
                                        : "-"}
                                </div>
                            </td>

                            {/* Estado */}
                            <td className="trabajo-estado" data-label="Estado">
                                <span className={`estado-badge estado-${trabajo.estado?.toLowerCase() || "pendiente"}`}>
                                    {trabajo.estado || "Pendiente"}
                                </span>
                            </td>

                            {/* Total */}
                            <td className="trabajo-total" data-label="Total">
                                ${Number(trabajo.total).toLocaleString("es-AR")}
                            </td>

                            {/* Acciones */}
                            <td className="trabajo-acciones" data-label="Acciones">
                                <div className="acciones-container">

                                    <button
                                        className="accion-button accion-info"
                                        title="Más información"
                                        onClick={() => {
                                            setTrabajoSeleccionado(trabajo);
                                            setModalMasInfoAbierto(true);
                                        }}
                                    >
                                        ⓘ
                                    </button>

                                    <BotonEditar onClick={() => abrirFormulario(trabajo)} />

                                    <BotonEliminar onClick={() => handleEliminarTrabajo(trabajo.id)} />

                                </div>
                            </td>

                        </tr>
                    )}
                />
            </div>
            {notificacion && (
                <ModalNotificacion
                    {...notificacion}
                    onCerrar={() => setNotificacion(null)}
                />
            )}
        </div>
    );
}

export default TrabajosPage;