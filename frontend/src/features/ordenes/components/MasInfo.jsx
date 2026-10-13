import img_auto from "../../../assets/icons/img_auto.png";
import img_estado from "../../../assets/icons/img_estado.svg";
import img_diagnostico from "../../../assets/icons/img_diagnostico.svg";
import img_garantia from "../../../assets/icons/img_garantia.svg";
import img_service from "../../../assets/icons/img_trabajo.svg";
import img_urgencia from "../../../assets/icons/img_urgencia.svg";
import img_trabajo from "../../../assets/icons/img_trabajo.svg";
import img_empleado from "../../../assets/icons/img_empleado.svg";
import img_repuestos from "../../../assets/icons/img_repuestos.svg";
import img_orden from "../../../assets/icons/img_orden.svg";
import img_calender from "../../../assets/icons/img_calender.svg";
import { useState } from "react";
import EtiquetaEstado from "./EtiquetaEstado.jsx";
import TrabajoForm from "./TrabajoForm.jsx";
import PresupuestosOrden from "./PresupuestosOrden.jsx";
import AprobadoOrden from "./AprobadoOrden.jsx";
import { permiteModificarTrabajos } from "../utils/estados";
import {
    numeroOrden,
    formatearFecha,
    formatearPrecio,
    fechaIngreso,
    fechaEgreso,
    textoGarantia,
    describirVehiculo,
    repuestosDeLaOrden,
    totalManoDeObra,
    totalRepuestos
} from "../utils/ordenes";

