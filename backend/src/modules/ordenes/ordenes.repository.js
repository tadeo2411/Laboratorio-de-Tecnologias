//aca es donde leemos y escribimos sobre 'nombreModulo.json'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { pool } from '../../config/db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const ruta = path.join(__dirname, '..', '..', '..', 'data', 'ordenes.json')

async function listarOrdenes(){
    const resultado = await pool.query(
        `SELECT o.id, o.id_cliente AS "clienteId", v.patente AS "vehiculoPatente", 
        o.turno_id AS "turnoId", o.estado, o.diagnostico, o.es_service AS "esService", 
        o.es_urgencia AS "esUrgencia", o.garantia_dias AS "garantiaDias", o.created_at AS "createdAt"
        FROM ordenes_trabajo o 
        JOIN vehiculos v ON v.id = o.id_vehiculo ORDER BY o.id` )
    return resultado.rows
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
        `SELECT o.id, o.id_cliente AS "clienteId", v.patente AS "vehiculoPatente", 
        o.turno_id AS "turnoId", o.estado, o.diagnostico, o.es_service AS "esService", 
        o.es_urgencia AS "esUrgencia", o.garantia_dias AS "garantiaDias", o.created_at AS "createdAt"
        FROM ordenes_trabajo o 
        JOIN vehiculos v ON v.id = o.id_vehiculo WHERE o.id = $1`, [id]
    )
    const orden = resultado.rows[0]
    if (!orden) return undefined
    orden.fichas = await buscarFichas(orden.id)
    orden.trabajos = await buscarTrabajos(orden.id)
    return orden
}

function obtenerOrdenes() {
    return JSON.parse(fs.readFileSync(ruta, 'utf-8'))
}

function guardarOrdenes(ordenes) {
    fs.writeFileSync(ruta, JSON.stringify(ordenes, null, 2))
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
        `INSERT INTO ordenes_trabajo (id_vehiculo, turno_id, diagnostico, es_service, es_urgencia)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id`,
        [orden.idVehiculo, orden.turnoId, orden.diagnostico, orden.esService, orden.esUrgencia]
    )
    return resultado.rows[0].id
}
export default { obtenerOrdenes, guardarOrdenes, listarOrdenes, buscarPorId, buscarAbiertaPorVehiculo, crear }
