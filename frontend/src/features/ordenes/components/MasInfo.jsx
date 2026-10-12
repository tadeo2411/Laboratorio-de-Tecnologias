import { useEffect, useState } from "react";
import img_auto from "../../../assets/icons/img_auto.png";
import img_estado from "../../../assets/icons/img_estado.svg";
import img_diagnostico from "../../../assets/icons/img_diagnostico.svg";
import img_garantia from "../../../assets/icons/img_garantia.svg";
import img_service from "../../../assets/icons/img_trabajo.svg";
import img_urgencia from "../../../assets/icons/img_urgencia.svg";
import img_trabajo from "../../../assets/icons/img_trabajo.svg";
import img_repuestos from "../../../assets/icons/img_repuestos.svg";
import { obtenerDetalleOrden } from "../services/ordenesService";
import { TIPOS_ITEM, formatearFecha, formatearPrecio } from "../utils/presupuestosVista";
import PresupuestosOrden from "./PresupuestosOrden.jsx";

// Los datos generales se muestran con la orden que llega por props (ya está en la lista).
// El resto (vehículo, presupuestos, trabajos, repuestos y totales) lo arma el servicio.
function MasInfo({ orden }) {
    const [detalle, setDetalle] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    // El useEffect y los estados quedan en el componente porque son de React:
    // guardan lo que llega del servicio para volver a dibujar la pantalla.
    useEffect(() => {
        let activo = true;

        async function cargarDetalle() {
            try {
                const detalleOrden = await obtenerDetalleOrden(orden.id);
                if (activo) setDetalle(detalleOrden);
            } catch (errorCarga) {
                if (activo) setError(errorCarga.message);
            } finally {
                if (activo) setCargando(false);
            }
        }
        cargarDetalle();

        return () => {
            activo = false;
        };
    }, [orden.id]);

    const presupuestos = detalle?.presupuestos ?? [];
    const trabajos = detalle?.trabajos ?? [];
    const repuestos = detalle?.repuestos ?? [];
    const vehiculo = detalle?.vehiculo;

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
                                {vehiculo
                                    ? `${vehiculo.marca} ${vehiculo.modelo} · ${vehiculo.patente}`
                                    : cargando ? "Cargando..." : "Vehículo no encontrado"}
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
                                {orden.garantiaHasta
                                    ? `Hasta el ${formatearFecha(orden.garantiaHasta)}`
                                    : "Sin garantía"}
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
                PRESUPUESTOS
            ========================= */}

            <PresupuestosOrden presupuestos={presupuestos} cargando={cargando} error={error} />


            {/* =========================
                TRABAJOS (de presupuestos aprobados)
            ========================= */}

            <div className="info-orden-seccion">

                <div className="info-orden-seccion-header">
                    <h3 className="info-orden-titulo">
                        Trabajos
                    </h3>

                    <span className="info-orden-contador">
                        {trabajos.length}
                    </span>
                </div>

                {trabajos.length > 0 ? (

                    <div className="info-orden-lista">

                        {trabajos.map((trabajo) => (

                            <div
                                className="info-orden-card"
                                key={trabajo.clave}
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
                                        {formatearPrecio(trabajo.precioTotal)}
                                    </span>

                                </div>

                                <div className="info-orden-card-datos">

                                    <div>
                                        <span className="info-orden-label">
                                            Tipo
                                        </span>

                                        <span>
                                            {TIPOS_ITEM[trabajo.tipo] ?? trabajo.tipo}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="info-orden-label">
                                            Cantidad
                                        </span>

                                        <span>
                                            {trabajo.cantidad}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="info-orden-label">
                                            Presupuesto
                                        </span>

                                        <span>
                                            {trabajo.numeroPresupuesto}
                                        </span>
                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                ) : (

                    <div className="info-orden-vacio">
                        No hay trabajos en presupuestos aprobados.
                    </div>

                )}

            </div>


            {/* =========================
                REPUESTOS (de presupuestos aprobados)
            ========================= */}

            <div className="info-orden-seccion">

                <div className="info-orden-seccion-header">
                    <h3 className="info-orden-titulo">
                        Repuestos utilizados
                    </h3>

                    <span className="info-orden-contador">
                        {repuestos.length}
                    </span>
                </div>

                {repuestos.length > 0 ? (

                    <div className="info-orden-lista">

                        {repuestos.map((repuesto) => (

                            <div
                                className="info-orden-card"
                                key={repuesto.clave}
                            >

                                <div className="info-orden-card-header">

                                    <div className="info-orden-card-titulo">
                                        <img
                                            src={img_repuestos}
                                            alt=""
                                        />

                                        <span>
                                            {repuesto.descripcion}
                                        </span>
                                    </div>

                                    <span className="info-orden-card-precio">
                                        {formatearPrecio(repuesto.precioTotal)}
                                    </span>

                                </div>

                                <div className="info-orden-card-datos">

                                    <div>
                                        <span className="info-orden-label">
                                            Cantidad
                                        </span>

                                        <span>
                                            {repuesto.cantidad}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="info-orden-label">
                                            Precio unitario
                                        </span>

                                        <span>
                                            {formatearPrecio(repuesto.precioUnitario)}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="info-orden-label">
                                            Presupuesto
                                        </span>

                                        <span>
                                            {repuesto.numeroPresupuesto}
                                        </span>
                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                ) : (

                    <div className="info-orden-vacio">
                        No hay repuestos en presupuestos aprobados.
                    </div>

                )}

            </div>


            {/* =========================
                RESUMEN (de presupuestos aprobados)
            ========================= */}

            <div className="info-orden-resumen">

                <div className="info-orden-resumen-item">
                    <span>
                        Total trabajos
                    </span>

                    <strong>
                        {formatearPrecio(detalle?.totalTrabajos)}
                    </strong>
                </div>

                <div className="info-orden-resumen-item">
                    <span>
                        Total repuestos
                    </span>

                    <strong>
                        {formatearPrecio(detalle?.totalRepuestos)}
                    </strong>
                </div>

                <div className="info-orden-resumen-total">
                    <span>
                        Total de la orden
                    </span>

                    <strong>
                        {formatearPrecio(detalle?.total)}
                    </strong>
                </div>

            </div>

        </div>
    );
}

export default MasInfo;
