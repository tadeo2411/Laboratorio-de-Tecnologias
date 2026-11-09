import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { crearTurno, estadosTurno, modificarTurno } from '../services/turnosService';
import botonMas from '../../../assets/icons/botonMas.png';
import ModalNotificacion from '../../../shared/components/ModalNotification';

const valoresIniciales = {
    vehiculoId: '',
    fechaHora: '',
    duracion: '',
    motivo: '',
    estado: 'SOLICITADO',
}

function TurnosForm({ turnoInicial, onGuardar, cargando, error, vehiculos }) {
    const [formulario, setFormulario] = useState(valoresIniciales);
    const [guardando, setGuardando] = useState(false);
    const [notificacion, setNotificacion] = useState(null);

    useEffect(() => {
        if (turnoInicial) {
            setFormulario({
                clienteId: turnoInicial.cliente_id ?? '',
                vehiculoId: turnoInicial.vehiculo_id ?? '',
                fechaHora: turnoInicial.fecha_hora
                    ? turnoInicial.fecha_hora.replace(' ', 'T').slice(0, 16)
                    : '',
                duracion: turnoInicial.duracion_min ?? '',
                motivo: turnoInicial.motivo ?? '',
                estado: turnoInicial.estado ?? 'SOLICITADO',
            });
        } else {
            setFormulario(valoresIniciales);
        }
    }, [turnoInicial]);

    function actualizarCampo(evento) {
        const { name, value } = evento.target
        setFormulario(anteriores => ({ ...anteriores, [name]: value }))
    }

    async function manejarEnvio(e) {
        e.preventDefault();

        if (!formulario.vehiculoId) {
            setNotificacion({
                tipo: "advertencia",
                mensaje: "Debés seleccionar un vehículo.",
                onCerrar: () => setNotificacion(null)
            });
            return;
        }

        try {
            setGuardando(true);

            const datos = {
                id_vehiculo: Number(formulario.vehiculoId),
                fecha_hora: formulario.fechaHora,
                duracion_min: formulario.duracion !== ""
                    ? Number(formulario.duracion)
                    : null,
                motivo: formulario.motivo.trim(),
                estado: formulario.estado
            };

            let resultado;

            if (turnoInicial) {
                resultado = await modificarTurno(turnoInicial.id, datos);

                setNotificacion({
                    tipo: "exito",
                    mensaje: "Turno actualizado correctamente.",
                    onCerrar: () => {
                        onGuardar(resultado);
                        window.location.reload();
                        setNotificacion(null);
                    }
                });

            } else {
                resultado = await crearTurno(datos);

                setNotificacion({
                    tipo: "exito",
                    mensaje: "Se ha registrado correctamente el turno.",
                    onCerrar: () => {
                        onGuardar(resultado);
                        window.location.reload();
                        setNotificacion(null);
                        
                    }
                });
            }

            

        } catch (error) {
            console.error("Error al guardar el turno:", error);

            setNotificacion({
                tipo: "advertencia",
                mensaje: error.message || "No se pudo guardar el turno.",
                onCerrar: () => {setNotificacion(null);window.location.reload();onGuardar(resultado);}
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
                        <label htmlFor="vehiculoId">
                            Vehículo <span className="asterisco">*</span>
                        </label>

                        <div className="campo-icono">
                            <select
                                id="vehiculoId"
                                name="vehiculoId"
                                className="select"
                                value={formulario.vehiculoId}
                                onChange={actualizarCampo}
                                required
                                disabled={cargando || Boolean(error)}
                            >
                                <option value="">--- Elegir ---</option>
                                {vehiculos.map(vehiculo => (
                                    <option key={vehiculo.id} value={vehiculo.id}>
                                        {vehiculo.patente} — {vehiculo.marca} {vehiculo.modelo}
                                    </option>
                                ))}
                            </select>

                            <Link to="/gestor/vehiculos">
                                <img
                                    src={botonMas}
                                    alt="Agregar vehículo"
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
                </div>

                <div className="d-flex justify-content-end gap-2">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        className="btn btn-success"
                        disabled={cargando || Boolean(error)}
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
