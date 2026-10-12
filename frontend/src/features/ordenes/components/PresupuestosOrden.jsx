import PresupuestoCard from "./PresupuestoCard.jsx";

// Vista de solo lectura de los presupuestos de una orden (detalle "Más información").
// Los datos los carga MasInfo, que también los usa para trabajos y repuestos.
function PresupuestosOrden({ presupuestos, cargando, error }) {
    // Se abre el aprobado (el que rige la orden); si no hay, el más reciente.
    const idAbierto =
        presupuestos.find((p) => p.estadoPresupuesto === "APROBADO")?.id ?? presupuestos[0]?.id;

    return (
        <div className="info-orden-seccion">
            <div className="info-orden-seccion-header">
                <h3 className="info-orden-titulo">Presupuestos</h3>
                <span className="info-orden-contador">{presupuestos.length}</span>
            </div>

            {cargando ? (
                <div className="info-orden-vacio">Cargando presupuestos...</div>
            ) : error ? (
                <div className="info-orden-vacio" role="alert">{error}</div>
            ) : presupuestos.length === 0 ? (
                <div className="info-orden-vacio">
                    No hay presupuestos generados para esta orden.
                </div>
            ) : (
                <div className="info-orden-lista">
                    {presupuestos.map((presupuesto) => (
                        <PresupuestoCard
                            key={presupuesto.id}
                            presupuesto={presupuesto}
                            abierto={presupuesto.id === idAbierto}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default PresupuestosOrden;
