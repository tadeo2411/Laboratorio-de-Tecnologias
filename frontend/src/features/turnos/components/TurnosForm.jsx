
import { useState } from 'react';
import { crearTurno, estadosTurno, modificarTurno } from '../services/turnosService';
import { BuscadorClientes, ClientesForm, crearCliente } from '../../clientes';
import Modal from '../../../shared/components/Modal';
import botonMas from '../../../assets/icons/botonMas.png';
import ModalNotificacion from '../../../shared/components/ModalNotification';

const valoresIniciales = {
    clienteId: '',
    fechaHora: '',
    duracion: '',
    motivo: '',
    estado: 'CONFIRMADO',
}

function valoresDelTurno(turno) {
    if (!turno) return valoresIniciales;

    return {
        clienteId: turno.cliente_id ?? '',
        fechaHora: turno.fecha_hora ? turno.fecha_hora.slice(0, 16) : '',
        duracion: turno.duracion_min ?? '',
        motivo: turno.motivo ?? '',
        estado: turno.estado ?? 'CONFIRMADO',
    };
}

function TurnosForm({ turnoInicial, onGuardar, onCancelar, cargando, error, clientes = [], onClienteCreado }) {
    const [formulario, setFormulario] = useState(() => valoresDelTurno(turnoInicial));
    const [clienteSeleccionado, setClienteSeleccionado] = useState(() => {
        if (!turnoInicial?.cliente_id) return null;
        return (
            clientes.find((c) => c.id === Number(turnoInicial.cliente_id)) || {
                id: turnoInicial.cliente_id,
                nombre: turnoInicial.cliente_nombre || 'Cliente seleccionado',
                documento: turnoInicial.cliente_documento ?? ''
            }
        );
    });
    const [guardando, setGuardando] = useState(false);
    const [notificacion, setNotificacion] = useState(null);
    const [mostrarModalCliente, setMostrarModalCliente] = useState(false);
    const [errorCliente, setErrorCliente] = useState('');

    const esEdicion = Boolean(turnoInicial);

    function seleccionarCliente(cliente) {
        setClienteSeleccionado(cliente);
        setFormulario((anteriores) => ({ ...anteriores, clienteId: cliente.id }));
    }

    function cambiarCliente() {
        setClienteSeleccionado(null);
        setFormulario((anteriores) => ({ ...anteriores, clienteId: '' }));
    }

    async function handleGuardarCliente(datosNuevoCliente) {
        try {
            setErrorCliente('');
            const clienteCreado = await crearCliente(datosNuevoCliente);

            if (onClienteCreado) {
                onClienteCreado(clienteCreado);
            }

            seleccionarCliente(clienteCreado);
            setMostrarModalCliente(false);
        } catch (err) {
            setErrorCliente(err.message || 'No se pudo registrar el cliente.');
        }
    }

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
                estado: formulario.estado || 'CONFIRMADO',
            };

            if (esEdicion) {
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

                        {clienteSeleccionado ? (
                            <div className="d-flex justify-content-between align-items-center p-2 bg-light border rounded mt-1">
                                <span>
                                    <strong>{clienteSeleccionado.nombre}</strong>
                                    {clienteSeleccionado.apellido ? ` ${clienteSeleccionado.apellido}` : ''}
                                    {clienteSeleccionado.documento && (
                                        <span className="text-muted ms-2">· Doc: {clienteSeleccionado.documento}</span>
                                    )}
                                </span>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={cambiarCliente}
                                >
                                    Cambiar
                                </button>
                            </div>
                        ) : (
                            <div className="d-flex align-items-start gap-2 mt-1">
                                <div className="flex-grow-1">
                                    <BuscadorClientes
                                        id="clienteId"
                                        clientes={clientes}
                                        onSeleccionar={seleccionarCliente}
                                        onRegistrarNuevo={() => setMostrarModalCliente(true)}
                                        placeholder="Buscar por nombre o DNI/CUIT..."
                                    />
                                </div>
                            </div>
                        )}
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

            {mostrarModalCliente && (
                <Modal
                    titulo="Registrar nuevo cliente"
                    onCerrar={() => {
                        setMostrarModalCliente(false);
                        setErrorCliente('');
                    }}
                    cerrarAlTocarFondo={true}
                >
                    <ClientesForm
                        onGuardar={handleGuardarCliente}
                        onCancelar={() => {
                            setMostrarModalCliente(false);
                            setErrorCliente('');
                        }}
                        error={errorCliente}
                    />
                </Modal>
            )}
        </div>
    )
}

export default TurnosForm;
