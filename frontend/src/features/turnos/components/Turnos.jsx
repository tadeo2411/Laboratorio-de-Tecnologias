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
            
            <div>
                <h2 className="titContenedor">Agenda</h2>
            </div>
             <p className="sinDatos">No hay turnos para hoy.</p>
        </section>
    </>
);
}

export default Turnos;
