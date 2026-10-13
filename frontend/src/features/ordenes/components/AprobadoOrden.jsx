import { useEffect, useState } from "react";
import { obtenerResumenAprobado } from "../services/presupuestosService";
import { TIPOS_ITEM, formatearPrecio } from "../utils/presupuestosVista";

// Resumen para el taller de lo que el cliente aprobó en la orden
// (ítems de todos los presupuestos aprobados), en la vista "Más información".
function AprobadoOrden({ ordenId }) {
    const [resumen, setResumen] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let activo = true;

        async function cargarResumen() {
            try {
                const encontrado = await obtenerResumenAprobado(ordenId);
                if (activo) setResumen(encontrado);
            } catch (errorCarga) {
                if (activo) setError(errorCarga.message);
            } finally {
                if (activo) setCargando(false);
            }
        }
        cargarResumen();

        return () => {
            activo = false;
        };
    }, [ordenId]);

    // Primero los trabajos y después los repuestos, como se leen en el taller.
    const items = resumen ? [...resumen.trabajos, ...resumen.repuestos] : [];

    return (
        <div className="info-orden-seccion">
            <div className="info-orden-seccion-header">
                <h3 className="info-orden-titulo">Aprobado por el cliente</h3>
                <span className="info-orden-contador">{items.length}</span>
            </div>

            {cargando ? (
                <div className="info-orden-vacio">Cargando lo aprobado...</div>
            ) : error ? (
                <div className="info-orden-vacio" role="alert">{error}</div>
            ) : items.length === 0 ? (
                <div className="info-orden-vacio">
                    Todavía no hay presupuestos aprobados para esta orden.
                </div>
            ) : (
                <>
                    <div className="presupuesto-items">
                        <table>
                            <thead>
                                <tr>
                                    <th>Tipo</th>
                                    <th>Descripción</th>
                                    <th className="presupuesto-numero">Cant.</th>
                                    <th className="presupuesto-numero">Total</th>
                                    <th>Presupuesto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.clave}>
                                        <td data-label="Tipo">{TIPOS_ITEM[item.tipo] ?? item.tipo}</td>
                                        <td data-label="Descripción">{item.descripcion}</td>
                                        <td data-label="Cant." className="presupuesto-numero">{item.cantidad}</td>
                                        <td data-label="Total" className="presupuesto-numero">
                                            {formatearPrecio(item.precioTotal)}
                                        </td>
                                        <td data-label="Presupuesto">{item.numeroPresupuesto}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="info-orden-resumen">
                        <div className="info-orden-resumen-item">
                            <span>Trabajos aprobados</span>
                            <strong>{formatearPrecio(resumen.totalTrabajos)}</strong>
                        </div>
                        <div className="info-orden-resumen-item">
                            <span>Repuestos aprobados</span>
                            <strong>{formatearPrecio(resumen.totalRepuestos)}</strong>
                        </div>
                        <div className="info-orden-resumen-total">
                            <span>Total aprobado</span>
                            <strong>{formatearPrecio(resumen.total)}</strong>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default AprobadoOrden;
