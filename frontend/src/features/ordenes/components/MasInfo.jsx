import img_auto from "../../../assets/icons/img_auto.png";
import img_estado from "../../../assets/icons/img_estado.svg";
import img_diagnostico from "../../../assets/icons/img_diagnostico.svg";
import img_garantia from "../../../assets/icons/img_garantia.svg";
import img_service from "../../../assets/icons/img_trabajo.svg";
import img_urgencia from "../../../assets/icons/img_urgencia.svg";
import img_trabajo from "../../../assets/icons/img_trabajo.svg";
import img_empleado from "../../../assets/icons/img_empleado.svg";
import img_repuestos from "../../../assets/icons/img_repuestos.svg";
import img_precio from "../../../assets/icons/img_precio.svg";
import img_presupuesto from "../../../assets/icons/img_presupuesto.png";

function MasInfo({ orden }) {

    const formatearPrecio = (valor) => {
        return `$${Number(valor || 0).toLocaleString("es-AR")}`;
    };

    return (
        <div className="info-orden">

            {/* =========================
                DATOS GENERALES
            ========================= */}

            <div className="info-orden-seccion">
                <h3 className="info-orden-titulo">
                    Información de la orden
                </h3>

                <div className="info-orden-grid">

                    {/* Vehículo */}
                    <div className="info-orden-item">
                        <span className="info-orden-label">
                            Vehículo
                        </span>

                        <div className="info-orden-dato">
                            <img src={img_auto} alt="" style={{filter: "brightness(0) saturate(100%) invert(12%) sepia(9%) saturate(1138%) hue-rotate(230deg) brightness(91%) contrast(92%)"}} />
                            <span>
                                {orden.vehiculo || `Vehículo #${orden.vehiculoId}`}
                            </span>
                        </div>
                    </div>

                    {/* Estado */}
                    <div className="info-orden-item">
                        <span className="info-orden-label">
                            Estado
                        </span>

                        <div className="info-orden-dato">
                            <img src={img_estado} alt="" />
                            <span>
                                {orden.estado}
                            </span>
                        </div>
                    </div>

                    {/* Garantía */}
                    <div className="info-orden-item">
                        <span className="info-orden-label">
                            Garantía
                        </span>

                        <div className="info-orden-dato">
                            <img src={img_garantia} alt="" />
                            <span>
                                {orden.garantia ? "Sí" : "No"}
                            </span>
                        </div>
                    </div>

                    {/* Service */}
                    <div className="info-orden-item">
                        <span className="info-orden-label">
                            Service
                        </span>

                        <div className="info-orden-dato">
                            <img src={img_service} alt="" />
                            <span>
                                {orden.esService ? "Sí" : "No"}
                            </span>
                        </div>
                    </div>

                    {/* Urgencia */}
                    <div className="info-orden-item">
                        <span className="info-orden-label">
                            Urgencia
                        </span>

                        <div className="info-orden-dato">
                            <img src={img_urgencia} alt="" />
                            <span>
                                {orden.esUrgencia ? "Sí" : "No"}
                            </span>
                        </div>
                    </div>

                </div>
            </div>


            {/* =========================
                DIAGNÓSTICO
            ========================= */}

            <div className="info-orden-seccion">

                <h3 className="info-orden-titulo">
                    Diagnóstico
                </h3>

                <div className="info-orden-descripcion">
                    <img src={img_diagnostico}  alt="diagnóstico" />

                    <span>
                        {orden.diagnostico || "Sin diagnóstico registrado"}
                    </span>
                </div>

            </div>


            {/* =========================
                PRESUPUESTO
            ========================= */}

            <div className="info-orden-seccion">

                <div className="info-orden-seccion-header">
                    <h3 className="info-orden-titulo">
                        Presupuesto
                    </h3>

                    {orden.presupuesto && (
                        <span className="info-orden-total">
                            {formatearPrecio(
                                orden.presupuesto.precioTotal
                            )}
                        </span>
                    )}
                </div>

                {orden.presupuesto ? (

                    <div className="info-orden-presupuesto">

                        <div className="info-orden-item">
                            <span className="info-orden-label">
                                Nombre
                            </span>

                            <div className="info-orden-dato">
                                <img
                                    src={img_presupuesto}
                                    alt=""
                                />

                                <span>
                                    {orden.presupuesto.nombre}
                                </span>
                            </div>
                        </div>

                        <div className="info-orden-item info-orden-completo">
                            <span className="info-orden-label">
                                Descripción
                            </span>

                            <div className="info-orden-texto">
                                {orden.presupuesto.descripcion ||
                                    "Sin descripción"}
                            </div>
                        </div>

                        <div className="info-orden-item">
                            <span className="info-orden-label">
                                Precio total
                            </span>

                            <div className="info-orden-dato">
                                <img src={img_precio} alt="" />

                                <span>
                                    {formatearPrecio(
                                        orden.presupuesto.precioTotal
                                    )}
                                </span>
                            </div>
                        </div>

                    </div>

                ) : (

                    <div className="info-orden-vacio">
                        No hay un presupuesto asociado a esta orden.
                    </div>

                )}

            </div>


            {/* =========================
                TRABAJOS
            ========================= */}

            <div className="info-orden-seccion">

                <div className="info-orden-seccion-header">
                    <h3 className="info-orden-titulo">
                        Trabajos
                    </h3>

                    <span className="info-orden-contador">
                        {orden.trabajos?.length || 0}
                    </span>
                </div>

                {orden.trabajos?.length > 0 ? (

                    <div className="info-orden-lista">

                        {orden.trabajos.map((trabajo) => (

                            <div
                                className="info-orden-card"
                                key={trabajo.id}
                            >

                                <div className="info-orden-card-header">

                                    <div className="info-orden-card-titulo">
                                        <img
                                            src={img_trabajo}
                                            alt=""
                                        />

                                        <span>
                                            {trabajo.descripcion}
                                        </span>
                                    </div>

                                    <span className="info-orden-card-precio">
                                        {formatearPrecio(
                                            trabajo.precio
                                        )}
                                    </span>

                                </div>

                                <div className="info-orden-card-datos">

                                    <div>
                                        <span className="info-orden-label">
                                            Estado
                                        </span>

                                        <span>
                                            {trabajo.estado}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="info-orden-label">
                                            Empleado
                                        </span>

                                        <span className="info-orden-empleado">
                                            <img
                                                src={img_empleado}
                                                alt=""
                                            />

                                            {trabajo.empleado}
                                        </span>
                                    </div>

                                    {trabajo.tipoTrabajo && (
                                        <div>
                                            <span className="info-orden-label">
                                                Tipo
                                            </span>

                                            <span>
                                                {trabajo.tipoTrabajo}
                                            </span>
                                        </div>
                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                ) : (

                    <div className="info-orden-vacio">
                        No hay trabajos asociados a esta orden.
                    </div>

                )}

            </div>


            {/* =========================
                REPUESTOS
            ========================= */}

            <div className="info-orden-seccion">

                <div className="info-orden-seccion-header">
                    <h3 className="info-orden-titulo">
                        Repuestos utilizados
                    </h3>

                    <span className="info-orden-contador">
                        {orden.repuestos?.length || 0}
                    </span>
                </div>

                {orden.repuestos?.length > 0 ? (

                    <div className="info-orden-lista">

                        {orden.repuestos.map((repuesto) => (

                            <div
                                className="info-orden-card"
                                key={repuesto.id}
                            >

                                <div className="info-orden-card-header">

                                    <div className="info-orden-card-titulo">
                                        <img
                                            src={img_repuestos}
                                            alt=""
                                        />

                                        <span>
                                            {repuesto.nombre}
                                        </span>
                                    </div>

                                    <span className="info-orden-card-precio">
                                        {formatearPrecio(
                                            repuesto.precio *
                                            (repuesto.cantidad || 1)
                                        )}
                                    </span>

                                </div>

                                <div className="info-orden-card-datos">

                                    <div>
                                        <span className="info-orden-label">
                                            Cantidad
                                        </span>

                                        <span>
                                            {repuesto.cantidad || 1}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="info-orden-label">
                                            Precio unitario
                                        </span>

                                        <span>
                                            {formatearPrecio(
                                                repuesto.precio
                                            )}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="info-orden-label">
                                            Subtotal
                                        </span>

                                        <span>
                                            {formatearPrecio(
                                                repuesto.precio *
                                                (repuesto.cantidad || 1)
                                            )}
                                        </span>
                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                ) : (

                    <div className="info-orden-vacio">
                        No hay repuestos utilizados en esta orden.
                    </div>

                )}

            </div>


            {/* =========================
                RESUMEN
            ========================= */}

            <div className="info-orden-resumen">

                <div className="info-orden-resumen-item">
                    <span>
                        Total trabajos
                    </span>

                    <strong>
                        {formatearPrecio(
                            orden.trabajos?.reduce(
                                (total, trabajo) =>
                                    total + Number(trabajo.precio || 0),
                                0
                            )
                        )}
                    </strong>
                </div>

                <div className="info-orden-resumen-item">
                    <span>
                        Total repuestos
                    </span>

                    <strong>
                        {formatearPrecio(
                            orden.repuestos?.reduce(
                                (total, repuesto) =>
                                    total +
                                    Number(repuesto.precio || 0) *
                                    (repuesto.cantidad || 1),
                                0
                            )
                        )}
                    </strong>
                </div>

                <div className="info-orden-resumen-total">
                    <span>
                        Total de la orden
                    </span>

                    <strong>
                        {formatearPrecio(
                            orden.total
                        )}
                    </strong>
                </div>

            </div>

        </div>
    );
}

export default MasInfo;