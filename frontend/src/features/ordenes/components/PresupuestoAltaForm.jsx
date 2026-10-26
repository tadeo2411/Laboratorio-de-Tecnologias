import { useEffect, useState } from "react";
import { obtenerTrabajosPresupuestables } from "../services/presupuestosService";
import { formatearPrecio } from "../utils/presupuestosVista";

const DIAS_VALIDEZ_SUGERIDOS = "15";

function crearDescuentoVacio() {
    // "clave" solo identifica la fila en pantalla; no se guarda.
    return { clave: crypto.randomUUID(), motivo: "", monto: "" };
}

// --- Cálculos de la vista previa ---------------------------------------------
// El precio que vale es el que calcula el servicio al crear; esto es solo para
// que el empleado vea cómo va quedando mientras arma el presupuesto.

function calcularSubtotalDelRepuesto(repuesto) {
    return repuesto.cantidad * repuesto.precioUnitario;
}

function sumarManoDeObra(trabajos) {
    return trabajos.reduce((total, trabajo) => total + trabajo.manoDeObra, 0);
}

function sumarRepuestos(trabajos) {
    return trabajos
        .flatMap((trabajo) => trabajo.repuestos ?? [])
        .reduce((total, repuesto) => total + calcularSubtotalDelRepuesto(repuesto), 0);
}

function sumarDescuentos(descuentos) {
    return descuentos.reduce((total, descuento) => total + (Number(descuento.monto) || 0), 0);
}

