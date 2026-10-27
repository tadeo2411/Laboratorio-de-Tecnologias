// consultas de solo lectura para armar las métricas de los tableros
import { pool } from '../../config/db.js';

// cantidad de órdenes en cada estado (incluye los estados sin órdenes, con 0)
async function contarOrdenesPorEstado() {
    const { rows } = await pool.query(
        `SELECT e.estado::text AS estado, COUNT(o.id)::int AS cantidad
         FROM unnest(enum_range(NULL::estado_orden)) AS e(estado)
         LEFT JOIN ordenes_trabajo o ON o.estado = e.estado
         GROUP BY e.estado
         ORDER BY array_position(enum_range(NULL::estado_orden), e.estado)`
    );
    return rows;
}

async function contarPresupuestosPorEstado(estado) {
    const { rows } = await pool.query(
        'SELECT COUNT(*)::int AS cantidad FROM presupuestos WHERE estado = $1',
        [estado]
    );
    return rows[0].cantidad;
}

export default { contarOrdenesPorEstado, contarPresupuestosPorEstado };
