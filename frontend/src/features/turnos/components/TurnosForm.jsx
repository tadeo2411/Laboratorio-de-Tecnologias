import { useState } from 'react';

function TurnosForm() {
    return(
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
)
}

export default TurnosForm;