//En repository es donde hacemos las consultas a la base de datos

import {pool} from '../../config/db.js'


async function obtener(){
        const {rows} = await pool.query(
            'SELECT id, documento, nombre, telefono, tipo  FROM clientes ORDER BY id');
        return rows

}


async function buscarPorId(id){
    const {rows} = await pool.query(
        "SELECT id, documento, nombre, telefono, tipo FROM clientes WHERE id = $1",
        [id]
    )
    return rows[0]
}

async function buscarPorDocumento(documento){
    const {rows} = await pool.query(
        "SELECT id, documento, nombre, telefono, tipo FROM clientes WHERE documento = $1",
        [documento]
    )
    return rows[0]
}

async function alta(cliente){
    const {rows} = await pool.query(
        "INSERT INTO clientes (documento, tipo, nombre, telefono) VALUES ($1, $2, $3, $4) RETURNING id, documento, tipo, nombre, telefono, created_at",
        [cliente.documento, cliente.tipo, cliente.nombre, cliente.telefono]
    )
    return rows[0]
}

// Pisa solo los campos que vienen en `cambios` y deja el resto igual.
// Devuelve el cliente actualizado, o undefined si no existe.
// Los nombres de columna se arman con las claves de `cambios`: el service ya las filtró con CAMPOS_MODIFICABLES.
async function modificar(id, cambios){
    const campos= Object.keys(cambios)
    const numerados = campos.map((campo, i) => `${campo} = $${i+1}`)
    const valores = campos.map(campo =>cambios[campo])
    valores.push(id) // el id va al final: es el valor del WHERE
    const {rows} = await pool.query(
        `UPDATE clientes SET ${numerados.join(', ')} WHERE id = $${valores.length} RETURNING id, documento, tipo, nombre, telefono`,
        valores
    )
    return rows[0]
}

async function eliminar(cliente){
    const {rows} = await pool.query(
        "DELETE FROM clientes WHERE id = $1 RETURNING id, documento, tipo, nombre, telefono",
        [cliente.id]
    )
    return rows[0]
}

export default {obtener, buscarPorId, buscarPorDocumento, alta, modificar, eliminar}