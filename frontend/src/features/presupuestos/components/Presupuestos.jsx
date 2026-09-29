import {state, useState} from 'react';

function Presupuestos(){
    
    
    const [presupuestos, setPresupuestos] = useState([]);

    return(
        <>
        <section className="contenedor">
                <h2 className="titContenedor">Presupuestos</h2>
                <input type="search" className="input-busqueda" placeholder="Buscar por número o estado" />
                <div className="formatoTabla">
                    <table className="datosTabla">
                        <thead>
                            <tr>
                                <th>Numero</th>
                                <th>Fecha</th>
                                <th>Estado</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody id="idTabla">
                            {presupuestos.length === 0 ?(
                                <tr>
                                    <td colspan={4} className="sinDatos">Aun no hay datos cargados</td>
                                </tr>
                            ):
                            (
                                presupuesto.map
                            )
                            }
                        </tbody>
                    </table>
                
                </div>
            </section>
        </>
    )
}

export default Presupuestos