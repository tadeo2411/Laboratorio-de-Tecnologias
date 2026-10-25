// aca va la logica de negocio: validaciones, reglas y decidir qué error corresponde. Llama a repository
import clientesRepository from "./clientes.repository.js"
import { httpError }  from"../../utils/httpError.js"

const TIPOS = ['PERSONA', 'EMPRESA']
const CAMPOS_MODIFICABLES = ['documento', 'nombre', 'telefono', 'tipo']
const maxNombre = 120
const maxTelefono = 30

function esTextoNoVacio(valor){
    return typeof valor === 'string' && valor.trim() !== ''
}


function validarDocumento(documento){
    if (typeof documento !== 'string' || !/^\d{1,11}$/.test(documento)) {
        throw httpError(400, 'El documento debe ser un texto con solo dígitos (hasta 11)')
    }

}

// El id llega como texto desde la URL (/:id). Devuelve el número ya convertido.
function validarId(id){
    const idNumerico = Number(id)
    if (!Number.isInteger(idNumerico) || idNumerico <= 0) {
        throw httpError(400, 'El id debe ser un número entero positivo')
    }
    return idNumerico
}

// Con esta funcion yo le saco, espacios y signos de puntuacion
function normalizar(dato){
    if(typeof(dato) !== 'string') 
        return dato

    return dato.replace(/[\s.\- ,.|]/g, '')
}



function validarTipo(tipo){
    if (!TIPOS.includes(tipo)) {
        throw httpError(400, `El tipo debe ser ${TIPOS.join(' o ')}`)
    }
}

function validarTextoObligatorio(valor, nombreCampo, maximo){
    if (!esTextoNoVacio(valor)) {
        throw httpError(400, `El campo ${nombreCampo} es obligatorio y debe ser un texto`)
    }
    if(valor.trim().length>maximo){
        throw httpError(400, `El campo ${nombreCampo} puede contener como máximo ${maximo} caracteres`)
    }
}




async function listar(){
    const lista = await clientesRepository.obtener()
    return lista
}

async function buscar(id){
    const idValido = validarId(id)
    const clienteBuscado = await clientesRepository.buscarPorId(idValido)
    if (!clienteBuscado) {
        throw httpError(404, `El cliente con id ${idValido} no esta registrado`)
    }
    return clienteBuscado
}

async function alta(datos){
    // si no mandan body, req.body es undefined
    const { documento, tipo, nombre, telefono } = datos || {}
    let docNorm = normalizar(documento)
    let telNorm = normalizar(telefono)
    validarDocumento(docNorm)
    validarTipo(tipo)
    validarTextoObligatorio(nombre, 'nombre', maxNombre)
    validarTextoObligatorio(telNorm, 'telefono', maxTelefono)

    if (await clientesRepository.buscarPorDocumento(docNorm)) {
        throw httpError(409, `Ya existe un cliente con documento ${documento}`)
    }

    // Armamos el cliente solo con los campos permitidos: created_at lo pone el servidor,

    const nuevoCliente = {
        documento:docNorm,
        tipo,
        nombre: nombre.trim(),
        telefono: telNorm,
    }
    return clientesRepository.alta(nuevoCliente)
}


async function modificar(id, cambios){
    const cliente = await buscar(id)

    if (!cambios || typeof cambios !== 'object' || Object.keys(cambios).length === 0) {
        throw httpError(400, 'Hay que enviar al menos un campo para modificar')
    }

    //Esto es para que no pueda cambiarse el timestamp o el id
    const camposInvalidos = Object.keys(cambios).filter(
        campo => !CAMPOS_MODIFICABLES.includes(campo)
    )
    if (camposInvalidos.length > 0) {
        throw httpError(400, `Campos que no se pueden modificar: ${camposInvalidos.join(', ')}`)
    }

    // Se normaliza el documento y el teléfono NUEVOS (el id de la URL no se normaliza, ya es un número)
    if (cambios.documento !== undefined) cambios.documento = normalizar(cambios.documento)
    if (cambios.telefono !== undefined) cambios.telefono = normalizar(cambios.telefono)

    if (cambios.documento !== undefined) validarDocumento(cambios.documento)
    if (cambios.tipo !== undefined) validarTipo(cambios.tipo)
    if (cambios.nombre !== undefined) validarTextoObligatorio(cambios.nombre, 'nombre', maxNombre)
    if (cambios.telefono !== undefined) validarTextoObligatorio(cambios.telefono, 'telefono', maxTelefono)

    // Si cambia el documento, no puede ser el de OTRO cliente (si repite el suyo propio, no pasa nada)
    if (cambios.documento !== undefined && cambios.documento !== cliente.documento) {
        if (await clientesRepository.buscarPorDocumento(cambios.documento)) {
            throw httpError(409, `Ya existe un cliente con documento ${cambios.documento}`)
        }
    }

    const cambiosLimpios = {}
    for (const campo of CAMPOS_MODIFICABLES) {
        if (cambios[campo] !== undefined) {
            cambiosLimpios[campo] = typeof cambios[campo] === 'string' ? cambios[campo].trim() : cambios[campo]
        }
    }
    return clientesRepository.modificar(cliente.id, cambiosLimpios)
}

async function eliminar(id){
    const clienteBuscado = await buscar(id)
    try{
    await clientesRepository.eliminar(clienteBuscado)
    }catch (err){
        if(err.code === '23503' || err.code === '23001'){
            throw httpError(409, `Un cliente no puede eliminarse si esta asociado a otro elemento`)
        }
        else throw err
    }
}


export default {listar, buscar, alta, modificar, eliminar}
