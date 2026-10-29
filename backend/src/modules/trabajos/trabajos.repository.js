//aca es donde leemos y escribimos sobre 'nombreModulo.json'
import { pool } from '../../config/db.js';


async function listar() {
    const { rows } = await pool.query(
        `SELECT t.*, ru.repuesto_id, ru.cantidad, ru.precio_unitario
         FROM trabajos t
         LEFT JOIN repuestos_usados ru
            ON ru.trabajo_id = t.id
         ORDER BY t.id`
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
    const { orden_id, tipo_trabajo_id, descripcion, mano_de_obra, repuestos = [] } = datos;

    const conexion = await pool.connect();

    try {
        await conexion.query('BEGIN');

        const resultado = await pool.query(
            `INSERT INTO trabajos
            (orden_id, tipo_trabajo_id, descripcion, mano_de_obra)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
            [orden_id, tipo_trabajo_id, descripcion, mano_de_obra]
        );
        const trabajo = resultado.rows[0];
        for (const repuesto of repuestos) {
            await conexion.query(
                `INSERT INTO repuestos_usados
                    (trabajo_id, repuesto_id, cantidad, precio_unitario)
                 VALUES ($1, $2, $3, $4)`,
                [trabajo.id,repuesto.repuesto_id,repuesto.cantidad,repuesto.precio_unitario]
            );
        }

        await conexion.query('COMMIT');

        return trabajo;
    } catch (error) {
        await conexion.query('ROLLBACK');
        throw error;
    } finally {
        conexion.release();
    }

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

async function buscar(id) {
    const { rows } = await pool.query(
        'SELECT * FROM trabajos WHERE id = $1',
        [id]
    );
    return rows[0];
}

export default { listar, cargar, eliminar, modificar, buscar };