// Alta de un presupuesto armado a partir de los trabajos libres de la orden.
// Los renglones (mano de obra, repuestos y descuentos) los arma el servicio.
function PresupuestoAltaForm({ ordenId, onCancelar, onCrear }) {
    const [trabajosLibres, setTrabajosLibres] = useState([]);
    const [trabajosExcluidos, setTrabajosExcluidos] = useState([]);
    const [ordenCerrada, setOrdenCerrada] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [errorDeCarga, setErrorDeCarga] = useState("");

    const [idsDeTrabajosElegidos, setIdsDeTrabajosElegidos] = useState([]);
    const [diasValidez, setDiasValidez] = useState(DIAS_VALIDEZ_SUGERIDOS);
    const [observaciones, setObservaciones] = useState("");
    const [descuentos, setDescuentos] = useState([]);

    const [error, setError] = useState("");
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        let activo = true;

        async function cargarTrabajosPresupuestables() {
            try {
                const resultado = await obtenerTrabajosPresupuestables(ordenId);
                if (!activo) return;

                setOrdenCerrada(resultado.ordenCerrada);
                setTrabajosLibres(resultado.trabajosLibres);
                setTrabajosExcluidos(resultado.trabajosExcluidos);
                // Todos los trabajos libres arrancan tildados.
                setIdsDeTrabajosElegidos(resultado.trabajosLibres.map((trabajo) => trabajo.id));
            } catch (errorCarga) {
                if (activo) setErrorDeCarga(errorCarga.message);
            } finally {
                if (activo) setCargando(false);
            }
        }
        cargarTrabajosPresupuestables();

        return () => {
            activo = false;
        };
    }, [ordenId]);

    // --- Trabajos ---

    function alternarTrabajo(trabajoId) {
        // Si había un error por no elegir trabajos, deja de aplicar al cambiar la selección.
        setError("");
        setIdsDeTrabajosElegidos((idsActuales) =>
            idsActuales.includes(trabajoId)
                ? idsActuales.filter((id) => id !== trabajoId)
                : [...idsActuales, trabajoId],
        );
    }

    // --- Descuentos ---

    function agregarDescuento() {
        setDescuentos((descuentosActuales) => [...descuentosActuales, crearDescuentoVacio()]);
    }

    function quitarDescuento(clave) {
        setDescuentos((descuentosActuales) => descuentosActuales.filter((descuento) => descuento.clave !== clave));
    }

    function actualizarDescuento(clave, event) {
        const { name, value } = event.target;
        setDescuentos((descuentosActuales) =>
            descuentosActuales.map((descuento) =>
                descuento.clave === clave ? { ...descuento, [name]: value } : descuento,
            ),
        );
    }

    // --- Vista previa ---

    const trabajosElegidos = trabajosLibres.filter((trabajo) => idsDeTrabajosElegidos.includes(trabajo.id));
    const totalManoDeObra = sumarManoDeObra(trabajosElegidos);
    const totalRepuestos = sumarRepuestos(trabajosElegidos);
    const totalDescuentos = sumarDescuentos(descuentos);
    const precioFinal = totalManoDeObra + totalRepuestos - totalDescuentos;
    const descuentosSuperanElTotal = precioFinal < 0;

    // --- Envío ---

    async function manejarEnvio(event) {
        event.preventDefault();
        if (descuentosSuperanElTotal) return;

        setError("");
        setGuardando(true);

        try {
            // Las validaciones de negocio (al menos un trabajo, trabajos libres,
            // validez, descuentos) las hace el servicio; acá solo se envían los datos.
            await onCrear({
                trabajoIds: idsDeTrabajosElegidos,
                diasValidez,
                observaciones,
                descuentos: descuentos.map((descuento) => ({ motivo: descuento.motivo, monto: descuento.monto })),
            });
        } catch (errorAlCrear) {
            setError(errorAlCrear.message);
            setGuardando(false);
        }
    }

    // --- Pantalla ---

    const titulo = (
        <div className="info-orden-seccion-header">
            <h3 className="info-orden-titulo">Nuevo presupuesto</h3>
        </div>
    );

    const notasDeTrabajosExcluidos = trabajosExcluidos.map(({ trabajo, numeroPresupuesto }) => (
        <li key={trabajo.id}>
            {trabajo.tipoTrabajo} no aparece: ya está en {numeroPresupuesto}
        </li>
    ));

    if (cargando) {
        return (
            <div className="presupuesto-form">
                {titulo}
                <div className="info-orden-vacio">Cargando trabajos de la orden...</div>
            </div>
        );
    }

    const motivoParaNoMostrarElFormulario = errorDeCarga
        ? errorDeCarga
        : ordenCerrada
            ? "Esta orden está cerrada (entregada o cancelada) y no se puede presupuestar."
            : trabajosLibres.length === 0
                ? "Esta orden no tiene trabajos libres. Cargalos o cancelá el presupuesto que los tiene."
                : null;

    if (motivoParaNoMostrarElFormulario) {
        return (
            <div className="presupuesto-form">
                {titulo}
                <div className="info-orden-vacio">{motivoParaNoMostrarElFormulario}</div>
                {notasDeTrabajosExcluidos.length > 0 && (
                    <ul className="presupuesto-alta-notas">{notasDeTrabajosExcluidos}</ul>
                )}
                <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-secondary" onClick={onCancelar}>
                        Volver
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form className="presupuesto-form" onSubmit={manejarEnvio}>
            {titulo}

            {error && <p className="alert alert-danger" role="alert">{error}</p>}

            {/* 1. Trabajos */}
            <fieldset className="presupuesto-alta-seccion">
                <legend className="presupuesto-alta-subtitulo">1. Trabajos a presupuestar</legend>

                <ul className="presupuesto-alta-trabajos">
                    {trabajosLibres.map((trabajo) => (
                        <li key={trabajo.id} className="presupuesto-alta-trabajo">
                            <div className="form-check presupuesto-alta-trabajo-fila">
                                <input
                                    id={`trabajo-${trabajo.id}`}
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={idsDeTrabajosElegidos.includes(trabajo.id)}
                                    onChange={() => alternarTrabajo(trabajo.id)}
                                />
                                <label htmlFor={`trabajo-${trabajo.id}`} className="form-check-label">
                                    {trabajo.tipoTrabajo}
                                </label>
                                <span className="presupuesto-alta-importe">{formatearPrecio(trabajo.manoDeObra)}</span>
                            </div>

                            {trabajo.repuestos?.length > 0 && (
                                <ul className="presupuesto-alta-repuestos">
                                    {trabajo.repuestos.map((repuesto) => (
                                        <li key={repuesto.id}>
                                            <span>{repuesto.nombre} × {repuesto.cantidad}</span>
                                            <span>{formatearPrecio(calcularSubtotalDelRepuesto(repuesto))}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>

                <ul className="presupuesto-alta-notas">
                    {notasDeTrabajosExcluidos}
                    <li>Los precios se copian al crear y no cambian después.</li>
                </ul>
            </fieldset>

            {/* 2. Validez y observaciones */}
            <div className="presupuesto-alta-fila">
                <div className="presupuesto-form-campo presupuesto-alta-validez">
                    <label htmlFor="presupuesto-dias-validez">2. Validez (días)</label>
                    <input
                        id="presupuesto-dias-validez"
                        type="number"
                        min="1"
                        step="1"
                        className="form-control"
                        value={diasValidez}
                        onChange={(event) => setDiasValidez(event.target.value)}
                        aria-describedby="presupuesto-dias-validez-ayuda"
                    />
                    <small id="presupuesto-dias-validez-ayuda" className="text-secondary">
                        Corre desde el envío al cliente
                    </small>
                </div>

                <div className="presupuesto-form-campo presupuesto-alta-observaciones">
                    <label htmlFor="presupuesto-observaciones">Observaciones</label>
                    <input
                        id="presupuesto-observaciones"
                        type="text"
                        className="form-control"
                        value={observaciones}
                        onChange={(event) => setObservaciones(event.target.value)}
                    />
                </div>
            </div>

            {/* 3. Descuentos */}
            <fieldset className="presupuesto-alta-seccion">
                <legend className="presupuesto-alta-subtitulo">3. Descuentos</legend>

                {descuentos.map((descuento, indice) => (
                    <div key={descuento.clave} className="presupuesto-alta-descuento">
                        <div className="presupuesto-form-campo">
                            <label htmlFor={`descuento-motivo-${descuento.clave}`}>Motivo</label>
                            <input
                                id={`descuento-motivo-${descuento.clave}`}
                                name="motivo"
                                type="text"
                                className="form-control"
                                value={descuento.motivo}
                                onChange={(event) => actualizarDescuento(descuento.clave, event)}
                                required
                            />
                        </div>
                        <div className="presupuesto-form-campo">
                            <label htmlFor={`descuento-monto-${descuento.clave}`}>Monto</label>
                            <input
                                id={`descuento-monto-${descuento.clave}`}
                                name="monto"
                                type="number"
                                min="0.01"
                                step="0.01"
                                className="form-control"
                                value={descuento.monto}
                                onChange={(event) => actualizarDescuento(descuento.clave, event)}
                                required
                            />
                        </div>
                        <button
                            type="button"
                            className="presupuesto-form-quitar"
                            onClick={() => quitarDescuento(descuento.clave)}
                            aria-label={`Quitar descuento ${indice + 1}`}
                            title="Quitar descuento"
                        >
                            ×
                        </button>
                    </div>
                ))}

                <button type="button" className="btn btn-outline-secondary btn-sm presupuesto-form-agregar" onClick={agregarDescuento}>
                    + Agregar descuento
                </button>
            </fieldset>

            {/* Resumen (vista previa) */}
            <div className="info-orden-resumen presupuesto-alta-resumen">
                <div className="info-orden-resumen-item">
                    <span>Mano de obra</span>
                    <strong>{formatearPrecio(totalManoDeObra)}</strong>
                </div>
                <div className="info-orden-resumen-item">
                    <span>Repuestos</span>
                    <strong>{formatearPrecio(totalRepuestos)}</strong>
                </div>
                <div className="info-orden-resumen-item">
                    <span>Descuentos</span>
                    <strong>−{formatearPrecio(totalDescuentos)}</strong>
                </div>
                <div className={`info-orden-resumen-total ${descuentosSuperanElTotal ? "presupuesto-alta-negativo" : ""}`}>
                    <span>Precio final</span>
                    <strong>{precioFinal < 0 ? `−${formatearPrecio(-precioFinal)}` : formatearPrecio(precioFinal)}</strong>
                </div>
                {descuentosSuperanElTotal && (
                    <p className="presupuesto-alta-aviso-negativo" role="alert">
                        Los descuentos superan el total: así no se puede crear.
                    </p>
                )}
            </div>

            {/* Pie */}
            <div className="presupuesto-alta-pie">
                <span className="text-secondary">Se guarda en borrador: lo podés modificar hasta enviarlo.</span>
                <div className="d-flex gap-2">
                    <button type="button" className="btn btn-secondary" onClick={onCancelar}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn btn-success" disabled={guardando || descuentosSuperanElTotal}>
                        {guardando ? "Creando..." : "Crear presupuesto"}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default PresupuestoAltaForm;
