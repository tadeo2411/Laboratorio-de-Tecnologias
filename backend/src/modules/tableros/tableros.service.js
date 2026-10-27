// aca va la logica de negocio de las métricas. Arma los números a partir del repository
import repository from "./tableros.repository.js";

// una orden en estos estados ya no está físicamente en el taller / ya se cerró
const ESTADOS_CERRADOS = ['ENTREGADO', 'CANCELADO'];

async function ordenesPorEstado() {
    const filas = await repository.contarOrdenesPorEstado();
    const activas = filas.filter((fila) => !ESTADOS_CERRADOS.includes(fila.estado));
    const total = activas.reduce((suma, fila) => suma + fila.cantidad, 0);

    return {
        total,
        estados: activas.map((fila) => ({
            ...fila,
            porcentaje: total === 0 ? 0 : Math.round((fila.cantidad / total) * 100),
        })),
    };
}

// las 3 tarjetas de arriba del tablero
async function resumen() {
    const [filas, presupuestosSinRespuesta] = await Promise.all([
        repository.contarOrdenesPorEstado(),
        repository.contarPresupuestosPorEstado('ENVIADO'),
    ]);

    const cantidadDe = (estado) => filas.find((fila) => fila.estado === estado)?.cantidad ?? 0;
    const vehiculosEnTaller = filas
        .filter((fila) => !ESTADOS_CERRADOS.includes(fila.estado))
        .reduce((suma, fila) => suma + fila.cantidad, 0);

    return {
        vehiculosEnTaller,
        presupuestosSinRespuesta,
        listosParaRetirar: cantidadDe('TERMINADO'),
    };
}

export default { ordenesPorEstado, resumen };
