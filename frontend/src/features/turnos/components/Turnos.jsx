// import '../../estilos.css'
function Turnos({ turnos, onNuevoTurno }){
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
                                <tr key = {turno.id ?? `${turno.patente}-${turno.fechaHora}`}>
                                    <td>{turno.fechaHora.replace('T', ' ')}</td>
                                    <td>{turno.patente}</td>
                                    <td>{turno.estado}</td>
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
