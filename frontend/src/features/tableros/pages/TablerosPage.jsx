import { useEffect, useState } from "react";
import Tarjeta from "../components/Tarjeta";
import "../TablerosPage.css"
import img_auto from "../../../assets/icons/img_auto.png"
import img_correcto from "../../../assets/icons/img_correcto.png"
import img_presupuesto from "../../../assets/icons/img_presupuesto.png"
import BarraDeCantidades from "../components/BarraDeCantidades";
import { obtenerOrdenes } from "../services/tablerosService"

function TablerosPage() {
    const [ordenes, setOrdenes] = useState([]);
    const [diagnosticando, setDiagnosticando] = useState(0);
    const [esperandoAprobacion, setEsperandoAprobacion] = useState(0);
    const [enReparacion, setEnReparacion] = useState(0);
    const [terminado, setTerminado] = useState(0);
    const [esperandoRepuesto, setEsperandoRepuesto] = useState(0);

    useEffect(() => {
        async function pedirOrdenes() {
            const ordenes = await obtenerOrdenes();
            setOrdenes(ordenes);

            setDiagnosticando(
                ordenes.filter(orden => orden.estado === "DIAGNOSTICANDO").length
            );

            setEsperandoRepuesto(
                ordenes.filter(
                    orden => orden.estado === "ESPERANDO_REPUESTO"
                ).length
            );

            setEsperandoAprobacion(
                ordenes.filter(
                    orden => orden.estado === "ESPERANDO_APROBACION_PRESUPUESTO"
                ).length
            );

            setEnReparacion(
                ordenes.filter(orden => orden.estado === "EN_REPARACION").length
            );

            setTerminado(
                ordenes.filter(orden => orden.estado === "TERMINADO").length
            );
        }
        pedirOrdenes();
    }, []);

    return (
        <div className="contenedorMetricas">
            <div className="contenedorTarjetas">
                <Tarjeta nombre="Vehiculos en el taller" cantidad={ordenes.length} imagen={img_auto} filtro={"brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(1800%) hue-rotate(205deg) brightness(88%) contrast(100%)"} />
                <Tarjeta nombre="Presupuestos sin respuesta" cantidad={esperandoAprobacion + esperandoRepuesto} imagen={img_presupuesto} filtro={"brightness(0) saturate(100%) invert(78%) sepia(92%) saturate(1065%) hue-rotate(359deg) brightness(93%) contrast(101%)"} />
                <Tarjeta nombre="Listos para retirar" cantidad={terminado} imagen={img_correcto} filtro={"brightness(0) saturate(100%) invert(49%) sepia(87%) saturate(550%) hue-rotate(92deg) brightness(92%) contrast(101%)"} />
            </div>
            <div className="vehiculosPorEstado">
                <h2>Vehículos por estado</h2>
                <BarraDeCantidades nombre={"Diagnosticando"} cantidad={diagnosticando}
                    cantidadTotal={ordenes.length}
                    color="#ff5050" />
                <BarraDeCantidades nombre={"Esperando aprobación"} cantidad={esperandoAprobacion}
                    cantidadTotal={ordenes.length}
                    color="#d0e700" />
                <BarraDeCantidades nombre={"Esperando repuesto"} cantidad={esperandoRepuesto}
                    cantidadTotal={ordenes.length}
                    color="#14a1ff" />
                <BarraDeCantidades nombre={"En reparación"} cantidad={enReparacion}
                    cantidadTotal={ordenes.length}
                    color="#eafd3c" />
                <BarraDeCantidades nombre={"Terminados"} cantidad={terminado}
                    cantidadTotal={ordenes.length}
                    color="#2E9B3F" />
            </div>
        </div>
    );
}

export default TablerosPage;