//aca es donde leemos y escribimos sobre 'nombreModulo.json'
import { pool } from '../../config/db.js';


async function listar() {
    const { rows } = await pool.query(
        'SELECT * FROM trabajos ORDER BY id'
    );
    return rows;
}

async function eliminar(id) {
    const resultado = await pool.query(
        "DELETE FROM trabajos WHERE id = $1 RETURNING *",
        [id]
    );
    return resultado;
}

async function cargar(datos) {
    const { orden_id, tipo_trabajo_id, descripcion, mano_de_obra} = datos;

    const resultado = await pool.query(
        `INSERT INTO trabajos
            (orden_id, tipo_trabajo_id, descripcion, mano_de_obra)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [orden_id, tipo_trabajo_id, descripcion, mano_de_obra]
    );
    return resultado.rows[0];
}

async function modificar(datos) {
    const { id, orden_id, tipo_trabajo_id, descripcion, mano_de_obra } = datos;
    console.log(id)
    const resultado = await pool.query(
        `UPDATE trabajos
         SET orden_id = $1,
             tipo_trabajo_id = $2,
             descripcion = $3,
             mano_de_obra = $4
         WHERE id = $5
         RETURNING *`,
         [orden_id, tipo_trabajo_id, descripcion, mano_de_obra, id]
    );

    return resultado.rows[0];
}

export default { listar, cargar, eliminar, modificar };