import { httpError } from './httpError.js'

// Para campos opcionales: si viene, tiene que ser texto y no pasar el máximo
function validarTexto(valor, nombreCampo, maximo){
    if(typeof valor !== 'string'){
        throw httpError(400, `El campo ${nombreCampo} debe ser un texto`)
    }
    if(valor.trim().length>maximo){
        throw httpError(400, `El campo ${nombreCampo} puede contener como máximo ${maximo} caracteres`)
    }
}

function validarTextoObligatorio(valor, nombreCampo, maximo){
    const esTextoNoVacio = typeof valor === 'string' && valor.trim() !== ''

    if (!esTextoNoVacio) {
        throw httpError(400, `El campo ${nombreCampo} es obligatorio y debe ser un texto`)
    }
    if(valor.trim().length>maximo){
        throw httpError(400, `El campo ${nombreCampo} puede contener como máximo ${maximo} caracteres`)
    }
}

function validarKilometraje(valor){
    if(!Number.isInteger(valor)){
        throw httpError(400, 'el kilometraje del vehiculo debe ser un numero')
    }
    if(valor < 0 || valor > 2000000 ){
        throw httpError(400, 'el Kilometraje del auto no puede ser mayor a 2.000.000 ni menor a 0')
    }

}

// Para precios y montos: número (o texto numérico) entre 0 y lo que entra en decimal(12,2)
function validarMonto(valor, nombreCampo){
    const esNumero = (typeof valor === 'number' || (typeof valor === 'string' && valor.trim() !== '')) && Number.isFinite(Number(valor))

    if (!esNumero || Number(valor) < 0 || Number(valor) > 9999999999.99) {
        throw httpError(400, `El campo ${nombreCampo} debe ser un número entre 0 y 9999999999.99`)
    }
    return Number(valor)
}

export { validarKilometraje, validarTextoObligatorio, validarTexto, validarMonto }
