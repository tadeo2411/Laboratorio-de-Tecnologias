import "../trabajosPage.css"
import "../../estilos.css"
import img_list from "../../../assets/icons/trabajosIcono.svg"
import BotonNuevo from "../../../shared/components/BotonNuevo";
import Table from "../../../shared/components/Table";
import Modal from "../../../shared/components/Modal";
import { useEffect, useState } from "react";
import TrabajosForm from "../components/TrabajosForm";
import BotonEditar from "../../../shared/components/BotonEditar";
import BotonEliminar from "../../../shared/components/BotonEliminar";
import {
    obtenerTiposTrabajo,
    crearTipoTrabajo,
    modificarTipoTrabajo,
    eliminarTipoTrabajo
} from "../services/trabajos";
import ModalNotificacion from "../../../shared/components/ModalNotification";

const columnasTrabajos = [
    { key: "id", nombre: "Código" },
    { key: "nombre", nombre: "Trabajo" },
    { key: "categoria", nombre: "Categoría" },
    { key: "precio_estandar", nombre: "Precio estándar" },
    { key: "activo", nombre: "Estado" },
    { key: "acciones", nombre: "Acciones" },
];

const nombresCategoria = {
    MANTENIMIENTO: "Mantenimiento",
    REPARACION: "Reparación",
    DIAGNOSTICO: "Diagnóstico"
};

function TrabajosPage() {
    const [trabajos, setTrabajos] = useState([]);
    const [trabajoEnEdicion, setTrabajoEnEdicion] = useState(null);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [busqueda, setBusqueda] = useState("");

    const [notificacion, setNotificacion] = useState(null);

    useEffect(() => {
        const cargarTrabajos = async () => {
            try {
                setTrabajos(await obtenerTiposTrabajo());
            } catch (error) {
                setNotificacion({
                    tipo: "error",
                    mensaje: error.message || "No se pudieron cargar los trabajos."
                });
            }
        }
        cargarTrabajos();

    }, []);

    function abrirFormulario(trabajo = null) {
        setTrabajoEnEdicion(trabajo);
        setModalAbierto(true);
    }

    function cerrarFormulario() {
        setModalAbierto(false);
        setTrabajoEnEdicion(null);
    }

    // No captura errores: el formulario muestra el motivo y queda abierto para corregir.
    async function guardarTrabajo(datos) {
        if (trabajoEnEdicion) {
            const modificado = await modificarTipoTrabajo(trabajoEnEdicion.id, datos);
            setTrabajos((anteriores) =>
                anteriores.map((trabajo) => trabajo.id === modificado.id ? modificado : trabajo)
            );
            setNotificacion({ tipo: "exito", mensaje: "Trabajo actualizado correctamente." });
        } else {
            const creado = await crearTipoTrabajo(datos);
            setTrabajos((anteriores) => [...anteriores, creado]);
            setNotificacion({ tipo: "exito", mensaje: "Trabajo agregado correctamente." });
        }

        cerrarFormulario();
    }

    function confirmarEliminacion(trabajo) {
        setNotificacion({
            tipo: "confirmacion",
            titulo: "Eliminar trabajo",
            mensaje: `¿Estás seguro de que deseas eliminar el trabajo #${trabajo.id} · ${trabajo.nombre}? Esta acción no se puede deshacer.`,
            onAceptar: async () => {
                setNotificacion(null);

                try {
                    await eliminarTipoTrabajo(trabajo.id);

                    setTrabajos((anteriores) =>
                        anteriores.filter((actual) => actual.id !== trabajo.id)
                    );

                    setNotificacion({
                        tipo: "exito",
                        mensaje: "Trabajo eliminado correctamente."
                    });

                } catch (error) {
                    setNotificacion({
                        tipo: "error",
                        mensaje: error.message || "No se pudo eliminar el trabajo."
                    });
                }
            }
        });
    }

    const texto = busqueda.trim().toLowerCase();
    const trabajosFiltrados = trabajos.filter((trabajo) =>
        !texto
        || String(trabajo.id).includes(texto)
        || trabajo.nombre.toLowerCase().includes(texto)
        || (nombresCategoria[trabajo.categoria] ?? "").toLowerCase().includes(texto)
    );

    return (
        <div className="contenedor">
            {modalAbierto && (
                <Modal
                    titulo={trabajoEnEdicion ? "Editar trabajo" : "Nuevo trabajo"}
                    onCerrar={cerrarFormulario}
                >
                    <TrabajosForm
                        tipo={trabajoEnEdicion}
                        onCancelar={cerrarFormulario}
                        onGuardar={guardarTrabajo}
                    />
                </Modal>
            )}
            <div className="page-header">

                <div className="page-header-image">

                    <img src={img_list} alt="Listado" />
                </div>
                <div className="page-header-title">
                    <h1>Trabajos</h1>
                    <p>Catálogo de trabajos que ofrece el taller.</p>
                </div>

                <BotonNuevo onClick={() => abrirFormulario()} componente={"trabajo"} />
            </div>

            <div>
                <Table
                    inputPlaceholder="Buscar por código, trabajo, categoría..."
                    columnas={columnasTrabajos}
                    datos={trabajosFiltrados}
                    valorBusqueda={busqueda}
                    alCambiarBusqueda={setBusqueda}
                    mensajeVacio="No hay trabajos para mostrar."
                    renderFila={(trabajo) => (
                        <tr key={trabajo.id} className="trabajo-row">

                            <td className="trabajo-orden" data-label="Código">
                                {trabajo.id}
                            </td>

                            <td className="trabajo-descripcion" data-label="Trabajo">
                                <div className="descripcion-principal">
                                    {trabajo.nombre}
                                </div>
                            </td>

                            <td className="trabajo-descripcion" data-label="Categoría">
                                {nombresCategoria[trabajo.categoria] ?? trabajo.categoria}
                            </td>

                            <td className="trabajo-total" data-label="Precio estándar">
                                ${Number(trabajo.precio_estandar).toLocaleString("es-AR")}
                            </td>

                            <td className="trabajo-estado" data-label="Estado">
                                <span className={`estado-badge ${trabajo.activo ? "estado-terminado" : "estado-pendiente"}`}>
                                    {trabajo.activo ? "Activo" : "Inactivo"}
                                </span>
                            </td>

                            <td className="trabajo-acciones" data-label="Acciones">
                                <div className="acciones-container">

                                    <BotonEditar onClick={() => abrirFormulario(trabajo)} />

                                    <BotonEliminar onClick={() => confirmarEliminacion(trabajo)} />

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
