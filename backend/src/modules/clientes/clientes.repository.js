//aca es donde leemos y escribimos sobre 'nombreModulo.json'
const fs = require('fs')
const path =require('path')

// La ruta se calcula una sola vez y la usan todas las funciones de este archivo
const RUTA = path.join(__dirname,"../", "../","../","data","clientes.json")

function obtenerClientes(){
    const clientesJSON =fs.readFileSync(RUTA, 'utf-8')
    const clientesPlano= JSON.parse(clientesJSON)
    return clientesPlano
}

// Escribe la lista completa: pisa lo que había en el archivo
function guardarClientes(lista){
    fs.writeFileSync(RUTA, JSON.stringify(lista, null, 2))
}

function buscarPorDocumento(documento){
    const clientes =obtenerClientes()
    return clientes.find(c => c.documento === documento)
}

function altaCliente(cliente){
    const lista = obtenerClientes()
    lista.push(cliente)
    guardarClientes(lista)
    return cliente
}

// Pisa solo los campos que vienen en `cambios` y deja el resto igual.
// Devuelve el cliente actualizado, o undefined si no existe.
function modificarCliente(documento, cambios){
    const lista = obtenerClientes()
    const indice = lista.findIndex(c => c.documento === documento)
    if (indice === -1) {
        return undefined
    }
    lista[indice] = { ...lista[indice], ...cambios }
    guardarClientes(lista)
    return lista[indice]
}

module.exports = {obtenerClientes, buscarPorDocumento, altaCliente, modificarCliente}
// fs.readFileSync(ruta, 'utf-8'): lee un archivo y devuelve texto.
// JSON.parse(texto): convierte ese texto en un arreglo u objeto de JavaScript.
// JSON.stringify(datos, null, 2): lo vuelve texto (el 2 lo deja con sangría legible).
// fs.writeFileSync(ruta, texto): escribe el texto en el archivo. Pisa todo lo que había.
