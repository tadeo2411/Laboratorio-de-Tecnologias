//aca es donde leemos y escribimos sobre 'nombreModulo.json'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const ruta = path.join(__dirname, '..', '..', '..', 'data', 'ordenes.json')

function obtenerOrdenes() {
    return JSON.parse(fs.readFileSync(ruta, 'utf-8'))
}

function guardarOrdenes(ordenes) {
    fs.writeFileSync(ruta, JSON.stringify(ordenes, null, 2))
}

export default { obtenerOrdenes, guardarOrdenes }
