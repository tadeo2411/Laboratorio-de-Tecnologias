import img_orden from "../../../assets/icons/img_orden.svg";
import img_estado from "../../../assets/icons/img_estado.svg";
import img_trabajo from "../../../assets/icons/img_trabajo.svg";
import img_empleado from "../../../assets/icons/img_empleado.svg";
import img_precio from "../../../assets/icons/img_precio.svg";
import img_repuestos from "../../../assets/icons/img_repuestos.svg";
import img_calendario from "../../../assets/icons/img_calender.svg";

function TrabajoInfo({ trabajo }) {

    return (
        <div className="info-trabajo">

            <div className="info-trabajo-grid">

                <div className="info-trabajo-item">
                    <span className="info-trabajo-label">
                        Fecha
                    </span>

                    <div className="info-trabajo-dato">
                        <img src={img_calendario} alt="" />
                        <span>{trabajo.fecha}</span>
                    </div>
                </div>

                <div className="info-trabajo-item">
                    <span className="info-trabajo-label">
                        Orden de trabajo
                    </span>

                    <div className="info-trabajo-dato">
                        <img src={img_orden} alt="" />
                        <span>#{trabajo.ordenTrabajo}</span>
                    </div>
                </div>

                <div className="info-trabajo-item info-trabajo-completo">
                    <span className="info-trabajo-label">
                        Descripción
                    </span>

                    <div className="info-trabajo-descripcion">
                        {trabajo.descripcion}
                    </div>
                </div>

                <div className="info-trabajo-item">
                    <span className="info-trabajo-label">
                        Tipo de trabajo
                    </span>

                    <div className="info-trabajo-dato">
                        <img src={img_trabajo} alt="" />
                        <span>{trabajo.tipoTrabajo}</span>
                    </div>
                </div>

                <div className="info-trabajo-item">
                    <span className="info-trabajo-label">
                        Empleado
                    </span>

                    <div className="info-trabajo-dato">
                        <img src={img_empleado} alt="" />
                        <span>{trabajo.empleado}</span>
                    </div>
                </div>

                <div className="info-trabajo-item">
                    <span className="info-trabajo-label">
                        Estado
                    </span>

                    <div className="info-trabajo-dato">
                        <img
                            style={{
                                filter:
                                    "brightness(0) saturate(100%) invert(49%) sepia(87%) saturate(550%) hue-rotate(92deg) brightness(92%) contrast(101%)"
                            }}
                            src={img_estado}
                            alt=""
                        />
                        <span>{trabajo.estado}</span>
                    </div>
                </div>

                <div className="info-trabajo-item">
                    <span className="info-trabajo-label">
                        Precio del trabajo
                    </span>

                    <div className="info-trabajo-dato">
                        <img src={img_precio} alt="" />
                        <span>
                            ${trabajo.precio.toLocaleString("es-AR")}
                        </span>
                    </div>
                </div>

                <div className="info-trabajo-item">
                    <span className="info-trabajo-label">
                        Repuestos utilizados
                    </span>

                    <div className="info-trabajo-dato">
                        <img src={img_repuestos} alt="" />
                        <span>
                            ${trabajo.repuestos.toLocaleString("es-AR")}
                        </span>
                    </div>
                </div>

                <div className="info-trabajo-item info-trabajo-total">
                    <span className="info-trabajo-label">
                        Total
                    </span>

                    <span className="info-trabajo-total-valor">
                        ${trabajo.total.toLocaleString("es-AR")}
                    </span>
                </div>

            </div>

        </div>
    );
}

export default TrabajoInfo;