import "../trabajosPage.css"
import img_list from "../../../assets/icons/img_list.png"
import BotonNuevo from "../../../shared/components/BotonNuevo";
import Table from "../../../shared/components/table/Table";
import Modal from "../../../shared/components/Modal/Modal";
import { useState } from "react";
import TrabajosForm from "../components/TrabajosForm";
import MasInfo from "../components/MasInfo"

const trabajos = [
    {
        id: 1,
        fecha: "06/10/2026",
        ordenTrabajo: 25,
        descripcion: "Cambio de aceite y filtros",
        tipoTrabajo: "Service",
        empleado: "Juan Pérez",
        estado: "Terminado",
        precio: 45000,
        repuestos: 12000,
        total: 57000,
    },
    {
        id: 2,
        fecha: "07/10/2026",
        ordenTrabajo: 26,
        descripcion: "Cambio de pastillas de freno",
        tipoTrabajo: "Reparación",
        empleado: "Carlos Gómez",
        estado: "En reparación",
        precio: 80000,
        repuestos: 35000,
        total: 115000,
    },
];

const columnasTrabajos = [
    { key: "fecha", nombre: "Fecha" },
    { key: "ordenTrabajo", nombre: "Orden" },
    { key: "descripcion", nombre: "Descripción" },
    { key: "empleado", nombre: "Empleado" },
    { key: "estado", nombre: "Estado" },
    { key: "total", nombre: "Total" },
    { key: "acciones", nombre: "Acciones" },
];

function TrabajosPage() {
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modalMasInfoAbierto, setModalMasInfoAbierto] = useState(false);
    const [trabajoSeleccionado, setTrabajoSeleccionado] = useState(null);
    return (
        <div className="contenedor">
            {modalAbierto && (
                <Modal
                    titulo="Nuevo trabajo"
                    onCerrar={() => setModalAbierto(false)}
                >
                    <TrabajosForm onCerrar={() => setModalAbierto(false)} />
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
            <div className="trabajos-page">
                <div className="img-container">
                    <img src={img_list} />
                </div>

                <div className="title-container">
                    <h1>Trabajos</h1>
                    <p>Listado de trabajos registrados en el sistema.</p>
                </div>

                <BotonNuevo onClick={() => setModalAbierto(true)} componente={"trabajo"} />
            </div>

            <div>
                <Table
                    inputPlaceholder="Buscar por descripción, orden, trabajo..."
                    columnas={columnasTrabajos}
                    datos={trabajos}
                    mensajeVacio="Todavía no hay trabajos cargados."
                    renderFila={(trabajo) => (
                        <tr key={trabajo.id} className="trabajo-row">

                            {/* Fecha */}
                            <td className="trabajo-fecha">
                                {trabajo.fecha}
                            </td>

                            {/* Orden */}
                            <td className="trabajo-orden">
                                #{trabajo.ordenTrabajo}
                            </td>

                            {/* Descripción */}
                            <td className="trabajo-descripcion">
                                <div className="descripcion-principal">
                                    {trabajo.descripcion}
                                </div>

                                <div className="descripcion-tipo">
                                    {trabajo.tipoTrabajo}
                                </div>
                            </td>

                            {/* Empleado */}
                            <td className="trabajo-empleado">
                                {trabajo.empleado}
                            </td>

                            {/* Estado */}
                            <td className="trabajo-estado">
                                <span
                                    className={`estado - badge ${trabajo.estado === "Terminado"
                                        ? "estado-terminado"
                                        : trabajo.estado === "En reparación"
                                            ? "estado-reparacion"
                                            : "estado-pendiente"
                                        } `}
                                >
                                    {trabajo.estado}
                                </span>
                            </td>

                            {/* Total */}
                            <td className="trabajo-total">
                                ${trabajo.total.toLocaleString("es-AR")}
                            </td>

                            {/* Acciones */}
                            <td className="trabajo-acciones">
                                <div className="acciones-container">

                                    <button
                                        className="accion-button accion-info"
                                        title="Más información"
                                        onClick={() => {
                                            setTrabajoSeleccionado(trabajo);
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
        </div>
    );
}

export default TrabajosPage;