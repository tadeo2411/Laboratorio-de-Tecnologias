//aca es donde leemos y escribimos sobre 'nombreModulo.json'
import { pool } from '../../config/db.js';


async function listar() {
    const { rows } = await pool.query(
        'SELECT * FROM turnos ORDER BY id'
    );
    return rows;
}

async function eliminar(id) {
    const resultado = await pool.query(
        "DELETE FROM turnos WHERE id = $1 RETURNING *",
        [id]
    );
    return resultado;
}

async function cargar(datos) {
    const { cliente_documento, vehiculo_patente, fecha_hora, duracion_min, motivo, estado } = datos;

    const resultado = await pool.query(
        `INSERT INTO turnos
            (id_cliente, id_vehiculo, fecha_hora, duracion_min, motivo, estado)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [cliente_documento, vehiculo_patente, fecha_hora, duracion_min, motivo, estado]
    );
    return resultado.rows[0];
}

async function modificar(datos) {
    const { id, cliente_documento, vehiculo_patente, fecha_hora, duracion_min, motivo, estado } = datos;
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
         [cliente_documento, vehiculo_patente, fecha_hora, duracion_min, motivo, estado, id]
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