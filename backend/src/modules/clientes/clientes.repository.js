//aca es donde leemos y escribimos sobre 'nombreModulo.json'
import fs  from 'fs'
import path from 'path'

// La ruta se calcula una sola vez y la usan todas las funciones de este archivo
const RUTA = path.join(import.meta.dirname, "../", "../", "../", "data", "clientes.json")
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

export {obtenerClientes, buscarPorDocumento, altaCliente, modificarCliente}