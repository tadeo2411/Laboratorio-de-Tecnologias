// import '../../estilos.css'
import {Link} from 'react-router'
function Turnos(){
return(
    <>
        <div id = 'nuevoTurno'>
            <Link to="/gestor/turnos/nuevo" className="btnGuardar" >
                Nuevo turno
            </Link>
        </div>
        <section className="contenedor">
            <div className='formatoTabla'>
                <table className='datosTabla'>
                    <thead>
                        <tr className="titContenedor">
                            <th>Fecha</th>
                            <th>Patente</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {turnos.length === 0?(
                            <tr>
                                <td colSpan={3} className="sinDatos" style={{textAlign: 'center'}}>Aun no hay datos cargados</td>
                            </tr>
                        ):
                        (
                            turnos.map( turno=>(
                                <tr key = {turno.id}>
                                    <td>turno.fecha</td>
                                    <td>turno.patente</td>
                                    <td>turno.estado</td>
                                </tr>
                            ))
                        )
                    }
                    </tbody>
                </table>
                <p className="sinDatos">No hay turnos para hoy.</p>
            </div>
        </section>
    </>
);
}

export default Turnos;
