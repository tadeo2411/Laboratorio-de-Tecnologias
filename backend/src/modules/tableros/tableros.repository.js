import  { pool } from '../../config/db.js'

async function obtenerOrdenesVivas(estado){
    const  { rows } = await pool.query(
        `SELECT COUNT(*)::int AS cant
        SELECT COUNT(*) FILTER (WHERE estado = 'RECIBIDO')::int as recibidos,
        SELECT COUNT(*) FILTER (WHERE estado = 'DIAGNOSTICANDO')::int as diagnosticando,
        SELECT COUNT(*) FILTER (WHERE estado = 'ESPERANDO_APROBACION_PRESUPUESTO')::int as esperandoP,
        SELECT COUNT(*) FILTER (WHERE estado = 'ESPERANDO_REPUESTO')::int as esperandoR,
        SELECT COUNT(*) FILTER (WHERE estado = 'EN_REPARACION')::int as reparando
        FROM ordenes_trabajo
        `
    )
    return rows[0]
}

async function obtenerOrdenesUltimosMeses(cantMeses){
    const { rows } = await pool.query(
        `SELECT COUNT(*)::int AS cant
        FROM ordenes_trabajo AS o
        WHERE o.created_at >= NOW() - $1 * INTERVAL '1 month'`
    , [cantMeses]
    )
    return rows[0]?.cant?? 0 //si no hay nada devuelve 0
}

async function obtenerProximosTurnos(){
    const { rows } = await pool.query(
        `SELECT t.fecha_hora, c.nombre, v.patente
        FROM turnos t, clientes c, vehiculos v
        WHERE (t.fecha_hora BETWEEN NOW() AND NOW() + INTERVAL '15')
        AND
        (t.estado = 'CONFIRMADO' OR t.estado = 'PENDIENTE')`
    )
    return rows
}


export default { obtenerOrdenesUltimosMeses, obtenerOrdenesVivas, obtenerProximosTurnos }