import  { pool } from '../../config/db.js'

async function obtenerOrdenesVivas(){
    const  { rows } = await pool.query(
        `SELECT
        COUNT(*) FILTER (WHERE estado = 'RECIBIDO')::int as recibidos,
        COUNT(*) FILTER (WHERE estado = 'DIAGNOSTICANDO')::int as diagnosticando,
        COUNT(*) FILTER (WHERE estado = 'ESPERANDO_APROBACION_PRESUPUESTO')::int as esperandoP,
        COUNT(*) FILTER (WHERE estado = 'ESPERANDO_REPUESTO')::int as esperandoR,
        COUNT(*) FILTER (WHERE estado = 'EN_REPARACION')::int as reparando
        FROM ordenes_trabajo
        `
    )
    return rows[0]
}
//OBTIENE LAS ORDENES FINALIZADAS EN LOS ULTIMOS MESES, TIENE COMO OBJETIVO
//VER CUANTAS FUERON CANCELADAS Y CUANTAS ENTREGADAS
async function obtenerOrdenesUltimosMeses(cantMeses){
    const { rows } = await pool.query(
        `SELECT
        COUNT(*) FILTER(WHERE estado = 'CANCELADO') ::int AS cantCancelados,
        COUNT(*) FILTER(WHERE estado = 'ENTREGADO') ::int AS cantEntregados
        FROM ordenes_trabajo AS o
        WHERE o.created_at >= NOW() - $1 * INTERVAL '1 month'`
    , [cantMeses]
    )
    return rows[0] //si no hay nada devuelve 0
}

async function obtenerProximosTurnos(){
    const { rows } = await pool.query(
        `SELECT t.fecha_hora, c.nombre, v.patente
        FROM turnos t
        JOIN clientes c ON t.id_cliente = c.id
        JOIN vehiculos v ON t.id_vehiculo = v.id
        WHERE (t.fecha_hora BETWEEN NOW() AND NOW() + INTERVAL '15 days')
        AND
        (t.estado = 'CONFIRMADO')`
    )
    return rows
}

async function obtenerInfoFinanciera() {
    const { rows } = await pool.query(
        `SELECT 
            COUNT(DISTINCT o.id)::int AS ordenes_finalizadas,
            COALESCE(SUM(t.mano_de_obra), 0)::float AS total_mano_de_obra,
            COALESCE(SUM(rep.total_repuestos), 0)::float AS total_repuestos,
            (COALESCE(SUM(t.mano_de_obra), 0) + COALESCE(SUM(rep.total_repuestos), 0))::float AS total_ingresos
        FROM ordenes_trabajo o
        LEFT JOIN trabajos t ON t.orden_id = o.id
        LEFT JOIN (
            SELECT trabajo_id, SUM(cantidad * precio_unitario) AS total_repuestos
            FROM repuestos_usados
            GROUP BY trabajo_id
        ) rep ON rep.trabajo_id = t.id
        WHERE o.estado IN ('TERMINADO', 'ENTREGADO')`
    )

    return rows[0]
}

export default { obtenerOrdenesUltimosMeses, obtenerOrdenesVivas, obtenerProximosTurnos, obtenerInfoFinanciera }