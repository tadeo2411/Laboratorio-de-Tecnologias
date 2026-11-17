//aca es donde leemos y escribimos sobre 'nombreModulo.json'
import { pool } from '../../config/db.js'

async function obtener() {
    const { rows }= await pool.query(
        `SELECT v.id, v.patente, v.marca, v.modelo, v.anio, v.descripcion, v.kilometraje,
        a.fecha_prevista::text AS "proximoService"
        FROM vehiculos v
        LEFT JOIN avisos_service a ON a.id_vehiculo = v.id
            AND a.estado = 'PENDIENTE'
            AND a.fecha_prevista <= CURRENT_DATE
        ORDER BY v.id`
    ) ;
    return rows
}

async function buscar(id){
    const { rows } = await pool.query(
        `SELECT v.id, v.patente, v.marca, v.modelo, v.anio, v.descripcion, v.kilometraje,
        a.fecha_prevista::text AS "proximoService"
        FROM vehiculos v
        LEFT JOIN avisos_service a ON a.id_vehiculo = v.id
            AND a.estado = 'PENDIENTE'
            AND a.fecha_prevista <= CURRENT_DATE
        WHERE v.id = $1`,
        [id]
    )
    return rows [0]
}

async function buscarPorPatente(patente){
    const { rows } = await pool.query(
        'SELECT id, patente, marca, modelo, anio, descripcion, kilometraje FROM vehiculos WHERE patente = $1',
        [patente]
    )
    return rows [0]
}

async function alta(vehiculo, idCliente){
    const conexion = await pool.connect()
    try{
        await conexion.query('BEGIN') 
        const { rows } = await conexion.query(
            `INSERT INTO vehiculos (patente, marca, modelo, anio, descripcion, kilometraje)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING id, patente, marca, modelo, anio, descripcion, kilometraje
            `,[vehiculo.patente, vehiculo.marca, vehiculo.modelo, vehiculo.anio, vehiculo.descripcion, vehiculo.kilometraje]
        )
        const creado = rows[0]
        await conexion.query(
            `INSERT INTO duenos (id_vehiculo, id_cliente)
            VALUES($1, $2)`,
            [creado.id, idCliente]
        )
        await conexion.query('COMMIT')// es el que finalmente guarda
        return creado
    }catch (err){
        await conexion.query('ROLLBACK') // esto es lo que hace que se deshaga la transaccion
        throw err
    }finally{
        conexion.release() //devuelve la conexion al pool sea fallido o exitosa la transaccion
    }
    
}

async function modificar(id, cambios){
    const campos = Object.keys(cambios)
    const numerados = campos.map((campo, i) => `${campo} = $${i+1}` )
    const valores = campos.map(campo => cambios[campo])
    valores.push(id)
    await pool.query(
        `UPDATE vehiculos SET ${numerados.join(', ')}
        WHERE id = $${valores.length}`,
        valores
    )
    return buscar(id)
}

async function eliminar (vehiculo){
    const {rows} = await pool.query(
        `DELETE FROM vehiculos
        WHERE id = $1
        RETURNING id, patente, marca, modelo, anio, descripcion, kilometraje`,
        [vehiculo.id]
    )
    return rows[0]
}

async function obtenerDuenos(id){
    const { rows } = await pool.query(
        `SELECT cliente.id, cliente.documento, cliente.tipo, cliente.nombre, cliente.telefono
        FROM duenos dueno
        JOIN clientes cliente ON cliente.id = dueno.id_cliente
        WHERE dueno.id_vehiculo = $1
        ORDER BY dueno.ultima_visita DESC`,
        [id]
    )
    return rows
}

async function obtenerDueno(id, idCliente){
    const { rows } = await pool.query(
        `SELECT cliente.id, cliente.documento, cliente.tipo, cliente.nombre, cliente.telefono
        FROM duenos dueno
        JOIN clientes cliente ON cliente.id = dueno.id_cliente
        WHERE dueno.id_vehiculo = $1 AND cliente.id = $2`,
        [id, idCliente]
    )
    return rows[0]
}

async function actualizarDueno(id, idCliente){
    const { rows } = await pool.query(
        `UPDATE duenos
        SET ultima_visita = now()
        WHERE id_vehiculo = $1 AND id_cliente = $2
        RETURNING *`,
        [id, idCliente]
    )
    return rows[0]
}

async function asociarDueno(id, idCliente){
    const { rows } = await pool.query(
        `INSERT INTO duenos (id_vehiculo, id_cliente)
        VALUES($1, $2)
        RETURNING *`,
        [id, idCliente]
    )
    return rows[0]
}

async function desasociarDueno(id, idCliente){
    const { rows } = await pool.query(
        `DELETE FROM duenos
        WHERE id_vehiculo = $1 AND id_cliente = $2
        RETURNING id_cliente, id_vehiculo, ultima_visita`,
        [id, idCliente]
    )
    return rows[0]
}

async function verHistorialService(id){
    const { rows } = await pool.query(
        `SELECT o.id, f.fecha, f.kilometraje, o.diagnostico AS detalle
        FROM ordenes_trabajo o
        JOIN fichas f ON f.orden_id = o.id AND f.tipo = 'EGRESO'
        WHERE o.id_vehiculo = $1 AND o.es_service = true AND o.estado = 'ENTREGADO'
        ORDER BY f.fecha desc`,
        [id]
    )
    return rows
}

 async function gestionarAviso(id, estado, idEmpleado){
     const { rows } = await pool.query(
         `UPDATE avisos_service
         SET estado = $2, empleado_id = $3, fecha_gestion = now()
         WHERE id_vehiculo = $1 AND estado = 'PENDIENTE'
         RETURNING id, id_vehiculo, estado, fecha_prevista::text AS "fechaPrevista", empleado_id, fecha_gestion`,
         [id, estado, idEmpleado]
     )
     return rows[0]
 }
async function programarAviso(id, meses = 6){
    const actualizado = await pool.query(
        `UPDATE avisos_service
        SET fecha_prevista = (CURRENT_DATE + make_interval(months => $2))::date
        WHERE id_vehiculo = $1 AND estado = 'PENDIENTE'
        RETURNING id`,
        [id, meses]
    )
    if(actualizado.rows.length > 0){
        return actualizado.rows[0]
    }
    const creado = await pool.query(
        `INSERT INTO avisos_service (id_vehiculo, fecha_prevista)
        VALUES ($1, (CURRENT_DATE + make_interval(months => $2))::date)
        RETURNING id`,
        [id, meses]
    )
    return creado.rows[0]
}

export default{
    obtener,
    buscar,
    buscarPorPatente,
    alta,
    modificar,
    eliminar,
    obtenerDuenos,
    obtenerDueno,
    actualizarDueno,
    asociarDueno,
    desasociarDueno,
    verHistorialService,
    gestionarAviso,
    programarAviso
}