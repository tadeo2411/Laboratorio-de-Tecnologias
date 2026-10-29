import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { estadosTurno, obtenerClientes } from '../services/turnosService';
import botonMas from '../../../assets/icons/botonMas.png';

const valoresIniciales = {
    id_cliente: '',
    id_vehiculo: '',
    fecha_hora: '',
    duracion_min: '',
    motivo: '',
    estado: 'SOLICITADO',
}

function TurnosForm({ turnoInicial, onGuardar, cargando, error, vehiculos }) {
    const [formulario, setFormulario] = useState(turnoInicial
        ? { ...valoresIniciales, ...turnoInicial }
        : valoresIniciales
    )

    const [clientes, setClientes] = useState([]);

    function actualizarCampo(evento) {
        const { name, value } = evento.target
        setFormulario(anteriores => ({ ...anteriores, [name]: value }))
    }

    function manejarEnvio(evento) {
        evento.preventDefault()
        if (cargando || error) return

        const nuevoTurno = {
            id_cliente: Number(formulario.clienteId),
            id_vehiculo: Number(formulario.vehiculoId),
            fecha_hora: formulario.fechaHora,
            duracion_min: Number(formulario.duracion),
            motivo: formulario.motivo.trim(),
            estado: formulario.estado,
        }

        if (formulario.duracion !== '') {
            nuevoTurno.duracion = Number(formulario.duracion)
        }

        onGuardar(nuevoTurno)
    }

    useEffect(() => {
        const obtener = async () => {
            setClientes(await obtenerClientes());
        }
        obtener();
    }, []);


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
                            Dni de cliente <span className="asterisco">*</span>
                        </label>

                        <div className="campo-icono">
                            <select
                                id="clienteId"
                                name="clienteId"
                                className="select"
                                value={formulario.clienteDNI}
                                onChange={actualizarCampo}
                                required
                                disabled={cargando || Boolean(error)}
                            >
                                <option value="">--- Elegir ---</option>
                                {clientes.map(cliente => (
                                    <option key={cliente.id} value={cliente.id}>
                                        {cliente.apellido} — {cliente.nombre} {cliente.dni}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
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
        </div>
    )
}

export default TurnosForm;
