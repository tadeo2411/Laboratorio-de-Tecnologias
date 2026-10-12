import img_presupuesto from "../../../assets/icons/img_presupuesto.png";
import { ESTADOS_PRESUPUESTO, TIPOS_ITEM, formatearFecha, formatearPrecio } from "../utils/presupuestosVista";

// Tarjeta desplegable con los datos e ítems de un presupuesto.
// "acciones" se muestra al pie (lo usa el ABM para editar y eliminar).
function PresupuestoCard({ presupuesto, abierto = false, acciones = null }) {
    const estado = ESTADOS_PRESUPUESTO[presupuesto.estadoPresupuesto];

    return (
        <details className="info-orden-card presupuesto-card" open={abierto}>
            <summary className="info-orden-card-header presupuesto-summary">
                <div className="info-orden-card-titulo">
                    <img src={img_presupuesto} alt="" />
                    <span>{presupuesto.numero}</span>
                    <span className={`presupuesto-estado ${estado?.clase ?? ""}`}>
                        {estado?.texto ?? presupuesto.estadoPresupuesto}
                    </span>
                </div>

                <span className="info-orden-card-precio">
                    {formatearPrecio(presupuesto.precioFinal)}
                </span>
            </summary>

            <div className="info-orden-card-datos">
                <div>
                    <span className="info-orden-label">Emisión</span>
                    <span>{formatearFecha(presupuesto.fechaEmision)}</span>
                </div>
                <div>
                    <span className="info-orden-label">Vencimiento</span>
                    <span>{formatearFecha(presupuesto.fechaVencimiento)}</span>
                </div>
                <div>
                    <span className="info-orden-label">Ítems</span>
                    <span>{presupuesto.items.length}</span>
                </div>
            </div>

            <div className="presupuesto-items">
                <table>
                    <thead>
                        <tr>
                            <th>Tipo</th>
                            <th>Descripción</th>
                            <th className="presupuesto-numero">Cant.</th>
                            <th className="presupuesto-numero">P. unitario</th>
                            <th className="presupuesto-numero">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {presupuesto.items.map((item) => (
                            <tr key={item.id}>
                                <td data-label="Tipo">{TIPOS_ITEM[item.tipo] ?? item.tipo}</td>
                                <td data-label="Descripción">{item.descripcion}</td>
                                <td data-label="Cant." className="presupuesto-numero">{item.cantidad}</td>
                                <td data-label="P. unitario" className="presupuesto-numero">
                                    {formatearPrecio(item.precioUnitario)}
                                </td>
                                <td data-label="Total" className="presupuesto-numero">
                                    {formatearPrecio(item.precioTotal)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {acciones && <div className="presupuesto-acciones">{acciones}</div>}
        </details>
    );
}

export default PresupuestoCard;
