//aca es donde leemos y escribimos sobre 'nombreModulo.json'
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { pool } from '../../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function listar() {
        const { rows } = await pool.query('SELECT * FROM repuestos ORDER BY id');
        console.log(rows)
        return rows;
}

async function eliminar() {

}

async function cargar() {
    const ruta = path.join(__dirname, "../", "../", "../", "data", "repuestos.json");

    const repuestosJSON = fs.readFileSync(ruta, "utf-8");

    const repuestosPlano = JSON.parse(repuestosJSON);

    return repuestosPlano;
}

async function modificar() {
    const ruta = path.join(__dirname, "../", "../", "../", "data", "repuestos.json");

    const repuestosJSON = fs.readFileSync(ruta, "utf-8");

    const repuestosPlano = JSON.parse(repuestosJSON);

    return repuestosPlano;
}

export default { listar, cargar, eliminar, modificar };