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
    return resultado;
}

async function cargar(datos) {
    const { nombre, precio_estandar, activo } = datos;

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
}

export default { listar, cargar, eliminar, modificar };