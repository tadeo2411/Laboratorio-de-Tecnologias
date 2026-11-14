//aca es donde leemos y escribimos sobre 'nombreModulo.json'
import { pool } from '../../config/db.js'

async function listarOrdenes(){
    const resultado = await pool.query(
        `SELECT o.id, o.id_cliente AS "clienteId", o.id_vehiculo AS "vehiculoId", v.patente AS "vehiculoPatente", 
        o.turno_id AS "turnoId", o.estado, o.diagnostico, o.es_service AS "esService", 
        o.es_urgencia AS "esUrgencia", o.garantia_dias AS "garantiaDias", o.created_at AS "createdAt",
        c.nombre AS "clienteNombre", c.documento AS "clienteDocumento"
        FROM ordenes_trabajo o 
        JOIN vehiculos v ON v.id = o.id_vehiculo
        LEFT JOIN clientes c ON c.id = o.id_cliente ORDER BY o.id` )
    const ordenes = resultado.rows
    for (const orden of ordenes) {
        orden.fichas = await buscarFichas(orden.id)
        orden.trabajos = await buscarTrabajos(orden.id)
    }
    return ordenes
}

async function buscarFichas(ordenId){
    const fichas = await pool.query(
        `SELECT id,tipo,fecha,kilometraje,conformidad
        FROM fichas WHERE orden_id = $1 ORDER BY fecha`, [ordenId]
    )
    const items = await pool.query(
        `SELECT i.id, i.ficha_id AS "fichaId", i.concepto, i.valor
        FROM items_ficha i
        JOIN fichas f ON f.id = i.ficha_id
        WHERE f.orden_id = $1`, [ordenId])
        return fichas.rows.map((ficha) => ({
            ...ficha,
            items: items.rows.filter((item) => item.fichaId === ficha.id)
        }))
}

async function buscarTrabajos(ordenId){
    const trabajos = await pool.query(
        `SELECT t.id, t.tipo_trabajo_id AS "tipoTrabajoId", tt.nombre AS "tipoTrabajo",
        t.descripcion, t.mano_de_obra::float AS "manoDeObra"
        FROM trabajos t
        JOIN tipos_trabajo tt ON tt.id = t.tipo_trabajo_id
        WHERE t.orden_id = $1 ORDER BY t.id`, [ordenId]
    )
    const repuestos = await pool.query(
        `SELECT ru.id, ru.trabajo_id AS "trabajoId", ru.repuesto_id AS "repuestoId", r.nombre,
        ru.cantidad::float AS cantidad, ru.precio_unitario::float AS "precioUnitario"
        FROM repuestos_usados ru
        JOIN repuestos r ON r.id = ru.repuesto_id
        JOIN trabajos t ON t.id = ru.trabajo_id
        WHERE t.orden_id = $1`, [ordenId]
    )
    const empleados = await pool.query(
        `SELECT te.trabajo_id AS "trabajoId", e.id, e.nombre
        FROM trabajos_empleados te
        JOIN empleados e ON e.id = te.empleado_id
        JOIN trabajos t ON t.id = te.trabajo_id
        WHERE t.orden_id = $1`, [ordenId]
    )
        return trabajos.rows.map((trabajo) => ({
            ...trabajo,
            repuestos: repuestos.rows.filter((repuesto) => repuesto.trabajoId === trabajo.id),
            empleados: empleados.rows.filter((empleado) => empleado.trabajoId === trabajo.id)
        }))
}

async function buscarPorId(id){
    const resultado = await pool.query(
        `SELECT o.id, o.id_cliente AS "clienteId", o.id_vehiculo AS "vehiculoId", v.patente AS "vehiculoPatente", 
        o.turno_id AS "turnoId", o.estado, o.diagnostico, o.es_service AS "esService", 
        o.es_urgencia AS "esUrgencia", o.garantia_dias AS "garantiaDias", o.created_at AS "createdAt",
        c.nombre AS "clienteNombre", c.documento AS "clienteDocumento"
        FROM ordenes_trabajo o 
        JOIN vehiculos v ON v.id = o.id_vehiculo
        LEFT JOIN clientes c ON c.id = o.id_cliente WHERE o.id = $1`, [id]
    )
    const orden = resultado.rows[0]
    if (!orden) return undefined
    orden.fichas = await buscarFichas(orden.id)
    orden.trabajos = await buscarTrabajos(orden.id)
    return orden
}

async function buscarAbiertaPorVehiculo(idVehiculo){
    const resultado = await pool.query(
        `SELECT id FROM ordenes_trabajo
        WHERE id_vehiculo = $1 AND estado NOT IN ('ENTREGADO', 'CANCELADO')`,
        [idVehiculo]
    )
    return resultado.rows[0]
}

async function crear(orden){
    const resultado = await pool.query(
        `INSERT INTO ordenes_trabajo (id_cliente, id_vehiculo, turno_id, diagnostico, es_service, es_urgencia)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id`,
        [orden.idCliente, orden.idVehiculo, orden.turnoId, orden.diagnostico, orden.esService, orden.esUrgencia]
    )
    return resultado.rows[0].id
}
async function actualizar(id, orden){
    await pool.query(
        `UPDATE ordenes_trabajo SET diagnostico = $1, es_service = $2, es_urgencia = $3, id_cliente = $4
        WHERE id = $5`,
        [orden.diagnostico, orden.esService, orden.esUrgencia, orden.clienteId, id]
    )
}

async function actualizarEstado(id, estado){
    await pool.query(
        'UPDATE ordenes_trabajo SET estado = $1 WHERE id = $2',
        [estado, id]
    )
}
async function crearFicha(ordenId, ficha){
    const resultado = await pool.query(
        `INSERT INTO fichas (orden_id, tipo, fecha, kilometraje, conformidad)
        VALUES ($1, $2, now(), $3, $4)
        RETURNING id`,
        [ordenId, ficha.tipo, ficha.kilometraje, ficha.conformidad]
    )
    const fichaId = resultado.rows[0].id
    for (const item of ficha.items) {
        await pool.query(
            'INSERT INTO items_ficha (ficha_id, concepto, valor) VALUES ($1, $2, $3)',
            [fichaId, item.concepto, item.valor]
        )
    }
}
async function crearTrabajo(ordenId, trabajo){
    const resultado = await pool.query(
        `INSERT INTO trabajos (orden_id, tipo_trabajo_id, descripcion, mano_de_obra)
        VALUES ($1, $2, $3, $4)
        RETURNING id`,
        [ordenId, trabajo.tipoTrabajoId, trabajo.descripcion, trabajo.manoDeObra]
    )
    const trabajoId = resultado.rows[0].id
    for (const repuesto of trabajo.repuestos) {
        await pool.query(
            `INSERT INTO repuestos_usados (trabajo_id, repuesto_id, cantidad, precio_unitario)
            VALUES ($1, $2, $3, $4)`,
            [trabajoId, repuesto.repuestoId, repuesto.cantidad, repuesto.precioUnitario]
        )
    }
    for (const empleado of trabajo.empleados) {
        await pool.query(
            'INSERT INTO trabajos_empleados (trabajo_id, empleado_id) VALUES ($1, $2)',
            [trabajoId, empleado.id]
        )
    }
}

async function eliminarTrabajo(id){
    await pool.query('DELETE FROM trabajos WHERE id = $1', [id])
}
export default { listarOrdenes, buscarPorId, buscarAbiertaPorVehiculo, crear, actualizar, actualizarEstado, crearFicha, crearTrabajo, eliminarTrabajo }
