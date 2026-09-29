import '../../estilos.css'

// import { obtenerPresupuestos } from '../services/presupuestosService';

function PresupuestoForm(){

    return(
        <>

            <section className = "contenedor">
                <h2 className="titContenedor">Nuevo presupuesto</h2>
                <form className="grilla grilla-presupuesto" id = "formularioPres">
                    <div className = "formulario">
                        <label for = "idOrden">Orden de trabajo:</label>
                        <select name = "Orden de trabajo" id = "idOrden">
                            <option value = "">Elegir</option>
                        </select>
                    </div>
                    <div className="textos">
                        <label for="idObs">Observaciones</label>
                        <textarea name="Observaciones" id="idObs" cols="30" rows="5"></textarea>
                    </div>
                    <button type="submit" className="btnGuardar">Guardar presupuesto</button>
                </form>
            </section>
            
        </>
    );
    }

export default PresupuestoForm;