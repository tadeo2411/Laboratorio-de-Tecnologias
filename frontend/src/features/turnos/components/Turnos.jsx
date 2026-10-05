// import '../../estilos.css'
import BotonEliminar from '../../../shared/components/BotonEliminar'
import BotonEditar from '../../../shared/components/BotonEditar'
import BotonNuevo from '../../../shared/components/BotonNuevo'
function Turnos({ turnos, onNuevoTurno, onEliminarTurno, onEditarTurno }){
return(
    <>
        <div id = 'nuevoTurno'>
            <BotonNuevo
            componente = 'Turno'
            onClick={onNuevoTurno}
            />
        </div>
        <section className="contenedor">
            <h2 className="titContenedor">Turnos</h2>
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
                                    <td data-label ='Fecha'>{turno.fechaHora.replace('T', ' ')}</td>
                                    <td data-label ='Patente'>{turno.patente}</td>
                                    <td data-label ='Estado'>{turno.estado}</td>
                                    <td data-label ='Acciones' >
                                        <div className="d-flex gap-2">
                                            <BotonEliminar
                                            onClick={()=> onEliminarTurno(turno.id)}
                                            aria-label={`Eliminar turno del vehículo con patente ${turno.patente} en fecha ${turno.fechaHora.replace('T', ' ')}`}
                                            />

                                            <BotonEditar
                                            onClick={()=> onEditarTurno(turno)}
                                            aria-label={`Editar turno del vehículo con patente ${turno.patente}`} />
                                        </div>
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
