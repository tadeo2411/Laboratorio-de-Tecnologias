import { useEffect, useRef, useState } from "react";
import BotonNuevo from "../../../shared/components/BotonNuevo.jsx";
import BotonEditar from "../../../shared/components/BotonEditar.jsx";
import BotonEliminar from "../../../shared/components/BotonEliminar.jsx";
import ModalNotificacion from "../../../shared/components/ModalNotification.jsx";
import {
    actualizarPresupuesto,
    crearPresupuesto,
    eliminarPresupuesto,
    obtenerPresupuestosPorOrden,
} from "../services/presupuestosService";
import { ESTADOS_PRESUPUESTO } from "../utils/presupuestosVista";
import PresupuestoCard from "./PresupuestoCard.jsx";
import PresupuestoForm from "./PresupuestoForm.jsx";
import PresupuestoAltaForm from "./PresupuestoAltaForm.jsx";

const ESTADOS_FINALES = ["APROBADO", "CANCELADO", "VENCIDO"];

// ABM de los presupuestos de una orden (pestaña "Presupuestos" del modal de la orden).
// El formulario reemplaza a la lista en la misma pestaña para no abrir un modal sobre otro.
// El alta se arma eligiendo trabajos (PresupuestoAltaForm); la edición de uno
// existente sigue con los renglones a mano (PresupuestoForm).
function PresupuestosOrdenABM({ ordenId, estadoOrden, onPresupuestoActualizado }) {
    const [presupuestos, setPresupuestos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [formularioAbierto, setFormularioAbierto] = useState(false);
    const [presupuestoEnEdicion, setPresupuestoEnEdicion] = useState(null);
    const refMensaje = useRef(null);
    const [presupuestoAEliminar, setPresupuestoAEliminar] = useState(null);

    // Al volver a la lista, el aviso puede quedar fuera de la vista del modal.
    useEffect(() => {
        if (mensaje) refMensaje.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, [mensaje]);

    useEffect(() => {
        let activo = true;

        async function cargarPresupuestos() {
            try {
                const encontrados = await obtenerPresupuestosPorOrden(ordenId);
                if (activo) setPresupuestos(encontrados);
            } catch (errorCarga) {
                if (activo) setError(errorCarga.message);
            } finally {
                if (activo) setCargando(false);
            }
        }
        cargarPresupuestos();

        return () => {
            activo = false;
        };
    }, [ordenId]);

    // Después de cada cambio se vuelve a pedir la lista: el servicio es quien
    // calcula precios, orden y vencimientos, igual que lo haría la API.
    async function recargarPresupuestos() {
        setPresupuestos(await obtenerPresupuestosPorOrden(ordenId));
    }

    function mostrarMensaje(texto) {
        setError("");
        setMensaje(texto);
    }

    // presupuesto = null abre el formulario para crear uno nuevo.
    function abrirFormulario(presupuesto = null) {
        setMensaje("");
        setError("");
        setPresupuestoEnEdicion(presupuesto);
        setFormularioAbierto(true);
    }

    function cerrarFormulario() {
        setFormularioAbierto(false);
        setPresupuestoEnEdicion(null);
    }

    // Estas dos funciones no capturan errores: si el servicio rechaza los datos,
    // el formulario muestra el motivo y queda abierto para corregirlos.
    async function handleCrear(datosDelAlta) {
        const nuevo = await crearPresupuesto({ ...datosDelAlta, ordenId });
        await recargarPresupuestos();
        mostrarMensaje(`Presupuesto ${nuevo.numero} creado como borrador. Editalo para enviarlo al cliente.`);
        cerrarFormulario();
    }

    async function handleGuardarEdicion(datosEditados) {
        const actualizado = await actualizarPresupuesto(presupuestoEnEdicion.id, datosEditados);
        await recargarPresupuestos();
        const ordenActualizada = await onPresupuestoActualizado?.(ordenId);
        const ordenAvanzo = ordenActualizada && ordenActualizada.estado !== estadoOrden;
        mostrarMensaje(
            `Presupuesto ${actualizado.numero} actualizado: ${ESTADOS_PRESUPUESTO[actualizado.estadoPresupuesto]?.texto ?? actualizado.estadoPresupuesto}.`
            + (ordenAvanzo ? " La orden pasó a esperando aprobación del presupuesto." : "")
        );
        cerrarFormulario();
    }

    async function handleEliminar(presupuesto) {
        setPresupuestoAEliminar(null);
        try {
            await eliminarPresupuesto(presupuesto.id);
            await recargarPresupuestos();
            mostrarMensaje(`Presupuesto ${presupuesto.numero} eliminado.`);
        } catch (errorEliminado) {
            setMensaje("");
            setError(errorEliminado.message);
        }
    }

    // Aprobado, cancelado y vencido son finales: para cambiar algo se crea otro presupuesto.
    // Solo un borrador se elimina; uno enviado se cancela.
    function renderAcciones(presupuesto) {
        const estado = presupuesto.estadoPresupuesto;

        if (ESTADOS_FINALES.includes(estado)) {
            return (
                <span className="presupuesto-solo-lectura">
                    Un presupuesto {estado.toLowerCase()} no se puede modificar
                    {estado === "APROBADO" ? ": si hace falta un cambio, creá uno nuevo." : "."}
                </span>
            );
        }

        return (
            <>
                <BotonEditar
                    onClick={() => abrirFormulario(presupuesto)}
                    etiqueta={`Editar presupuesto ${presupuesto.numero}`}
                />
                {estado === "BORRADOR" && (
                    <BotonEliminar
                        onClick={() => setPresupuestoAEliminar(presupuesto)}
                        aria-label={`Eliminar presupuesto ${presupuesto.numero}`}
                        title={`Eliminar presupuesto ${presupuesto.numero}`}
                    />
                )}
            </>
        );
    }

    if (formularioAbierto && presupuestoEnEdicion) {
        return (
            <PresupuestoForm
                presupuesto={presupuestoEnEdicion}
                onCancelar={cerrarFormulario}
                onGuardar={handleGuardarEdicion}
            />
        );
    }

    if (formularioAbierto) {
        return (
            <PresupuestoAltaForm
                ordenId={ordenId}
                onCancelar={cerrarFormulario}
                onCrear={handleCrear}
            />
        );
    }

    return (
        <div className="info-orden-seccion">
            <div className="info-orden-seccion-header presupuestos-abm-header">
                <h3 className="info-orden-titulo">
                    Presupuestos <span className="info-orden-contador">{presupuestos.length}</span>
                </h3>
                <BotonNuevo onClick={() => abrirFormulario()} componente="presupuesto" />
            </div>

            {mensaje && <p ref={refMensaje} className="alert alert-success" role="status">{mensaje}</p>}
            {error && <p className="alert alert-danger" role="alert">{error}</p>}

            {cargando ? (
                <div className="info-orden-vacio">Cargando presupuestos...</div>
            ) : error && presupuestos.length === 0 ? null : presupuestos.length === 0 ? (
                <div className="info-orden-vacio">
                    No hay presupuestos generados para esta orden.
                </div>
            ) : (
                <div className="info-orden-lista">
                    {presupuestos.map((presupuesto) => (
                        <PresupuestoCard
                            key={presupuesto.id}
                            presupuesto={presupuesto}
                            acciones={renderAcciones(presupuesto)}
                        />
                    ))}
                </div>
            )}

            {presupuestoAEliminar && (
                <ModalNotificacion
                    tipo="confirmacion"
                    titulo="Eliminar presupuesto"
                    mensaje={`¿Seguro que querés eliminar el presupuesto ${presupuestoAEliminar.numero}?`}
                    textoAceptar="Sí, eliminar"
                    textoCancelar="Volver"
                    onAceptar={() => handleEliminar(presupuestoAEliminar)}
                    onCerrar={() => setPresupuestoAEliminar(null)}
                />
            )}
        </div>
    );
}

export default PresupuestosOrdenABM;
