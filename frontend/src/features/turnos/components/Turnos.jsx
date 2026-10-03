// import '../../estilos.css'
import BotonEliminar from '../../../shared/components/BotonEliminar'
import BotonEditar from '../../../shared/components/BotonEditar'
function Turnos({ turnos, onNuevoTurno, onEliminarTurno, onEditarTurno }){
return(
    <>
        <div id = 'nuevoTurno'>
            <button type="button" onClick={onNuevoTurno} className="btnGuardar">
                Nuevo turno
            </button>
        </div>
        <section className="contenedor">
            <div className='formatoTabla'>
                <table className='datosTabla'>
                    <thead>
                        <tr className="titContenedor">
                            <th>Fecha</th>
                            <th>Patente</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {turnos.length === 0?(
                            <tr>
                                <td colSpan={4} className="sinDatos" style={{textAlign: 'center'}}>Aun no hay datos cargados</td>
                            </tr>
                        ):
                        (
                            turnos.map( turno=>(
                                <tr key = {turno.id ?? `${turno.patente}-${turno.fechaHora}`}>
                                    <td>{turno.fechaHora.replace('T', ' ')}</td>
                                    <td>{turno.patente}</td>
                                    <td>{turno.estado}</td>
                                    <td>
                                        <BotonEliminar
                                        onClick={()=> onEliminarTurno(turno.id)}
                                        aria-label={`Eliminar turno del vehículo con patente ${turno.patente} en fecha ${turno.fechaHora.replace('T', ' ')}`}
                                        />

                                        <BotonEditar
                                        onClick={()=> onEditarTurno(turno)}
                                        aria-label={`Editar turno del vehículo con patente ${turno.patente}`} />
                                    </td>
                                </tr>
                            ))
                        )
                    }
                    </tbody>
                </table>
            </div>
        </section>
    </>
);
}

export default Turnos;
