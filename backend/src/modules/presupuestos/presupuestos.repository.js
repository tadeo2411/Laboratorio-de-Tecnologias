import { pool } from '../../config/db.js'

const SELECT_PRESUPUESTO = `
    SELECT p.id, p.numero, p.orden_id AS "ordenId",
    to_char(p.fecha_emision, 'YYYY-MM-DD') AS "fechaEmision",
    p.vigencia_dias AS "diasValidez",
    to_char(p.fecha_emision + p.vigencia_dias, 'YYYY-MM-DD') AS "fechaVencimiento",
    COALESCE(p.observaciones, '') AS observaciones,
    CASE WHEN p.estado = 'ENVIADO' AND p.fecha_emision + p.vigencia_dias < CURRENT_DATE
        THEN 'VENCIDO' ELSE p.estado::text END AS "estadoPresupuesto",
    c.nombre AS "clienteNombre", c.documento AS "clienteDocumento"
    FROM presupuestos p
    JOIN ordenes_trabajo o ON o.id = p.orden_id
    LEFT JOIN clientes c ON c.id = o.id_cliente`

const ORDENAR = `ORDER BY (p.estado = 'BORRADOR') DESC, p.fecha_emision DESC NULLS LAST, p.numero DESC`

async function agregarItems(presupuestos) {
    if (presupuestos.length === 0) return []
    const resultado = await pool.query(
        `SELECT id, presupuesto_id AS "presupuestoId", concepto AS tipo, descripcion,
        cantidad::float AS cantidad, precio_unitario::float AS "precioUnitario", trabajo_id AS "trabajoId"
        FROM presupuesto_items WHERE presupuesto_id = ANY($1) ORDER BY id`,
        [presupuestos.map((presupuesto) => presupuesto.id)]
    )
    return presupuestos.map((presupuesto) => ({
        ...presupuesto,
        items: resultado.rows
            .filter((item) => item.presupuestoId === presupuesto.id)
            .map(({ presupuestoId, ...item }) => item)
    }))
}

async function listar(ordenId) {
    const resultado = ordenId
        ? await pool.query(`${SELECT_PRESUPUESTO} WHERE p.orden_id = $1 ${ORDENAR}`, [ordenId])
        : await pool.query(`${SELECT_PRESUPUESTO} ${ORDENAR}`)
    return agregarItems(resultado.rows)
}

async function buscarPorId(id) {
    const resultado = await pool.query(`${SELECT_PRESUPUESTO} WHERE p.id = $1`, [id])
    const [presupuesto] = await agregarItems(resultado.rows)
    return presupuesto
}

async function enTransaccion(operacion) {
    const cliente = await pool.connect()
    try {
        await cliente.query('BEGIN')
        const resultado = await operacion(cliente)
        await cliente.query('COMMIT')
        return resultado
    } catch (error) {
        await cliente.query('ROLLBACK')
        throw error
    } finally {
        cliente.release()
    }
}

async function insertarItems(cliente, presupuestoId, items) {
    for (const item of items) {
        await cliente.query(
            `INSERT INTO presupuesto_items (presupuesto_id, concepto, descripcion, cantidad, precio_unitario, trabajo_id)
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [presupuestoId, item.tipo, item.descripcion, item.cantidad, item.precioUnitario, item.trabajoId ?? null]
        )
    }
}

async function crear(presupuesto) {
    return enTransaccion(async (cliente) => {
        const resultado = await cliente.query(
            `INSERT INTO presupuestos (numero, orden_id, vigencia_dias, observaciones)
            SELECT COALESCE(MAX(numero), 0) + 1, $1, $2, $3 FROM presupuestos
            RETURNING id`,
            [presupuesto.ordenId, presupuesto.diasValidez, presupuesto.observaciones]
        )
        const id = resultado.rows[0].id
        await insertarItems(cliente, id, presupuesto.items)
        return id
    })
}

async function actualizar(id, cambios) {
    await enTransaccion(async (cliente) => {
        await cliente.query(
            `UPDATE presupuestos SET estado = $1,
            fecha_emision = CASE WHEN $2::boolean THEN CURRENT_DATE ELSE fecha_emision END,
            fecha_respuesta = CASE WHEN $3::boolean THEN CURRENT_DATE ELSE fecha_respuesta END
            WHERE id = $4`,
            [cambios.estado, cambios.emitir, cambios.responder, id]
        )
        if (cambios.items) {
            await cliente.query('DELETE FROM presupuesto_items WHERE presupuesto_id = $1', [id])
            await insertarItems(cliente, id, cambios.items)
        }
    })
}

// Los borradores y los enviados sin vencer esperaban una respuesta que ya no va a llegar.
async function cancelarPendientes(ordenId) {
    await pool.query(
        `UPDATE presupuestos SET estado = 'CANCELADO',
        fecha_respuesta = CASE WHEN estado = 'ENVIADO' THEN CURRENT_DATE ELSE fecha_respuesta END
        WHERE orden_id = $1
        AND (estado = 'BORRADOR' OR (estado = 'ENVIADO' AND fecha_emision + vigencia_dias >= CURRENT_DATE))`,
        [ordenId]
    )
}

async function eliminar(id) {
    await pool.query('DELETE FROM presupuestos WHERE id = $1', [id])
}

export default { listar, buscarPorId, crear, actualizar, cancelarPendientes, eliminar }
