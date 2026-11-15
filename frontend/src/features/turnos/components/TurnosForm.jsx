
import { useState } from 'react';
import { Link } from 'react-router';
import { crearTurno, estadosTurno, modificarTurno } from '../services/turnosService';
import botonMas from '../../../assets/icons/botonMas.png';
import ModalNotificacion from '../../../shared/components/ModalNotification';

const valoresIniciales = {
    clienteId: '',
    fechaHora: '',
    duracion: '',
    motivo: '',
    estado: 'SOLICITADO',
}

function valoresDelTurno(turno) {
    if (!turno) return valoresIniciales;

    return {
        clienteId: turno.cliente_id ?? '',
        fechaHora: turno.fecha_hora ? turno.fecha_hora.slice(0, 16) : '',
        duracion: turno.duracion_min ?? '',
        motivo: turno.motivo ?? '',
        estado: turno.estado ?? 'SOLICITADO',
    };
}

function TurnosForm({ turnoInicial, onGuardar, onCancelar, cargando, error, clientes = [] }) {
    const [formulario, setFormulario] = useState(() => valoresDelTurno(turnoInicial));
    const [guardando, setGuardando] = useState(false);
    const [notificacion, setNotificacion] = useState(null);

    const esEdicion = Boolean(turnoInicial);

    function actualizarCampo(evento) {
        const { name, value } = evento.target
        setFormulario(anteriores => ({ ...anteriores, [name]: value }))
    }

    async function manejarEnvio(e) {
        e.preventDefault();

        if (!formulario.clienteId) {
            setNotificacion({
                tipo: "advertencia",
                mensaje: "Debés seleccionar un cliente.",
                onCerrar: () => setNotificacion(null)
            });
            return;
        }

        try {
            setGuardando(true);

            const datos = {
                id_cliente: Number(formulario.clienteId),
                fecha_hora: formulario.fechaHora,
                duracion_min: formulario.duracion !== ""
                    ? Number(formulario.duracion)
                    : null,
                motivo: formulario.motivo.trim(),
            };

            // El estado solamente se envía al modificar.
            if (esEdicion) {
                datos.estado = formulario.estado;

                await modificarTurno(turnoInicial.id, datos);
            } else {
                await crearTurno(datos);
            }

            setNotificacion({
                tipo: "exito",
                mensaje: esEdicion
                    ? "Turno actualizado correctamente."
                    : "Se ha registrado correctamente el turno.",
                onCerrar: () => {
                    setNotificacion(null);
                    onGuardar();
                }
            });

        } catch (error) {
            setNotificacion({
                tipo: "advertencia",
                mensaje: error.message || "No se pudo guardar el turno.",
                onCerrar: () => setNotificacion(null)
            });

        } finally {
            setGuardando(false);
        }
    }

    return (
        <div>
            <p className="campos-obligatorios">
                Los campos con <span className="asterisco">*</span> son obligatorios.
            </p>

            {error && <p className="alert alert-danger" role="alert">{error}</p>}

            <form className="form-ordenes" onSubmit={manejarEnvio}>
                <div>
                    <div>
                        <label htmlFor="clienteId">
                            Cliente <span className="asterisco">*</span>
                        </label>

                        <div className="campo-icono">
                            <select
                                id="clienteId"
                                name="clienteId"
                                className="select"
                                value={formulario.clienteId}
                                onChange={actualizarCampo}
                                required
                                disabled={cargando || Boolean(error)}
                            >
                                <option value="">--- Elegir cliente ---</option>

                                {(clientes ?? []).map(cliente => (
                                    <option key={cliente.id} value={cliente.id}>
                                        {cliente.nombre}
                                        {cliente.apellido ? ` ${cliente.apellido}` : ''}
                                    </option>
                                ))}
                            </select>

                            <Link to="/gestor/clientes">
                                <img
                                    src={botonMas}
                                    alt="Agregar cliente"
                                    className="botonAgregar"
                                />
                            </Link>
                        </div>
                    </div>
                </div>

                <div>
                    <div>
                        <label htmlFor="fechaHora">
                            Fecha y hora <span className="asterisco">*</span>
                        </label>
                        <input
                            id="fechaHora"
                            name="fechaHora"
                            type="datetime-local"
                            value={formulario.fechaHora}
                            onChange={actualizarCampo}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="duracion">Duración (minutos)</label>
                        <input
                            id="duracion"
                            name="duracion"
                            type="number"
                            min="1"
                            step="1"
                            value={formulario.duracion}
                            onChange={actualizarCampo}
                        />
                    </div>
                </div>

                <div>
                    <div>
                        <label htmlFor="motivo">
                            Motivo <span className="asterisco">*</span>
                        </label>
                        <input
                            id="motivo"
                            name="motivo"
                            type="text"
                            value={formulario.motivo}
                            onChange={actualizarCampo}
                            pattern={'.*\\S.*'}
                            title="Escribí un motivo que no contenga solo espacios."
                            required
                        />
                    </div>

                    {esEdicion && (
                        <div>
                            <label htmlFor="estado">
                                Estado <span className="asterisco">*</span>
                            </label>

                            <div className="campo-icono">
                                <select
                                    id="estado"
                                    name="estado"
                                    className="select"
                                    value={formulario.estado}
                                    onChange={actualizarCampo}
                                    required
                                >
                                    {estadosTurno.map(estado => (
                                        <option key={estado} value={estado}>
                                            {estado}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                <div className="d-flex justify-content-end gap-2">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onCancelar}
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        className="btn btn-success"
                        disabled={cargando || Boolean(error) || guardando}
                    >
                        Guardar
                    </button>
                </div>
            </form>

            {notificacion && (
                <ModalNotificacion
                    {...notificacion}
                    onCerrar={notificacion.onCerrar}
                />
            )}
        </div>
    )
}

export default TurnosForm;
