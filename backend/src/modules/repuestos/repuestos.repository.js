//aca es donde leemos y escribimos sobre 'nombreModulo.json'
import { pool } from '../../config/db.js';


async function listar() {
    const { rows } = await pool.query(
        'SELECT * FROM repuestos ORDER BY id'
    );
    return rows;
}

async function eliminar(id) {
    const resultado = await pool.query(
        "DELETE FROM repuestos WHERE id = $1 RETURNING *",
        [id]
    );
    return resultado.rows[0];
}

async function cargar(datos) {
    const { nombre, precio_estandar } = datos;

    const activo = true;

    const resultado = await pool.query(
        `INSERT INTO repuestos
      (nombre, precio_estandar, activo)
     VALUES ($1, $2, $3)
     RETURNING *`,
        [nombre, precio_estandar, activo]
    );

    return resultado.rows[0];
}

async function modificar(datos) {
    const { id, nombre, precio_estandar } = datos;
    const resultado = await pool.query(`
        UPDATE repuestos 
        SET nombre = $1, precio_estandar = $2 
        WHERE id = $3
        RETURNING *`,
        [nombre, precio_estandar, id]);
    return resultado.rows[0];
}

async function buscar(id) {
    const { rows } = await pool.query(
        'SELECT * FROM repuestos WHERE id = $1',
        [id]
    );
    return rows[0];
}

export default { listar, cargar, eliminar, modificar, buscar };