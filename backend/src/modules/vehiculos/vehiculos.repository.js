//aca es donde leemos y escribimos sobre 'nombreModulo.json'
import { pool } from '../../config/db.js'

async function obtener() {
    const { rows }= await pool.query(
        'SELECT id, patente, marca, modelo, anio, descripcion, kilometraje FROM vehiculos ORDER BY id'
    ) ;
    return rows
}

async function buscar(id){
    const { rows } = await pool.query(
        'SELECT id, patente, marca, modelo, anio, descripcion, kilometraje FROM vehiculos WHERE id = $1',
        [id]
    )
    return rows [0]
}

async function buscarPorPatente(patente){
    const { rows } = await pool.query(
        'SELECT id, patente, marca, modelo, anio, descripcion, kilometraje FROM vehiculos WHERE patente = $1',
        [patente]
    )
    return rows [0]
}

async function alta(vehiculo){
    const { rows } = await pool.query(
        `INSERT INTO vehiculos (patente, marca, modelo, anio, descripcion, kilometraje)
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING id, patente, marca, modelo, anio, descripcion, kilometraje
        `,[vehiculo.patente, vehiculo.marca, vehiculo.modelo, vehiculo.anio, vehiculo.descripcion, vehiculo.kilometraje]
    )
    return rows [0]
}

async function modificar(id, cambios){
    const campos = Object.keys(cambios)
    const numerados = campos.map((campo, i) => `${campo} = $${i+1}` )
    const valores = campos.map(campo =>cambios[campo])
    valores.push(id)
    const { rows } = await pool.query(
        `UPDATE vehiculos SET ${numerados.join(', ')} WHERE id = $${valores.length} RETURNING id, patente, marca, modelo, anio, descripcion, kilometraje`,
        valores
    )
    return rows[0]
}

async function eliminar (vehiculo){
    const {rows} = await pool.query(
        "DELETE FROM vehiculos WHERE id = $1 RETURNING id, patente, marca, modelo, anio, descripcion, kilometraje",
        [vehiculo.id]
    )
    return rows[0]
}

export default{obtener, buscar, buscarPorPatente, alta, modificar, eliminar}