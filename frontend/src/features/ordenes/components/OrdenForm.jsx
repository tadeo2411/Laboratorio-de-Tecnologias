import { useEffect, useState } from "react";
import img_auto from "../../../assets/icons/img_auto.png";
import img_estado from "../../../assets/icons/img_estado.svg";
import img_urgencia from "../../../assets/icons/img_urgencia.svg"
import img_service from "../../../assets/icons/img_trabajo.svg"
import FichaForm from "./FichaForm.jsx";
import BuscadorVehiculo from "./BuscadorVehiculo.jsx";
import { VehiculoForm, obtenerDuenos } from "../../vehiculos";
import { BuscadorClientes } from "../../clientes";
import { ESTADO_INICIAL, obtenerEstado, siguienteEstado } from "../utils/estados";
import { buscarFicha, formatearFecha, describirVehiculo } from "../utils/ordenes";
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

function clienteDeLaOrden(orden){
    if (!orden?.clienteId) return null;
    return { id: orden.clienteId, nombre: orden.clienteNombre, documento: orden.clienteDocumento };
}

function OrdenForm({ orden, vehiculos, clientes, onGuardar, onCrearVehiculo, onCerrar }) {
    const [formulario, setFormulario] = useState(valoresIniciales(orden));
    const [estadoPrevio, setEstadoPrevio] = useState(orden?.estado);

    // Si el estado cambia desde afuera (por ejemplo al enviar un presupuesto), el formulario lo sigue.
    if (orden && orden.estado !== estadoPrevio) {
        setEstadoPrevio(orden.estado);
        setFormulario(valoresActuales => ({ ...valoresActuales, estado: orden.estado }));
    }
    const [fichasNuevas, setFichasNuevas] = useState({ INGRESO: orden ? null : fichaVacia(), EGRESO: null });
    const [clienteElegido, setClienteElegido] = useState(clienteDeLaOrden(orden));
    const [duenos, setDuenos] = useState([]);
    const [error, setError] = useState("");
    const [guardando, setGuardando] = useState(false);
    const [registrandoVehiculo, setRegistrandoVehiculo] = useState(false);
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

    // Al editar se muestran los dueños del vehículo para poder cambiar el cliente rápido.
    useEffect(() => {
        if (!orden) return;
        let activo = true;
        obtenerDuenos(orden.vehiculoId)
            .then(lista => { if (activo) setDuenos(lista); })
            .catch(() => {});
        return () => { activo = false; };
    }, [orden]);

    // Al elegir el vehículo se sugiere como cliente a su último dueño (si no se eligió otro a mano).
    async function elegirVehiculo(patente, vehiculoNuevo = null){
        setFormulario(valoresActuales => ({ ...valoresActuales, vehiculoPatente: patente }));
        setDuenos([]);
        setClienteElegido(actual => actual?.sugerido ? null : actual);

        const vehiculo = vehiculoNuevo ?? vehiculos.find(v => v.patente === patente);
        if (!vehiculo) return;

        try {
            const lista = await obtenerDuenos(vehiculo.id);
            setDuenos(lista);
            if (lista.length > 0) {
                setClienteElegido(actual => actual ?? { ...lista[0], sugerido: true });
            }
        } catch {
            // Si no se pueden traer los dueños, el cliente se busca a mano.
        }
    }

    // No captura errores: si el vehículo no se puede crear, VehiculoForm muestra el motivo.
    async function guardarVehiculoNuevo(datos){
        const vehiculoCreado = await onCrearVehiculo(datos);
        elegirVehiculo(vehiculoCreado.patente, vehiculoCreado);
        setRegistrandoVehiculo(false);
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
            setError("Buscá el vehículo por patente y elegilo, o registrá uno nuevo.");
            return;
        }

        if (!clienteElegido){
            setError("Buscá el cliente por nombre o documento y elegilo.");
            return;
        }

        const errorFichas = validarFichasNuevas();
        if (errorFichas){
            setError(errorFichas);
            return;
        }

        const fichasParaGuardar = TIPOS_FICHA
            .filter(tipo => fichasNuevas[tipo] && !(esEdicion && buscarFicha(orden, tipo)))
            .map(tipo => armarFicha(tipo, fichasNuevas[tipo]));

        setGuardando(true);
        try {
            await onGuardar({
                ...formulario,
                clienteId: clienteElegido?.id,
                diagnostico: formulario.diagnostico.trim() || null
            }, fichasParaGuardar);
        } catch (errorGuardado) {
            setError(errorGuardado.message);
        } finally {
            setGuardando(false);
        }
    }

    // El alta del vehículo reemplaza al formulario de la orden (no se anidan formularios
    // ni se abre un modal sobre otro). Lo cargado en la orden se conserva al volver.
    if (registrandoVehiculo) {
        return (
            <div className="orden-vehiculo-nuevo">
                <h3 className="info-orden-titulo">Registrar vehículo</h3>
                <VehiculoForm
                    vehiculo={null}
                    clientes={clientes}
                    onCancelar={() => setRegistrandoVehiculo(false)}
                    onGuardar={guardarVehiculoNuevo}
                />
            </div>
        );
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
                        {esEdicion ? (
                            <div className="campo-icono">
                                <img style={{ filter: "brightness(0) saturate(100%) invert(27%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)" }} src={img_auto} alt="" />
                                <span id="orden-vehiculo">
                                    {orden.vehiculoPatente} - {describirVehiculo(vehiculos, orden.vehiculoPatente)}
                                </span>
                            </div>
                        ) : (
                            <BuscadorVehiculo
                                vehiculos={vehiculos}
                                patenteSeleccionada={formulario.vehiculoPatente}
                                onSeleccionar={elegirVehiculo}
                                onRegistrarNuevo={() => setRegistrandoVehiculo(true)}
                            />
                        )}
                    </div>

                    <div>
                        <label htmlFor="orden-cliente">
                            Cliente <span className="asterisco">*</span>
                        </label>
                        {clienteElegido ? (
                            <div className="campo-icono orden-cliente-elegido">
                                <span id="orden-cliente">
                                    {clienteElegido.nombre} - {clienteElegido.documento}
                                    {clienteElegido.sugerido && <small className="orden-cliente-nota"> (dueño del vehículo)</small>}
                                </span>
                                <button type="button" className="btn btn-link" onClick={() => setClienteElegido(null)}>
                                    Cambiar
                                </button>
                            </div>
                        ) : (
                            <BuscadorClientes id="orden-cliente" clientes={clientes} onSeleccionar={setClienteElegido} />
                        )}
                        {duenos.some(dueno => dueno.id !== clienteElegido?.id) && (
                            <div className="orden-duenos">
                                <span>Dueños del vehículo:</span>
                                {duenos.map(dueno => (
                                    <button
                                        key={dueno.id}
                                        type="button"
                                        className="btn btn-outline-secondary btn-sm"
                                        aria-pressed={clienteElegido?.id === dueno.id}
                                        onClick={() => setClienteElegido(dueno)}
                                    >
                                        {dueno.nombre}
                                    </button>
                                ))}
                            </div>
                        )}
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
                                    aria-describedby={orden.estado === "ESPERANDO_APROBACION_PRESUPUESTO" ? "orden-estado-ayuda" : undefined}
                                >
                                    {estadosPosibles.map(estado => (
                                        <option key={estado} value={estado}>
                                            {obtenerEstado(estado).texto}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {orden.estado === "ESPERANDO_APROBACION_PRESUPUESTO" && (
                                <p className="orden-estado-ayuda" id="orden-estado-ayuda">
                                    Para empezar la reparación hace falta un presupuesto aprobado (pestaña Presupuestos).
                                </p>
                            )}
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
                        <span id="orden-service-texto">Es service</span>
                        <label className="switch">
                            <input
                                type="checkbox"
                                role="switch"
                                aria-labelledby="orden-service-texto"
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
                        <span id="orden-urgencia-texto">Es urgencia</span>
                        <label className="switch">
                            <input
                                type="checkbox"
                                role="switch"
                                aria-labelledby="orden-urgencia-texto"
                                id="orden-urgencia"
                                name="esUrgencia"
                                checked={formulario.esUrgencia}
                                onChange={actualizarCampo}
                            />
                            <span className="switch-slider"></span>
                        </label>
                    </div>
                </div>

                {!esEdicion && (
                    <div className="fichas-orden">
                        <FichaForm
                            tipo="INGRESO"
                            ficha={fichasNuevas.INGRESO}
                            onCambiar={(ficha) => cambiarFicha("INGRESO", ficha)}
                        />
                    </div>
                )}

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

            </form >
        </div >
    );
}

export default OrdenForm;
