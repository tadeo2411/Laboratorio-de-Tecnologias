function Ordenes({ordenes}) {
    return (
        <>
            <section className="contenedor">
                <h2 className="titContenedor">Ordenes</h2>
                <input type="search" className="input-busqueda" placeholder="Buscar por número o estado" />
                <div className="formatoTabla">
                    <table className="datosTabla">
                        <thead>
                            <tr>
                                <th>Diagnóstico</th>
                                <th>Estado</th>
                                <th>Garantía</th>
                                <th>Service</th>
                                <th>Urgencia</th>
                            </tr>
                        </thead>

                        <tbody id="idTabla">
                            {ordenes.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="sinDatos"
                                        style={{ textAlign: 'center' }}
                                    >
                                        Aún no hay datos cargados
                                    </td>
                                </tr>
                            ) : (
                                ordenes.map(orden => (
                                    <tr key={orden.id}>
                                        <td>{orden.diagnostico}</td>
                                        <td>{orden.estado}</td>
                                        <td>{orden.garantia ? "Sí" : "No"}</td>
                                        <td>{orden.esService ? "Sí" : "No"}</td>
                                        <td>{orden.esUrgencia ? "Sí" : "No"}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                </div>
            </section>
        </>
    )
}

export default Ordenes