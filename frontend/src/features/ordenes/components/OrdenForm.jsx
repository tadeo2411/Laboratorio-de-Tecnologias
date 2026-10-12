import { useState } from "react";
import img_auto from "../../../assets/icons/img_auto.png";
import img_estado from "../../../assets/icons/img_estado.svg";
import img_urgencia from "../../../assets/icons/img_urgencia.svg"
import img_service from "../../../assets/icons/img_trabajo.svg"
import FichaForm from "./FichaForm.jsx";
import { ESTADO_INICIAL, obtenerEstado, siguienteEstado } from "../utils/estados";
import { buscarFicha, formatearFecha } from "../utils/ordenes";
import {
    TEXTO_TIPO_FICHA,
    fichaVacia,
    puedeCargarIngreso,
    puedeCargarEgreso,
    validarFicha,
    armarFicha
} from "../utils/fichas";

const TIPOS_FICHA = ["INGRESO", "EGRESO"];

function valoresIniciales(orden){
    return {
        vehiculoPatente: orden?.vehiculoPatente ?? "",
        estado: orden?.estado ?? ESTADO_INICIAL,
        diagnostico: orden?.diagnostico ?? "",
        esService: orden?.esService ?? false,
        esUrgencia: orden?.esUrgencia ?? false,
    };
}

