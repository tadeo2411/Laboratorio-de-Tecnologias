import '../../estilos.css'
import { useState } from 'react';
// import { obtenerPresupuestos } from '../services/presupuestosService';
function PresupuestoForm( {onAgregar} ){

    const [obs, setObservaciones] = useState('')
    function envioForm(evento){

        evento.preventDefault()
        
    }


    
    return(
        <>

            <section className = "contenedor">
                <h2 className="titContenedor">Nuevo presupuesto</h2>
                <form className="grilla grilla-presupuesto" id = "formularioPres"
                    onSubmit={envioForm}>
                    <div className = "formulario">
                        <label htmlFor = "idOrden">Orden de trabajo:</label>
                        <select name = "Orden de trabajo" id = "idOrden">
                            <option>Elegir</option>
                            
                        </select>
                    </div>
                    <div className="textos">
                        <label htmlFor="idObs">Observaciones</label>
                        <textarea
                            value={obs}
                            onChange={evento => setObservaciones(evento.target.value)}
                            id="idObs" cols="30" rows="5" />
                    </div>
                    <button type="submit" className="btnGuardar">Guardar presupuesto</button>
                </form>
            </section>
            
        </>
    );
    }

export default PresupuestoForm;