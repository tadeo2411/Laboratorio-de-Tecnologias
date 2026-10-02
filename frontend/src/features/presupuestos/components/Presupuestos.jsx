function Presupuestos({ presupuestos }){


    
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
                                    <td colSpan={4} className="sinDatos" style={{textAlign: 'center'}}>Aun no hay datos cargados</td>
                                </tr>
                            ):
                            (
                                presupuestos.map(presupuesto =>(
                                    <tr key= {presupuesto.id}>
                                        <td>{presupuesto.numero}</td>
                                        <td>{presupuesto.fecha}</td>
                                        <td>{presupuesto.estado}</td>
                                        <td>{presupuesto.total}</td>
                                    </tr>
                                )
                                )
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