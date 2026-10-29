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

async function crearEmpleado(empleado){
    const resultado = await pool.query(
        `INSERT INTO empleados (nombre, usuario, password_hash)
         VALUES ($1,$2,$3) RETURNING id`,
         [empleado.nombre, empleado.usuario, empleado.passwordHash]
    )
    const id = resultado.rows[0].id
    await pool.query(
        `INSERT INTO empleados_roles (empleado_id, rol_id)
         SELECT $1, id FROM roles WHERE nombre = $2`, 
         [id,empleado.rol]
    )
    return id
}

export default { obtenerEmpleadosActivos, buscarPorUsuario, buscarPorId, obtenerTodosLosEmpleados, crearEmpleado}