function MasInfo({ orden, vehiculos, tiposTrabajo, repuestos, empleados, onAgregarTrabajo, onQuitarTrabajo }) {

    const [agregandoTrabajo, setAgregandoTrabajo] = useState(false);
    const [errorTrabajos, setErrorTrabajos] = useState("");
    const repuestosUsados = repuestosDeLaOrden(orden);
    const sePuedenModificarTrabajos = permiteModificarTrabajos(orden.estado);

    async function guardarTrabajo(trabajo){
        await onAgregarTrabajo(orden.id, trabajo);
        setAgregandoTrabajo(false);
    }

    async function quitarTrabajo(trabajo){
        if (!window.confirm(`¿Quitar el trabajo "${trabajo.tipoTrabajo}"?`)) return;

        setErrorTrabajos("");
        try {
            await onQuitarTrabajo(orden.id, trabajo.id);
        } catch (errorQuitar) {
            setErrorTrabajos(errorQuitar.message);
        }
    }

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

                    {/* Número */}
                    <div className="info-orden-item">
                        <span className="info-orden-label">
                            Número
                        </span>

                        <div className="info-orden-dato">
                            <img src={img_orden} alt="" />
                            <span>
                                {numeroOrden(orden.id)}
                            </span>
                        </div>
                    </div>

                    {/* Vehículo */}
                    <div className="info-orden-item">
                        <span className="info-orden-label">
                            Vehículo
                        </span>

                        <div className="info-orden-dato">
                            <img src={img_auto} alt="" style={{filter: "brightness(0) saturate(100%) invert(12%) sepia(9%) saturate(1138%) hue-rotate(230deg) brightness(91%) contrast(92%)"}} />
                            <span>
                                {orden.vehiculoPatente} - {describirVehiculo(vehiculos, orden.vehiculoPatente)}
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
                            <EtiquetaEstado estado={orden.estado} />
                        </div>
                    </div>

                    {/* Turno */}
                    <div className="info-orden-item">
                        <span className="info-orden-label">
                            Turno
                        </span>

                        <div className="info-orden-dato">
                            <img src={img_calender} alt="" />
                            <span>
                                {orden.turnoId ?? "Sin turno"}
                            </span>
                        </div>
                    </div>

                    {/* Ingreso */}
                    <div className="info-orden-item">
                        <span className="info-orden-label">
                            Ingreso
                        </span>

                        <div className="info-orden-dato">
                            <img src={img_calender} alt="" />
                            <span>
                                {formatearFecha(fechaIngreso(orden))}
                            </span>
                        </div>
                    </div>

                    {/* Egreso */}
                    <div className="info-orden-item">
                        <span className="info-orden-label">
                            Egreso
                        </span>

                        <div className="info-orden-dato">
                            <img src={img_calender} alt="" />
                            <span>
                                {fechaEgreso(orden) ? formatearFecha(fechaEgreso(orden)) : "Todavía en el taller"}
                            </span>
                        </div>
                    </div>

                    {/* Garantía */}
                    <div className="info-orden-item info-orden-completo">
                        <span className="info-orden-label">
                            Garantía
                        </span>

                        <div className="info-orden-dato">
                            <img src={img_garantia} alt="" />
                            <span>
                                {textoGarantia(orden)}
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
                FICHAS
            ========================= */}

            <div className="info-orden-seccion">

                <div className="info-orden-seccion-header">
                    <h3 className="info-orden-titulo">
                        Fichas
                    </h3>

                    <span className="info-orden-contador">
                        {orden.fichas.length}
                    </span>
                </div>

                {orden.fichas.length > 0 ? (

                    <div className="info-orden-lista">

                        {orden.fichas.map((ficha) => (

                            <div
                                className="info-orden-card"
                                key={ficha.id}
                            >

                                <div className="info-orden-card-header">

                                    <div className="info-orden-card-titulo">
                                        <img
                                            src={img_estado}
                                            alt=""
                                        />

                                        <span>
                                            {ficha.tipo === "INGRESO" ? "Ficha de ingreso" : "Ficha de egreso"}
                                        </span>
                                    </div>

                                    <span className="info-orden-card-precio">
                                        {formatearFecha(ficha.fecha)}
                                    </span>

                                </div>

                                <div className="info-orden-card-datos">

                                    <div>
                                        <span className="info-orden-label">
                                            Kilometraje
                                        </span>

                                        <span>
                                            {ficha.kilometraje.toLocaleString("es-AR")} km
                                        </span>
                                    </div>

                                    <div>
                                        <span className="info-orden-label">
                                            Conformidad del cliente
                                        </span>

                                        <span>
                                            {ficha.conformidad === "APROBADA" ? "Aprobada" : "Pendiente"}
                                        </span>
                                    </div>

                                    {ficha.items.map((item) => (
                                        <div key={item.id}>
                                            <span className="info-orden-label">
                                                {item.concepto}
                                            </span>

                                            <span>
                                                {item.valor}
                                            </span>
                                        </div>
                                    ))}

                                </div>

                            </div>

                        ))}

                    </div>

                ) : (

                    <div className="info-orden-vacio">
                        Todavía no se cargó la ficha de ingreso.
                    </div>

                )}

            </div>


            {/* =========================
                APROBADO POR EL CLIENTE
            ========================= */}

            <AprobadoOrden ordenId={orden.id} />


            {/* =========================
                PRESUPUESTOS
            ========================= */}

            <PresupuestosOrden ordenId={orden.id} />


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

                {errorTrabajos && <p className="alert alert-danger" role="alert">{errorTrabajos}</p>}

                {sePuedenModificarTrabajos && !agregandoTrabajo && (
                    <button
                        type="button"
                        className="btn btn-outline-success info-orden-agregar"
                        onClick={() => setAgregandoTrabajo(true)}
                    >
                        + Agregar trabajo
                    </button>
                )}

                {orden.estado === "RECIBIDO" && (
                    <p className="info-orden-ayuda">
                        Para cargar trabajos, primero pasá la orden a "Diagnosticando" desde Editar.
                    </p>
                )}

                {agregandoTrabajo && (
                    <TrabajoForm
                        tiposTrabajo={tiposTrabajo}
                        repuestos={repuestos}
                        empleados={empleados}
                        onGuardar={guardarTrabajo}
                        onCancelar={() => setAgregandoTrabajo(false)}
                    />
                )}

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
                                            {trabajo.tipoTrabajo}
                                        </span>
                                    </div>

                                    <span className="info-orden-card-precio">
                                        {formatearPrecio(
                                            trabajo.manoDeObra
                                        )}
                                    </span>

                                </div>

                                <div className="info-orden-card-datos">

                                    <div>
                                        <span className="info-orden-label">
                                            Descripción
                                        </span>

                                        <span>
                                            {trabajo.descripcion || "Sin descripción"}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="info-orden-label">
                                            Empleados
                                        </span>

                                        <span className="info-orden-empleado">
                                            <img
                                                src={img_empleado}
                                                alt=""
                                            />

                                            {trabajo.empleados.length > 0
                                                ? trabajo.empleados.map(empleado => empleado.nombre).join(", ")
                                                : "Sin asignar"}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="info-orden-label">
                                            Repuestos
                                        </span>

                                        <span>
                                            {trabajo.repuestos.length}
                                        </span>
                                    </div>

                                </div>

                                {sePuedenModificarTrabajos && (
                                    <div className="info-orden-card-acciones">
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => quitarTrabajo(trabajo)}
                                        >
                                            Quitar trabajo
                                        </button>
                                    </div>
                                )}

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
                        {repuestosUsados.length}
                    </span>
                </div>

                {repuestosUsados.length > 0 ? (

                    <div className="info-orden-lista">

                        {repuestosUsados.map((repuesto) => (

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
                                            repuesto.precioUnitario *
                                            repuesto.cantidad
                                        )}
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
                                            {formatearPrecio(
                                                repuesto.precioUnitario
                                            )}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="info-orden-label">
                                            Subtotal
                                        </span>

                                        <span>
                                            {formatearPrecio(
                                                repuesto.precioUnitario *
                                                repuesto.cantidad
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
                        Total mano de obra
                    </span>

                    <strong>
                        {formatearPrecio(totalManoDeObra(orden))}
                    </strong>
                </div>

                <div className="info-orden-resumen-item">
                    <span>
                        Total repuestos
                    </span>

                    <strong>
                        {formatearPrecio(totalRepuestos(orden))}
                    </strong>
                </div>

                <div className="info-orden-resumen-total">
                    <span>
                        Total de la orden
                    </span>

                    <strong>
                        {formatearPrecio(totalManoDeObra(orden) + totalRepuestos(orden))}
                    </strong>
                </div>

            </div>

        </div>
    );
}

export default MasInfo;