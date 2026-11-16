// Catálogo de tipos de trabajo: lo que ofrece el taller.
// Los trabajos de cada orden se manejan desde el módulo de órdenes.
import { pool } from '../../config/db.js';

// Listar tipos de trabajo
async function listar() {
    const { rows } = await pool.query(
        `SELECT *
         FROM tipos_trabajo
         ORDER BY id`
    );

    return rows;
}

// Buscar tipo de trabajo por ID
async function buscar(id) {
    const { rows } = await pool.query(
        `SELECT *
         FROM tipos_trabajo
         WHERE id = $1`,
        [id]
    );

    return rows[0];
}

// Cargar tipo de trabajo
async function cargar(datos) {
    const { nombre, categoria, precio_estandar, activo } = datos;

    const { rows } = await pool.query(
        `INSERT INTO tipos_trabajo
            (nombre, categoria, precio_estandar, activo)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [nombre, categoria, precio_estandar, activo]
    );

    return rows[0];
}

// Modificar tipo de trabajo
async function modificar(datos) {
    const { id, nombre, categoria, precio_estandar, activo } = datos;

    const { rows } = await pool.query(
        `UPDATE tipos_trabajo
         SET nombre = $1,
             categoria = $2,
             precio_estandar = $3,
             activo = $4
         WHERE id = $5
         RETURNING *`,
        [nombre, categoria, precio_estandar, activo, id]
    );

    return rows[0];
}

// Cantidad de trabajos de órdenes que usan el tipo
async function contarUsos(id) {
    const { rows } = await pool.query(
        `SELECT COUNT(*)::int AS usos
         FROM trabajos
         WHERE tipo_trabajo_id = $1`,
        [id]
    );

    return rows[0].usos;
}

// Eliminar tipo de trabajo
async function eliminar(id) {
    const { rows } = await pool.query(
        `DELETE FROM tipos_trabajo
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return rows[0];
}

export default {
    listar,
    buscar,
    cargar,
    modificar,
    contarUsos,
    eliminar
};
