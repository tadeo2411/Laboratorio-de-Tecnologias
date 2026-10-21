//aca es donde leemos y escribimos sobre 'nombreModulo.json'
const fs = require('fs')
const path = require('path')

const carpetaDatos = path.join(__dirname, '..', '..', '..', 'data')

function leerArchivo(nombre) {
    return JSON.parse(fs.readFileSync(path.join(carpetaDatos, nombre), 'utf-8'))
}

function obtenerOrdenes() {
    return leerArchivo('ordenes.json')
}

function guardarOrdenes(ordenes) {
    fs.writeFileSync(path.join(carpetaDatos, 'ordenes.json'), JSON.stringify(ordenes, null, 2))
}

function existeVehiculo(patente) {
    return leerArchivo('vehiculos.json').some((vehiculo) => vehiculo.patente === patente)
}

function existeTurno(id) {
    return leerArchivo('turnos.json').some((turno) => turno.id === id)
}

function buscarTipoTrabajo(id) {
    return leerArchivo('tiposTrabajo.json').find((tipo) => tipo.id === id)
}

function buscarRepuesto(id) {
    return leerArchivo('repuestos.json').find((repuesto) => repuesto.id === id)
}

function obtenerEmpleadosActivos() {
    return leerArchivo('usuarios.json')
        .filter((usuario) => usuario.activo)
        .map((usuario) => ({ id: usuario.id, nombre: usuario.nombre }))
}

module.exports = {
    obtenerOrdenes,
    guardarOrdenes,
    existeVehiculo,
    existeTurno,
    buscarTipoTrabajo,
    buscarRepuesto,
    obtenerEmpleadosActivos
}
