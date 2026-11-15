import { useCallback, useEffect, useState } from "react";
import BarraDeCantidades from "../components/BarraDeCantidades";
import Spinner from "../../../shared/components/Spinner";
import { esAdministrador, obtenerSesion } from "../../auth";
import {
    ordenesActivas,
    ordenesXMeses,
    infoFinanciera,
    proximosTurnos,
} from "../services/tablerosService";
import "../TablerosPage.css";
import "../../estilos.css";

const OPCIONES_MESES = [
    { valor: 1, etiqueta: "1M" },
    { valor: 3, etiqueta: "3M" },
    { valor: 6, etiqueta: "6M" },
    { valor: 12, etiqueta: "12M" },
    { valor: 24, etiqueta: "24M" },
];

const formatearMoneda = (monto) =>
    new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(Number(monto) || 0);

const formatearFechaTurno = (fechaIso) => {
    if (!fechaIso) return { fecha: "-", hora: "-" };
    const fechaObj = new Date(fechaIso);
    if (Number.isNaN(fechaObj.getTime())) return { fecha: "-", hora: "-" };

    return {
        fecha: new Intl.DateTimeFormat("es-AR", {
            weekday: "short",
            day: "2-digit",
            month: "short",
        }).format(fechaObj),
        hora: new Intl.DateTimeFormat("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).format(fechaObj),
    };
};

function TablerosPage() {

    const sesion = obtenerSesion()
    const esAdmin = esAdministrador(sesion)

    const [activas, setActivas] = useState({
        recibidos: 0,
        diagnosticando: 0,
        esperandoP: 0,
        esperandoR: 0,
        reparando: 0,
        terminados: 0,
    });
    const [resumenMeses, setResumenMeses] = useState({
        cantEntregados: 0,
        cantCancelados: 0,
    });
    const [finanzas, setFinanzas] = useState({
        ordenes_finalizadas: 0,
        total_mano_de_obra: 0,
        total_repuestos: 0,
        total_ingresos: 0,
    });
    const [turnos, setTurnos] = useState([]);

    const [mesesFiltro, setMesesFiltro] = useState(3);
    const [cargando, setCargando] = useState(true);
    const [cargandoMeses, setCargandoMeses] = useState(false);
    const [error, setError] = useState(null);

    

    const cargarTablero = useCallback(
        async (meses = 3) => {
            setCargando(true);
            setError(null);
            try {
                const [datosActivas, datosTurnos, datosResumen, datosFinanzas] = await Promise.all([
                    ordenesActivas(),
                    proximosTurnos(),
                    esAdmin ? ordenesXMeses(meses) : Promise.resolve(null),
                    esAdmin ? infoFinanciera() : Promise.resolve(null),
                    
                ]);
                if (datosActivas) setActivas(datosActivas);
                if (datosTurnos) setTurnos(Array.isArray(datosTurnos) ? datosTurnos : []);
                if (datosResumen) setResumenMeses(datosResumen);
                if (datosFinanzas) setFinanzas(datosFinanzas);
                
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "No se pudieron cargar los datos del tablero."
                );
            } finally {
                setCargando(false);
            }
        },
        [esAdmin]
    );

    useEffect(() => {
        let activo = true;
        async function cargarInicial() {
            try {
                const [datosActivas, datosTurnos, datosResumen, datosFinanzas] = await Promise.all([
                    ordenesActivas(),
                    proximosTurnos(),
                    esAdmin ? ordenesXMeses(3) : Promise.resolve(null),
                    esAdmin ? infoFinanciera() : Promise.resolve(null),
                ]);

                if (activo) {
                    if (datosActivas) setActivas(datosActivas);
                    if (datosTurnos) setTurnos(Array.isArray(datosTurnos) ? datosTurnos : []);
                    if (datosResumen) setResumenMeses(datosResumen);
                    if (datosFinanzas) setFinanzas(datosFinanzas);
                }
            } catch (err) {
                if (activo) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "No se pudieron cargar los datos del tablero."
                    );
                }
            } finally {
                if (activo) setCargando(false);
            }
        }
        cargarInicial();
        return () => {
            activo = false;
        };
    }, [esAdmin]);

    async function handleCambiarMeses(nuevoMes) {
        if (!esAdmin || nuevoMes === mesesFiltro || cargandoMeses) return;
        setMesesFiltro(nuevoMes);
        setCargandoMeses(true);
        try {
            const datos = await ordenesXMeses(nuevoMes);
            if (datos) setResumenMeses(datos);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo actualizar el período."
            );
        } finally {
            setCargandoMeses(false);
        }
    }

    

    const totalEnTaller =
        (activas.recibidos ?? 0) +
        (activas.diagnosticando ?? 0) +
        (activas.esperandoP ?? 0) +
        (activas.esperandoR ?? 0) +
        (activas.reparando ?? 0) +
        (activas.terminados ?? 0);

    const totalManoObra = Number(finanzas.total_mano_de_obra) || 0;
    const totalRepuestos = Number(finanzas.total_repuestos) || 0;
    const totalIngresos = Number(finanzas.total_ingresos) || 0;
    const ordenesFinalizadas = Number(finanzas.ordenes_finalizadas) || 0;

    const porcentajeManoObra =
        totalIngresos > 0 ? Math.round((totalManoObra / totalIngresos) * 100) : 0;
    const porcentajeRepuestos =
        totalIngresos > 0 ? 100 - porcentajeManoObra : 0;
    const ticketPromedio =
        ordenesFinalizadas > 0 ? totalIngresos / ordenesFinalizadas : 0;

    const cantEntregados = Number(resumenMeses.cantEntregados) || 0;
    const cantCancelados = Number(resumenMeses.cantCancelados) || 0;
    const totalPeriodo = cantEntregados + cantCancelados;
    const efectividad =
        totalPeriodo > 0 ? Math.round((cantEntregados / totalPeriodo) * 100) : 0;

    if (cargando) {
        return (
            <div className="tablero-estado-pantalla">
                <Spinner />
                <p>Cargando métricas del taller...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="tablero-estado-pantalla tablero-estado-pantalla--error">
                <p className="tablero-error-texto">{error}</p>
                <button
                    type="button"
                    className="tablero-btn-accion"
                    onClick={() => cargarTablero(mesesFiltro)}
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="tablero-pagina">
            {/* 1. Encabezado */}
            <header className="tablero-encabezado">
                <div>
                    <h1 className="tablero-titulo">Tablero</h1>
                </div>
                
            </header>

            {/* 2. Paneles centrales */}
            <div className={`tablero-grid-central ${!esAdmin ? "tablero-grid-central--completo" : ""}`}>
                {/* Estado del Taller */}
                <section className="tablero-panel">
                    <div className="tablero-panel__cabecera">
                        <h2 className="tablero-panel__titulo">Estado del taller</h2>
                        <span className="tablero-badge-neutro">
                            {totalEnTaller} activos
                        </span>
                    </div>

                    <div className="tablero-lista-barras">
                        <BarraDeCantidades
                            nombre="Recibidos"
                            cantidad={activas.recibidos ?? 0}
                            cantidadTotal={totalEnTaller}
                            color="#64748b"
                        />
                        <BarraDeCantidades
                            nombre="Diagnosticando"
                            cantidad={activas.diagnosticando ?? 0}
                            cantidadTotal={totalEnTaller}
                            color="#ef4444"
                        />
                        <BarraDeCantidades
                            nombre="Esperando presupuesto"
                            cantidad={activas.esperandoP ?? 0}
                            cantidadTotal={totalEnTaller}
                            color="#f59e0b"
                        />
                        <BarraDeCantidades
                            nombre="Esperando repuesto"
                            cantidad={activas.esperandoR ?? 0}
                            cantidadTotal={totalEnTaller}
                            color="#0ea5e9"
                        />
                        <BarraDeCantidades
                            nombre="En reparación"
                            cantidad={activas.reparando ?? 0}
                            cantidadTotal={totalEnTaller}
                            color="#6366f1"
                        />
                        <BarraDeCantidades
                            nombre="Terminados"
                            cantidad={activas.terminados ?? 0}
                            cantidadTotal={totalEnTaller}
                            color="#22c55e"
                        />
                    </div>
                </section>

                {/* Columna derecha: Finanzas + Rendimiento */}
                {esAdmin &&(
                    <div className="tablero-columna-secundaria">
                        {/* Balance Financiero */}
                        <section className="tablero-panel">
                            <div className="tablero-panel__cabecera">
                                <h2 className="tablero-panel__titulo">Balance financiero</h2>
                                <span className="tablero-badge-verde">
                                    Ticket prom. {formatearMoneda(ticketPromedio)}
                                </span>
                            </div>

                            <div className="finanzas-resumen-total">
                                <span className="finanzas-resumen-label">Total facturado</span>
                                <strong className="finanzas-resumen-valor">
                                    {formatearMoneda(totalIngresos)}
                                </strong>
                            </div>

                            {/* Barra comparativa */}
                            <div className="finanzas-barra-compuesta" aria-hidden="true">
                                <div
                                    className="finanzas-barra-mano"
                                    style={{ width: `${porcentajeManoObra}%` }}
                                />
                                <div
                                    className="finanzas-barra-repuestos"
                                    style={{ width: `${porcentajeRepuestos}%` }}
                                />
                            </div>

                            <div className="finanzas-desglose">
                                <div className="finanzas-item">
                                    <span className="finanzas-item__etiqueta">
                                        <span className="finanzas-punto finanzas-punto--mano" />
                                        Mano de obra ({porcentajeManoObra}%)
                                    </span>
                                    <strong className="finanzas-item__monto">
                                        {formatearMoneda(totalManoObra)}
                                    </strong>
                                </div>
                                <div className="finanzas-item">
                                    <span className="finanzas-item__etiqueta">
                                        <span className="finanzas-punto finanzas-punto--repuestos" />
                                        Repuestos ({porcentajeRepuestos}%)
                                    </span>
                                    <strong className="finanzas-item__monto">
                                        {formatearMoneda(totalRepuestos)}
                                    </strong>
                                </div>
                            </div>
                        </section>

                        {/* Rendimiento por Período */}
                        <section className="tablero-panel">
                            <div className="tablero-panel__cabecera tablero-panel__cabecera--wrap">
                                <h2 className="tablero-panel__titulo">Rendimiento</h2>
                                <div className="tablero-selector-meses" role="group" aria-label="Filtrar por meses">
                                    {OPCIONES_MESES.map((opcion) => (
                                        <button
                                            key={opcion.valor}
                                            type="button"
                                            disabled={cargandoMeses}
                                            className={`tablero-mes-btn ${
                                                mesesFiltro === opcion.valor
                                                    ? "tablero-mes-btn--activo"
                                                    : ""
                                            }`}
                                            onClick={() => handleCambiarMeses(opcion.valor)}
                                        >
                                            {opcion.etiqueta}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        <div className={`rendimiento-grid ${cargandoMeses ? "rendimiento-grid--cargando" : ""}`}>
                            <div className="rendimiento-caja rendimiento-caja--exito">
                                <span className="rendimiento-caja__label">Entregadas</span>
                                <strong className="rendimiento-caja__valor">{cantEntregados}</strong>
                            </div>
                            <div className="rendimiento-caja rendimiento-caja--baja">
                                <span className="rendimiento-caja__label">Canceladas</span>
                                <strong className="rendimiento-caja__valor">{cantCancelados}</strong>
                            </div>
                            <div className="rendimiento-caja rendimiento-caja--neutro">
                                <span className="rendimiento-caja__label">Efectividad</span>
                                <strong className="rendimiento-caja__valor">{efectividad}%</strong>
                            </div>
                        </div>
                    </section>
                </div>
                )}
            </div>
                                                           
            {/* 3. Próximos Turnos */}
            <section className="tablero-panel">
                <div className="tablero-panel__cabecera">
                    <div>
                        <h2 className="tablero-panel__titulo">Próximos turnos (15 días)</h2>
                        <p className="tablero-panel__subtitulo">
                            Agenda confirmada y solicitada para las próximas dos semanas
                        </p>
                    </div>
                    <span className="tablero-badge-neutro">
                        {turnos.length} {turnos.length === 1 ? "turno" : "turnos"}
                    </span>
                </div>

                {turnos.length === 0 ? (
                    <div className="tablero-vacio">
                        No hay turnos programados para los próximos 15 días.
                    </div>
                ) : (
                    <div className="turnos-lista">
                        {turnos.map((turno, indice) => {
                            const { fecha, hora } = formatearFechaTurno(turno.fecha_hora);
                            const vehiculoTexto = [turno.marca, turno.modelo]
                                .filter(Boolean)
                                .join(" ");
                            const esConfirmado = turno.estado === "CONFIRMADO";

                            return (
                                <article
                                    key={turno.id ?? `${turno.patente}-${indice}`}
                                    className="turno-card"
                                >
                                    <div className="turno-card__fecha">
                                        <span className="turno-card__dia">{fecha}</span>
                                        <strong className="turno-card__hora">{hora} hs</strong>
                                    </div>

                                    <div className="turno-card__detalle">
                                        <div className="turno-card__cliente-fila">
                                            <strong className="turno-card__cliente">
                                                {turno.nombre}
                                            </strong>
                                            {turno.patente && (
                                                <span className="turno-card__patente">
                                                    {turno.patente}
                                                </span>
                                            )}
                                        </div>
                                        {vehiculoTexto && (
                                            <span className="turno-card__vehiculo">
                                                {vehiculoTexto}
                                            </span>
                                        )}
                                        {turno.motivo && (
                                            <p className="turno-card__motivo">
                                                {turno.motivo}
                                            </p>
                                        )}
                                    </div>

                                    <div className="turno-card__estado-wrap">
                                        <span
                                            className={`turno-card__estado ${
                                                esConfirmado
                                                    ? "turno-card__estado--confirmado"
                                                    : "turno-card__estado--solicitado"
                                            }`}
                                        >
                                            {turno.estado || "CONFIRMADO"}
                                        </span>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}

export default TablerosPage;