function OrdenForm({ orden, vehiculos, onGuardar, onCerrar }) {
    const [formulario, setFormulario] = useState(valoresIniciales(orden));
    const [fichasNuevas, setFichasNuevas] = useState({ INGRESO: null, EGRESO: null });
    const [error, setError] = useState("");
    const [guardando, setGuardando] = useState(false);
    const esEdicion = Boolean(orden);

    const estadosPosibles = esEdicion ? [orden.estado, ...siguienteEstado(orden.estado)] : [];
    const puedeCargarFicha = esEdicion
        ? { INGRESO: puedeCargarIngreso(orden), EGRESO: puedeCargarEgreso(orden) }
        : { INGRESO: false, EGRESO: false };

    function actualizarCampo(event){
        const { name, value, type, checked } = event.target;
        setFormulario(valoresActuales => ({
            ...valoresActuales,
            [name]: type === "checkbox" ? checked : value
        }));
    }

    function cambiarFicha(tipo, ficha){
        setFichasNuevas(fichasActuales => ({ ...fichasActuales, [tipo]: ficha }));
    }

    function validarFichasNuevas(){
        const ingresoGuardado = esEdicion ? buscarFicha(orden, "INGRESO") : null;
        const egresoGuardado = esEdicion ? buscarFicha(orden, "EGRESO") : null;

        if (fichasNuevas.INGRESO){
            const mensaje = validarFicha(fichasNuevas.INGRESO);
            if (mensaje) return `Ficha de ingreso: ${mensaje}`;
        }

        if (fichasNuevas.EGRESO){
            const kilometrajeIngreso = ingresoGuardado?.kilometraje
                ?? (fichasNuevas.INGRESO ? Number(fichasNuevas.INGRESO.kilometraje) : null);

            if (kilometrajeIngreso === null){
                return "Ficha de egreso: primero hay que cargar la ficha de ingreso.";
            }
            const mensaje = validarFicha(fichasNuevas.EGRESO, kilometrajeIngreso);
            if (mensaje) return `Ficha de egreso: ${mensaje}`;
        }

        if (formulario.estado === "ENTREGADO" && !egresoGuardado && !fichasNuevas.EGRESO){
            return "Para entregar el vehículo primero cargá la ficha de egreso.";
        }
        return "";
    }

    async function manejarEnvio(event){
        event.preventDefault();
        setError("");

        if (!formulario.vehiculoPatente){
            setError("Seleccioná el vehículo.");
            return;
        }

        const errorFichas = validarFichasNuevas();
        if (errorFichas){
            setError(errorFichas);
            return;
        }

        const fichasParaGuardar = TIPOS_FICHA
            .filter(tipo => fichasNuevas[tipo])
            .map(tipo => armarFicha(tipo, fichasNuevas[tipo]));

        setGuardando(true);
        try {
            await onGuardar({
                ...formulario,
                diagnostico: formulario.diagnostico.trim() || null
            }, fichasParaGuardar);
        } catch (errorGuardado) {
            setError(errorGuardado.message);
        } finally {
            setGuardando(false);
        }
    }

    return (
        <div>
            <p className="campos-obligatorios">
                Los campos con <span className="asterisco">*</span> son obligatorios.
            </p>
            <form className="form-ordenes" onSubmit={manejarEnvio}>
                {error && <p className="alert alert-danger" role="alert">{error}</p>}

                <div>
                    <div>
                        <label htmlFor="orden-vehiculo">
                            Vehículo <span className="asterisco">*</span>
                        </label>
                        <div className="campo-icono">
                            <img style={{ filter: "brightness(0) saturate(100%) invert(27%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)" }} src={img_auto} alt="" />
                            <select
                                id="orden-vehiculo"
                                name="vehiculoPatente"
                                className="select"
                                value={formulario.vehiculoPatente}
                                onChange={actualizarCampo}
                                disabled={esEdicion}
                            >
                                <option value="" disabled>
                                    Seleccionar vehículo
                                </option>
                                {vehiculos.map(vehiculo => (
                                    <option key={vehiculo.patente} value={vehiculo.patente}>
                                        {vehiculo.patente} - {vehiculo.marca} {vehiculo.modelo}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {esEdicion && (
                        <div>
                            <label htmlFor="orden-estado">
                                Estado <span className="asterisco">*</span>
                            </label>
                            <div className="campo-icono">
                                <img style={{ filter: "brightness(0) saturate(100%) invert(49%) sepia(87%) saturate(550%) hue-rotate(92deg) brightness(92%) contrast(101%)" }} src={img_estado} alt="" />
                                <select
                                    id="orden-estado"
                                    name="estado"
                                    className="select"
                                    value={formulario.estado}
                                    onChange={actualizarCampo}
                                >
                                    {estadosPosibles.map(estado => (
                                        <option key={estado} value={estado}>
                                            {obtenerEstado(estado).texto}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <div>
                        <label htmlFor="orden-diagnostico">Diagnóstico</label>
                        <div>
                            <textarea
                                id="orden-diagnostico"
                                name="diagnostico"
                                placeholder="Describí el diagnóstico..."
                                maxLength={500}
                                value={formulario.diagnostico}
                                onChange={actualizarCampo}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <div className="check-container">
                        <img src={img_service} alt="" className="check-icon" />
                        <span>Es service</span>
                        <label className="switch">
                            <input
                                type="checkbox"
                                id="orden-service"
                                name="esService"
                                checked={formulario.esService}
                                onChange={actualizarCampo}
                            />
                            <span className="switch-slider"></span>
                        </label>
                    </div>
                    <div className="check-container">
                        <img src={img_urgencia} alt="" className="check-icon" />
                        <span>Es urgencia</span>
                        <label className="switch">
                            <input
                                type="checkbox"
                                id="orden-urgencia"
                                name="esUrgencia"
                                checked={formulario.esUrgencia}
                                onChange={actualizarCampo}
                            />
                            <span className="switch-slider"></span>
                        </label>
                    </div>
                </div>

                {esEdicion && (
                    <div className="fichas-orden">
                        <span className="fichas-orden-titulo">Fichas</span>

                        {TIPOS_FICHA.map(tipo => {
                            const fichaGuardada = buscarFicha(orden, tipo);

                            if (fichaGuardada){
                                return (
                                    <p key={tipo} className="ficha-cargada">
                                        ✔ {TEXTO_TIPO_FICHA[tipo]} cargada el {formatearFecha(fichaGuardada.fecha)}
                                    </p>
                                );
                            }

                            if (fichasNuevas[tipo]){
                                return (
                                    <FichaForm
                                        key={tipo}
                                        tipo={tipo}
                                        ficha={fichasNuevas[tipo]}
                                        onCambiar={(ficha) => cambiarFicha(tipo, ficha)}
                                        onQuitar={() => cambiarFicha(tipo, null)}
                                    />
                                );
                            }

                            if (puedeCargarFicha[tipo]){
                                return (
                                    <button
                                        key={tipo}
                                        type="button"
                                        className="btn btn-outline-success"
                                        onClick={() => cambiarFicha(tipo, fichaVacia())}
                                    >
                                        + Agregar {TEXTO_TIPO_FICHA[tipo].toLowerCase()}
                                    </button>
                                );
                            }

                            return (
                                <p key={tipo} className="ficha-no-disponible">
                                    La {TEXTO_TIPO_FICHA[tipo].toLowerCase()} se habilita cuando la orden está en reparación o terminada.
                                </p>
                            );
                        })}
                    </div>
                )}

                <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-secondary" onClick={onCerrar}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn btn-success" disabled={guardando}>
                        {guardando ? "Guardando..." : "Guardar"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default OrdenForm;
