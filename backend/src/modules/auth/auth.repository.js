//aca es donde leemos y escribimos sobre 'nombreModulo.json'
import { pool } from '../../config/db.js';

function obtenerUsuarios() {
    //return JSON.parse(fs.readFileSync(ruta, 'utf-8'))
}

async function buscarPorUsuario(usuario) {
    //return obtenerUsuarios().find((u) => u.usuario === usuario)
    const resultado = await pool.query(
        `SELECT * FROM empleados WHERE usuario=$1`,
        [usuario]
    );
    return resultado.rows[0];
}

function buscarPorId(id) {
    return obtenerUsuarios().find((u) => u.id === id)
}

export default { obtenerUsuarios, buscarPorUsuario, buscarPorId }
