//aca es donde leemos y escribimos sobre 'nombreModulo.json'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const ruta = path.join(__dirname, '..', '..', '..', 'data', 'usuarios.json')

function obtenerUsuarios() {
    return JSON.parse(fs.readFileSync(ruta, 'utf-8'))
}

function buscarPorUsuario(usuario) {
    return obtenerUsuarios().find((u) => u.usuario === usuario)
}

function buscarPorId(id) {
    return obtenerUsuarios().find((u) => u.id === id)
}

export default { obtenerUsuarios, buscarPorUsuario, buscarPorId }
