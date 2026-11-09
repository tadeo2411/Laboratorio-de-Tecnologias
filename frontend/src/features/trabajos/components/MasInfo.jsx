
import img_orden from "../../../assets/icons/img_orden.svg";
import img_estado from "../../../assets/icons/img_estado.svg";
import img_trabajo from "../../../assets/icons/img_trabajo.svg";
import img_empleado from "../../../assets/icons/img_empleado.svg";
import img_precio from "../../../assets/icons/img_precio.svg";
import img_repuestos from "../../../assets/icons/img_repuestos.svg";
import img_calendario from "../../../assets/icons/img_calender.svg";

function TrabajoInfo({ trabajo }) {

    if (!trabajo) return null;

    const empleados = Array.isArray(trabajo.empleados)
        ? trabajo.empleados
        : [];

    const repuestos = Array.isArray(trabajo.repuestos)
        ? trabajo.repuestos
        : [];

    const numero = (valor) => {
        const resultado = Number(valor);
        return Number.isFinite(resultado) ? resultado : 0;
    };

    const formatoPrecio = (valor) =>
        numero(valor).toLocaleString("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    const manoDeObra = numero(trabajo.mano_de_obra);
    const totalRepuestos = numero(trabajo.total_repuestos);
    const total = numero(trabajo.total);

    const fecha = trabajo.fecha
        ? new Date(trabajo.fecha)
        : null;

    const fechaValida = fecha && !isNaN(fecha.getTime());

    return (
        <div className="info-trabajo">

            <div className="info-trabajo-grid">

                {/* Fecha */}
                <div className="info-trabajo-item">
                    <span className="info-trabajo-label">
                        Fecha
                    </span>

                    <div className="info-trabajo-dato">
                        <img src={img_calendario} alt="" />
                        <span>
                            {fechaValida
                                ? fecha.toLocaleDateString("es-AR")
                                : "-"}
                        </span>
                    </div>
                </div>

                {/* Orden */}
                <div className="info-trabajo-item">
                    <span className="info-trabajo-label">
                        Orden de trabajo
                    </span>

                    <div className="info-trabajo-dato">
                        <img src={img_orden} alt="" />
                        <span>#{trabajo.orden_id}</span>
                    </div>
                </div>

                {/* Descripción */}
                <div className="info-trabajo-item info-trabajo-completo">
                    <span className="info-trabajo-label">
                        Descripción
                    </span>

                    <div className="info-trabajo-descripcion">
                        {trabajo.descripcion || "-"}
                    </div>
                </div>

                {/* Tipo de trabajo */}
                <div className="info-trabajo-item">
                    <span className="info-trabajo-label">
                        Tipo de trabajo
                    </span>

                    <div className="info-trabajo-dato">
                        <img src={img_trabajo} alt="" />
                        <span>
                            {trabajo.tipo_trabajo || trabajo.tipo_trabajo_id || "-"}
                        </span>
                    </div>
                </div>

                {/* Empleados */}
                <div className="info-trabajo-item">
                    <span className="info-trabajo-label">
                        Empleados asignados
                    </span>

                    <div className="info-trabajo-dato">
                        <img src={img_empleado} alt="" />

                        <div className="info-trabajo-empleados">
                            {empleados.length > 0
                                ? empleados.map((empleado) => (
                                    <span key={empleado.id}>
                                        {empleado.nombre}
                                    </span>
                                ))
                                : "-"}
                        </div>
                    </div>
                </div>

                {/* Estado */}
                <div className="info-trabajo-item">
                    <span className="info-trabajo-label">
                        Estado
                    </span>

                    <div className="info-trabajo-dato">
                        <img src={img_estado} alt="" />
                        <span>
                            {trabajo.estado || "-"}
                        </span>
                    </div>
                </div>

                {/* Mano de obra */}
                <div className="info-trabajo-item">
                    <span className="info-trabajo-label">
                        Mano de obra
                    </span>

                    <div className="info-trabajo-dato">
                        <img src={img_precio} alt="" />
                        <span>
                            ${formatoPrecio(manoDeObra)}
                        </span>
                    </div>
                </div>

                {/* Repuestos */}
                <div className="info-trabajo-item info-trabajo-completo">
                    <span className="info-trabajo-label">
                        Repuestos utilizados
                    </span>

                    <div className="info-trabajo-dato">
                        <img src={img_repuestos} alt="" />
                        <span>
                            {repuestos.length} repuestos utilizados
                        </span>
                    </div>

                    {repuestos.length > 0 && (
                        <div className="info-trabajo-repuestos">
                            {repuestos.map((repuesto, index) => {
                                const subtotal =
                                    numero(repuesto.precio_unitario) *
                                    numero(repuesto.cantidad);

                                return (
                                    <div
                                        className="info-trabajo-repuesto"
                                        key={repuesto.id || index}
                                    >
                                        <div>
                                            <strong>
                                                {repuesto.nombre ||
                                                    repuesto.descripcion ||
                                                    `Repuesto ${index + 1}`}
                                            </strong>

                                            <span>
                                                Cantidad: {repuesto.cantidad}
                                            </span>

                                            <span>
                                                Precio unitario: $
                                                {formatoPrecio(repuesto.precio_unitario)}
                                            </span>
                                        </div>

                                        <strong>
                                            ${formatoPrecio(repuesto.subtotal)}
                                        </strong>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Total de repuestos */}
                <div className="info-trabajo-item">
                    <span className="info-trabajo-label">
                        Total repuestos
                    </span>

                    <div className="info-trabajo-dato">
                        <img src={img_repuestos} alt="" />
                        <span>
                            ${formatoPrecio(totalRepuestos)}
                        </span>
                    </div>
                </div>

                {/* Total */}
                <div className="info-trabajo-item info-trabajo-total">
                    <span className="info-trabajo-label">
                        Total del trabajo
                    </span>

                    <span className="info-trabajo-total-valor">
                        ${formatoPrecio(total)}
                    </span>
                </div>

            </div>
        </div>
    );
}

export default TrabajoInfo;
