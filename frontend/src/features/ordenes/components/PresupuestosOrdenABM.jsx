import { useEffect, useState } from "react";
import BotonNuevo from "../../../shared/components/BotonNuevo.jsx";
import BotonEditar from "../../../shared/components/BotonEditar.jsx";
import BotonEliminar from "../../../shared/components/BotonEliminar.jsx";
import {
    actualizarPresupuesto,
    crearPresupuesto,
    eliminarPresupuesto,
    obtenerPresupuestosPorOrden,
} from "../services/presupuestosService";
import PresupuestoCard from "./PresupuestoCard.jsx";
import PresupuestoForm from "./PresupuestoForm.jsx";

const ESTADOS_FINALES = ["APROBADO", "CANCELADO", "VENCIDO"];

// ABM de los presupuestos de una orden (pestaña "Presupuestos" de Editar orden).
// El formulario reemplaza a la lista en la misma pestaña para no abrir un modal sobre otro.
function PresupuestosOrdenABM({ ordenId }) {
    const [presupuestos, setPresupuestos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [formularioAbierto, setFormularioAbierto] = useState(false);
    const [presupuestoEnEdicion, setPresupuestoEnEdicion] = useState(null);

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

    // No captura errores: si el servicio rechaza los datos, el formulario los muestra.
    async function handleGuardar(datos) {
        if (presupuestoEnEdicion) {
            const actualizado = await actualizarPresupuesto(presupuestoEnEdicion.id, datos);
            await recargarPresupuestos();
            mostrarMensaje(`Presupuesto ${actualizado.numero} actualizado.`);
        } else {
            const nuevo = await crearPresupuesto({ ...datos, ordenId });
            await recargarPresupuestos();
            mostrarMensaje(`Presupuesto ${nuevo.numero} creado como borrador.`);
        }
        cerrarFormulario();
    }

    async function handleEliminar(presupuesto) {
        if (!window.confirm(`¿Desea eliminar el presupuesto ${presupuesto.numero}?`)) return;

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
                <BotonEditar onClick={() => abrirFormulario(presupuesto)} />
                {estado === "BORRADOR" && <BotonEliminar onClick={() => handleEliminar(presupuesto)} />}
            </>
        );
    }

    if (formularioAbierto) {
        return (
            <PresupuestoForm
                presupuesto={presupuestoEnEdicion}
                onCancelar={cerrarFormulario}
                onGuardar={handleGuardar}
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

            {mensaje && <p className="alert alert-success" role="status">{mensaje}</p>}
            {error && <p className="alert alert-danger" role="alert">{error}</p>}

            {cargando ? (
                <div className="info-orden-vacio">Cargando presupuestos...</div>
            ) : presupuestos.length === 0 ? (
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
        </div>
    );
}

export default PresupuestosOrdenABM;
