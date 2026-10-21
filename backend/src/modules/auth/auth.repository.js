//aca es donde leemos y escribimos sobre 'nombreModulo.json'
const fs = require('fs')
const path = require('path')

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

module.exports = { obtenerUsuarios, buscarPorUsuario, buscarPorId }
