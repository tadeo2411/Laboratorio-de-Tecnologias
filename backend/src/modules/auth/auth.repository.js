//aca es donde leemos y escribimos sobre 'nombreModulo.json'
import { pool } from '../../config/db.js';

async function obtenerEmpleadosActivos(){
    const resultado = await pool.query(
        'SELECT e.id, e.nombre FROM empleados e WHERE e.activo = true'
    )
    return resultado.rows;
}

async function buscarPorUsuario(usuario) {
    const resultado = await pool.query(
        `SELECT e.id, e.nombre, e.usuario, e.password_hash, e.activo, r.nombre AS rol 
         FROM empleados e
         JOIN empleados_roles er ON er.empleado_id = e.id
         JOIN roles r ON r.id = er.rol_id
         WHERE e.usuario = $1`,
        [usuario]
    );
    return resultado.rows[0];
}

async function buscarPorId(id) {
    const resultado = await pool.query(
        `SELECT e.id, e.nombre, e.usuario, e.activo, r.nombre AS rol
         FROM empleados e
         JOIN empleados_roles er ON er.empleado_id = e.id
         JOIN roles r ON r.id = er.rol_id
         WHERE e.id = $1`,
        [id]
    );
    return resultado.rows[0];
}
async function obtenerTodosLosEmpleados(){
    const resultado = await pool.query(
        `SELECT e.id, e.nombre, e.usuario, e.activo, r.nombre AS rol
         FROM empleados e
         JOIN empleados_roles er ON er.empleado_id = e.id
         JOIN roles r ON r.id = er.rol_id
         ORDER BY e.id`
    )
    return resultado.rows
}

export default { obtenerEmpleadosActivos, buscarPorUsuario, buscarPorId, obtenerTodosLosEmpleados}
