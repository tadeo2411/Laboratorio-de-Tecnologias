// aca va la logica de negocio: validaciones, reglas y decidir qué error corresponde. Llama a repository
import clientesRepository from "./clientes.repository.js"
import { httpError }  from"../../utils/httpError.js"

const TIPOS = ['PERSONA', 'EMPRESA']
const CAMPOS_MODIFICABLES = ['nombre', 'telefono', 'tipo', 'activo']


function esTextoNoVacio(valor){
    return typeof valor === 'string' && valor.trim() !== ''
}

// El documento es la clave: texto con solo dígitos, hasta 11 (DNI o CUIT)
function validarDocumento(documento){
    if (typeof documento !== 'string' || !/^\d{1,11}$/.test(documento)) {
        throw httpError(400, 'El documento debe ser un texto con solo dígitos (hasta 11)')
    }
}

function validarTipo(tipo){
    if (!TIPOS.includes(tipo)) {
        throw httpError(400, `El tipo debe ser ${TIPOS.join(' o ')}`)
    }
}

function validarTextoObligatorio(valor, nombreCampo){
    if (!esTextoNoVacio(valor)) {
        throw httpError(400, `El campo ${nombreCampo} es obligatorio y debe ser un texto`)
    }
}



// activo es opcional: ?activo=true o ?activo=false. Sin eso, devuelve todos.
function listarClientes(activo){
    const lista = clientesRepository.obtenerClientes()
    if (activo === undefined) {
        return lista
    }
    if (activo !== 'true' && activo !== 'false') {
        throw httpError(400, 'El filtro activo debe ser true o false')
    }
    return lista.filter(c => c.activo === (activo === 'true'))
}

// Devuelve el cliente aunque esté dado de baja (con activo: false)
function buscarCliente(documento){
    validarDocumento(documento)
    const clienteBuscado = clientesRepository.buscarPorDocumento(documento)
    if (!clienteBuscado) {
        throw httpError(404, `El cliente con documento ${documento} no esta registrado`)
    }
    return clienteBuscado
}

function altaCliente(datos){
    // si no mandan body, req.body es undefined
    const { documento, tipo, nombre, telefono } = datos || {}

    validarDocumento(documento)
    validarTipo(tipo)
    validarTextoObligatorio(nombre, 'nombre')
    validarTextoObligatorio(telefono, 'telefono')

    // Se rechaza también si existe dado de baja: el documento es la clave y no se repite
    if (clientesRepository.buscarPorDocumento(documento)) {
        throw httpError(409, `Ya existe un cliente con documento ${documento}`)
    }

    // Armamos el cliente solo con los campos permitidos: activo y created_at los pone el servidor,
    // así que si el cliente los manda, se ignoran.
    const nuevoCliente = {
        documento,
        tipo,
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        activo: true,
    }
    return clientesRepository.altaCliente(nuevoCliente)
}

// Sirve para modificar datos y también para la baja/alta lógica (activo: false / true)
function modificarCliente(documento, cambios){
    validarDocumento(documento)

    if (!cambios || typeof cambios !== 'object' || Object.keys(cambios).length === 0) {
        throw httpError(400, 'Hay que enviar al menos un campo para modificar')
    }

    const cliente = clientesRepository.buscarPorDocumento(documento)
    if (!cliente) {
        throw httpError(404, `El cliente con documento ${documento} no esta registrado`)
    }

    // el documento es la clave: no se puede cambiar (repetirlo igual no hace daño)
    if (cambios.documento !== undefined && cambios.documento !== documento) {
        throw httpError(400, 'El documento no se puede modificar')
    }

    // solo se aceptan los campos de la lista; por ejemplo created_at no se toca
    const camposInvalidos = Object.keys(cambios).filter(
        campo => campo !== 'documento' && !CAMPOS_MODIFICABLES.includes(campo)
    )
    if (camposInvalidos.length > 0) {
        throw httpError(400, `Campos que no se pueden modificar: ${camposInvalidos.join(', ')}`)
    }

    if (cambios.tipo !== undefined) validarTipo(cambios.tipo)
    if (cambios.nombre !== undefined) validarTextoObligatorio(cambios.nombre, 'nombre')
    if (cambios.telefono !== undefined) validarTextoObligatorio(cambios.telefono, 'telefono')
    if (cambios.activo !== undefined && typeof cambios.activo !== 'boolean') {
        throw httpError(400, 'El campo activo debe ser true o false')
    }

    // Un cliente dado de baja no puede operar: lo único permitido es reactivarlo
    if (cliente.activo === false && cambios.activo !== true) {
        throw httpError(409, 'El cliente está dado de baja: hay que reactivarlo (activo: true) antes de modificarlo')
    }

    const cambiosLimpios = {}
    for (const campo of CAMPOS_MODIFICABLES) {
        if (cambios[campo] !== undefined) {
            cambiosLimpios[campo] = typeof cambios[campo] === 'string' ? cambios[campo].trim() : cambios[campo]
        }
    }
    return clientesRepository.modificarCliente(documento, cambiosLimpios)
}


export {listarClientes, buscarCliente, altaCliente, modificarCliente}
