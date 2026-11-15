//aca es donde leemos y escribimos sobre 'nombreModulo.json'
import { pool } from '../../config/db.js';

// La fecha vuelve como texto (AAAA-MM-DDTHH:MM:SS), sin zona horaria, para que el navegador
// muestre la misma hora que se guardó sin importar dónde corra el servidor.
const COLUMNAS = `t.id, t.id_cliente, t.id_vehiculo,
    to_char(t.fecha_hora, 'YYYY-MM-DD"T"HH24:MI:SS') AS fecha_hora,
    t.duracion_min, t.motivo, t.estado, t.created_at`;

async function listar() {
    const { rows } = await pool.query(`
        SELECT
            ${COLUMNAS},

            -- Datos del cliente
            t.id_cliente AS cliente_id,
            c.nombre AS cliente_nombre,
            c.documento AS cliente_documento,

            -- Datos del vehículo
            v.patente AS vehiculo_patente,

            -- Orden asociada (si existe)
            o.id AS orden_id

        FROM turnos t

        LEFT JOIN clientes c
            ON c.id = t.id_cliente

        LEFT JOIN vehiculos v
            ON v.id = t.id_vehiculo

        LEFT JOIN ordenes_trabajo o
            ON o.turno_id = t.id

        ORDER BY t.id;
    `);

    return rows;
}

async function eliminar(id) {
    const resultado = await pool.query(
        `DELETE FROM turnos AS t WHERE t.id = $1 RETURNING ${COLUMNAS}`,
        [id]
    );
    return resultado.rows[0];
}

async function cargar(datos) {
    const { id_cliente, fecha_hora, duracion_min, motivo, estado } = datos;

    const resultado = await pool.query(
        `INSERT INTO turnos AS t
            (id_cliente, fecha_hora, duracion_min, motivo, estado)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING ${COLUMNAS}`,
        [id_cliente, fecha_hora, duracion_min, motivo, estado ?? "CONFIRMADO"]
    );

    return resultado.rows[0];
}

async function modificar(datos) {
    const { id, id_cliente, id_vehiculo, fecha_hora, duracion_min, motivo, estado } = datos;
    const resultado = await pool.query(
        `UPDATE turnos AS t
         SET id_cliente = $1,
             id_vehiculo = $2,
             fecha_hora = $3,
             duracion_min = $4,
             motivo = $5,
             estado = $6
         WHERE t.id = $7
         RETURNING ${COLUMNAS}`,
        [id_cliente, id_vehiculo, fecha_hora, duracion_min, motivo, estado, id]
    );

    return resultado.rows[0];
}

async function buscar(id) {
    const { rows } = await pool.query(
        `SELECT ${COLUMNAS} FROM turnos t WHERE t.id = $1`,
        [id]
    );
    return rows[0];
}

async function buscarConfirmadoDeHoy(idCliente) {
    const { rows } = await pool.query(
        `SELECT ${COLUMNAS} FROM turnos t
         WHERE t.id_cliente = $1 AND t.estado = 'CONFIRMADO' AND t.fecha_hora::date = CURRENT_DATE
         ORDER BY t.fecha_hora
         LIMIT 1`,
        [idCliente]
    );
    return rows[0];
}

async function cambiarEstado(id, estado) {
    await pool.query(`UPDATE turnos SET estado = $2 WHERE id = $1`, [id, estado]);
}

export default { listar, cargar, eliminar, modificar, buscar, buscarConfirmadoDeHoy, cambiarEstado };
