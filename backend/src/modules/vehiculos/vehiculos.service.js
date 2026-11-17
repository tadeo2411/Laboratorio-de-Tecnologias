// aca va la logica de negocio. Genera id y llama a repository
import vehiculosRepository from './vehiculos.repository.js'
import clienteServicio from '../clientes/clientes.service.js'
import {httpError} from '../../utils/httpError.js'
import { validarTexto, validarTextoObligatorio, validarKilometraje } from '../../utils/validsTexto.js'

const CAMPOS_MODIFICABLES =['patente', 'marca', 'modelo', 'anio', 'descripcion', 'kilometraje']
const maxMarca = 60
const maxModelo = 60
const maxDescripcion = 500

const ESTADOS_GESTION_AVISO = [ 'ENVIADO', 'DESCARTADO']

// Le saco todo lo que no sea letra o numero y la paso a mayusculas
function normalizar(patente){
    if(typeof(patente) !== 'string'){
        throw httpError(400, "Ingrese una patente valida")
    }
    return patente.toUpperCase().replace(/[^A-Z0-9]/g, '')
}

function validarPatente(patente){
    if(!/^([A-Z]{3}\d{3}|[A-Z]{2}\d{3}[A-Z]{2})$/.test(patente)){
        throw httpError(400, 'La patente debe tener formato ABC123 o AB123CD')
    }
}

function validarAnio(anio){
    if(!Number.isInteger(anio)){
        throw httpError(400, 'el año del vehiculo debe ser un numero')
    }
    if(anio <=1900 || anio > new Date().getFullYear()){
        throw httpError(400, 'el año del vehiculo debe ser valido')
    }
}

function validarId(id){
    const idNumerico = Number(id)
    if(!Number.isInteger(idNumerico) || idNumerico <= 0){
        throw httpError(400, 'El id debe ser un número entero positivo')
    }
    return idNumerico
}



async function listar(){
    const lista = await vehiculosRepository.obtener()
    return lista
}

async function buscar(id){
    const idValido = validarId(id)
    const vehiculoBuscado = await vehiculosRepository.buscar(idValido)
    if(!vehiculoBuscado){
        throw httpError(404, `No se encontro al vehiculo con id ${idValido}`)
    }
    return vehiculoBuscado
}

async function alta (vehiculo){
    const { patente, marca, modelo, anio, descripcion, kilometraje, idCliente} =  vehiculo || {}
    const patenteNorm = normalizar(patente)
    validarPatente(patenteNorm)
    validarAnio(anio)
    validarTextoObligatorio(marca, 'marca', maxMarca)
    validarTextoObligatorio(modelo, 'modelo', maxModelo)
    validarKilometraje(kilometraje)

    if(idCliente === undefined){
        throw httpError(400, 'El vehiculo debe tener un dueño')
    }

    const cliente = await clienteServicio.buscar(idCliente)

    const desc = descripcion ?? null
    if(desc !== null) validarTexto(desc, 'descripcion', maxDescripcion)

    if(await vehiculosRepository.buscarPorPatente(patenteNorm)){
        throw httpError(409, `El vehiculo con la patente ${patenteNorm} ya existe`)
    }

    const nuevoVehiculo ={
        patente: patenteNorm,
        marca : marca.trim(),
        modelo : modelo.trim(),
        anio,
        descripcion : desc === null ? null : desc.trim(),
        kilometraje
    }

    return vehiculosRepository.alta(nuevoVehiculo, cliente.id)
}

