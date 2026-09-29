import '../../estilos.css'

function Turnos(){
return(
    <>
        <section className="contenedor">
            <h2 className="titContenedor">Nuevo turno</h2>
            <form>
                <div className="formulario anchoComp">
                    <label for="dueno">Vehículo</label>
                    <select id="dueno">
                        <option>---elegir---</option>
                    </select>
                </div>
                <div className="grilla">
                    <div className="formulario">
                        <label>Fecha y hora</label>
                        <input type="datetime-local" />
                    </div>
                    <div className="formulario">
                        <label>Duración (minutos)</label>
                        <input type="number" />
                    </div>
                    <div className="formulario">
                        <label>Motivo</label>
                        <input type="text" />
                    </div>
                </div>
                <button type="submit" className="btnGuardar">Guardar</button>
            </form>
        </section>
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