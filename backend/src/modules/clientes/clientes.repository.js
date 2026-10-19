//aca es donde leemos y escribimos sobre 'nombreModulo.json'
const fs = require('fs')
const path =require('path')

function obtenerClientes(){
    const ruta = path.join(__dirname,"../", "../","../","data","clientes.json")
    const clientesJSON =fs.readFileSync(ruta, 'utf-8')
    const clientesPlano= JSON.parse(clientesJSON)
    return clientesPlano
}


module.exports = {obtenerClientes}
// fs.readFileSync(ruta, 'utf-8'): lee un archivo y devuelve texto.
// JSON.parse(texto): convierte ese texto en un arreglo u objeto de JavaScript.
// JSON.stringify(datos, null, 2): lo vuelve texto (el 2 lo deja con sangría legible).
// fs.writeFileSync(ruta, texto): escribe el texto en el archivo. Pisa todo lo que había.