async function modificar(id, cambios) {
    const vehiculo = await buscar(id)

    if(!cambios || typeof cambios !== 'object' || Object.keys(cambios).length === 0){
        throw httpError(400, `Se debe enviar al menos un campo para modificar`)
    }

    const camposInvalidos = Object.keys(cambios).filter(
        campo => !CAMPOS_MODIFICABLES.includes(campo)
    )
    if(camposInvalidos.length > 0){
        throw httpError(400, `Campos que no se pueden modificar: ${camposInvalidos.join(', ')}`)
    }

    if (cambios.patente !== undefined) {
        cambios.patente = normalizar(cambios.patente)
        validarPatente(cambios.patente)
    }
    if (cambios.modelo !== undefined) validarTextoObligatorio(cambios.modelo, 'modelo', maxModelo)
    if (cambios.anio !== undefined) validarAnio(cambios.anio)
    if (cambios.marca !== undefined) validarTextoObligatorio(cambios.marca, 'marca', maxMarca)
    if (cambios.kilometraje !== undefined) validarKilometraje(cambios.kilometraje)
    if (cambios.descripcion !== undefined && cambios.descripcion !== null) validarTexto(cambios.descripcion, 'descripcion', maxDescripcion)

    
    if (cambios.patente !== undefined && cambios.patente !== vehiculo.patente) {
        if (await vehiculosRepository.buscarPorPatente(cambios.patente)) {
            throw httpError(409, `Ya existe un vehiculo con esa patente ${cambios.patente}`)
        }
    }
    const cambiosLimpios = {}
    for (const campo of CAMPOS_MODIFICABLES) {
        if (cambios[campo] !== undefined) {
            cambiosLimpios[campo] = typeof cambios[campo] === 'string' ? cambios[campo].trim() : cambios[campo]
        }
    }

    return vehiculosRepository.modificar(vehiculo.id, cambiosLimpios)
}

async function eliminar(id){
    const vehiculo = await buscar(id)
    try{
        await vehiculosRepository.eliminar(vehiculo)
    }catch (err){
        if(err.code === '23503' || err.code === '23001'){
            throw httpError(409, `El vehiculo no puede eliminarse si esta asociado a otro elemento`)
        }else throw err
    }
}

// parte de duenios

async function listarDuenos(id){
    const vehiculo = await buscar(id)
    return vehiculosRepository.obtenerDuenos(vehiculo.id)
}

async function buscarDueno(id, idCliente){
    const vehiculo = await buscar(id)
    const cliente = await clienteServicio.buscar(idCliente)
    const dueno =  await vehiculosRepository.obtenerDueno(vehiculo.id, cliente.id)
    if(!dueno){
        throw httpError(404, `el cliente con documento ${cliente.documento}, no es dueño de este vehiculo`)
    }
    return dueno
}

async function asociarDueno(id, idCliente){
    const vehiculo = await buscar(id)
    if ( idCliente === undefined){
        throw httpError(400, `Falta el id del Cliente`)
    }
    const cliente = await clienteServicio.buscar(idCliente)
    const dueno =  await vehiculosRepository.obtenerDueno(vehiculo.id, cliente.id)
    if(dueno){
        return vehiculosRepository.actualizarDueno(vehiculo.id, cliente.id)
    }
    return vehiculosRepository.asociarDueno(vehiculo.id, cliente.id)
}

async function desasociarDueno(id, idCliente){
    const vehiculo = await buscar(id)
    const cliente = await clienteServicio.buscar(idCliente)
    const dueno = await vehiculosRepository.obtenerDueno(vehiculo.id, cliente.id)
    if(!dueno){
        throw httpError(404, `el cliente con documento ${cliente.documento}, no es dueño de este vehiculo, asi que no se puede desasociar`)
    }
    return vehiculosRepository.desasociarDueno(vehiculo.id, cliente.id)

}

async function verHistorialService(id){
    const vehiculo = await buscar(id)
    return vehiculosRepository.verHistorialService(vehiculo.id)
}

async function gestionarAviso(id, datos, idEmpleado){
    const estado = datos?.estado
    if(!ESTADOS_GESTION_AVISO.includes(estado)){
        throw httpError(400, `El estado debe ser ${ESTADOS_GESTION_AVISO.join(' o ')}`)
    }
    const vehiculo = await buscar(id)
    const aviso = await vehiculosRepository.gestionarAviso(vehiculo.id, estado, idEmpleado)
    if(!aviso){
        throw httpError(409, `El vehiculo ${vehiculo.patente} no tiene un aviso de service pendiente`)
    }
    return aviso
}

async function programarAviso(id, meses = 6){
    const vehiculo = await buscar(id)
    const mesesValidos = Number.isInteger(meses) && meses > 0 ? meses : 6
    return vehiculosRepository.programarAviso(vehiculo.id, mesesValidos)
}


export default 
{   listar,
    buscar,
    alta,
    modificar,
    eliminar, 
    listarDuenos,
    buscarDueno,
    asociarDueno,
    desasociarDueno,
    verHistorialService,
    gestionarAviso,
    programarAviso
}
