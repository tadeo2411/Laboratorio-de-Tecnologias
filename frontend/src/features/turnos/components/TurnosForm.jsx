import { useState } from 'react';
import { Link } from 'react-router';
import { estadosTurno } from '../services/turnosService';
import botonMas  from '../../../assets/botonMas.png';

const valoresIniciales = {
    patente: '',
    fechaHora: '',
    duracion: '',
    motivo: '',
    estado: 'SOLICITADO',
}

function TurnosForm({ onGuardar, cargando, error, vehiculos }) {
    const [formulario, setFormulario] = useState(valoresIniciales)

    function actualizarCampo(evento) {
        const { name, value } = evento.target
        setFormulario(anteriores => ({ ...anteriores, [name]: value }))
    }

    function manejarEnvio(evento) {
        evento.preventDefault()
        if (cargando || error) return

        const nuevoTurno = {
            patente: formulario.patente,
            fechaHora: formulario.fechaHora,
            motivo: formulario.motivo.trim(),
            estado: formulario.estado,
        }

        if (formulario.duracion !== '') {
            nuevoTurno.duracion = Number(formulario.duracion)
        }

        onGuardar(nuevoTurno)
    }

    return(
        <div>
            <p>Los campos con * son obligatorios.</p>
            <form onSubmit={manejarEnvio}>
                <div className="formulario anchoComp">
                    <label htmlFor="patente" >Vehículo *</label>
                    <div className="row g-2 align-items-center flex-nowrap">
                        <select id="patente" name="patente" value={formulario.patente} onChange={actualizarCampo} required disabled={cargando||Boolean(error)} className='col'>
                            <option value="">--- Elegir ---</option>
                            {vehiculos.map(vehiculo => (
                                <option key={vehiculo.id} value={vehiculo.patente}>
                                    {vehiculo.patente} — {vehiculo.marca} {vehiculo.modelo}
                                </option>
                            ))}
                        </select>
                        <Link to="/gestor/vehiculos" className="col-auto"><img src={botonMas} alt="agregar vehículo" className="botonAgregar"/></Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="formulario">
                            <label htmlFor="fechaHora">Fecha y hora *</label>
                            <input id="fechaHora" name="fechaHora" type="datetime-local" value={formulario.fechaHora} onChange={actualizarCampo} required />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="formulario">
                            <label htmlFor="duracion">Duración (minutos)</label>
                            <input id="duracion" name="duracion" type="number" min="1" step="1" value={formulario.duracion} onChange={actualizarCampo} />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="formulario">
                            <label htmlFor="motivo">Motivo *</label>
                            <input id="motivo" name="motivo" type="text" value={formulario.motivo} onChange={actualizarCampo} pattern={'.*\\S.*'} title="Escribí un motivo que no contenga solo espacios." required />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="formulario">
                            <label htmlFor="estado">Estado *</label>
                            <select id="estado" name="estado" value={formulario.estado} onChange={actualizarCampo} required>
                                {estadosTurno.map(estado => (
                                    <option key={estado} value={estado}>{estado}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" className="btnGuardar mt-0" disabled={cargando || Boolean(error)}>Guardar</button>
                </div>
            </form>
        </div>
)
}

export default TurnosForm;
