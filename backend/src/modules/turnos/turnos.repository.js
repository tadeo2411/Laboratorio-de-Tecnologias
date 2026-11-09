//aca es donde leemos y escribimos sobre 'nombreModulo.json'
import { pool } from '../../config/db.js';


async function listar() {
    const { rows } = await pool.query(`
        SELECT
            t.*,

            -- Datos del cliente
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
        "DELETE FROM turnos WHERE id = $1 RETURNING *",
        [id]
    );
    return resultado.rows[0];
}

async function cargar(datos) {
    const { id_vehiculo, fecha_hora, duracion_min, motivo, estado } = datos;

    const resultado = await pool.query(
        `INSERT INTO turnos
            (id_vehiculo, fecha_hora, duracion_min, motivo, estado)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [id_vehiculo, fecha_hora, duracion_min, motivo, estado]
    );
    return resultado.rows[0];
}

async function modificar(datos) {
    const { id, id_cliente, id_vehiculo, fecha_hora, duracion_min, motivo, estado } = datos;
    const resultado = await pool.query(
        `UPDATE turnos
         SET id_cliente = $1,
             id_vehiculo = $2,
             fecha_hora = $3,
             duracion_min = $4,
             motivo = $5,
             estado = $6
         WHERE id = $7
         RETURNING *`,
        [id_cliente, id_vehiculo, fecha_hora, duracion_min, motivo, estado, id]
    );

    return resultado.rows[0];
}

async function buscar(id) {
    const { rows } = await pool.query(
        'SELECT * FROM turnos WHERE id = $1',
        [id]
    );
    return rows[0];
}

export default { listar, cargar, eliminar, modificar, buscar };