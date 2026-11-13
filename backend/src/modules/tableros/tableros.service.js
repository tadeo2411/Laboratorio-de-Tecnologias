import { httpError } from "../../utils/httpError.js";
import tablerosRepository from "./tableros.repository.js";

function validarMeses(cantMeses){
    const meses = Number(cantMeses)
    if(meses < 0)
        throw httpError(400, 'Ingrese una cantidad de meses validos')
    if(meses > 120)//maximo 10 anios para ver cuantas ordenes puede calcular
        throw httpError(400, 'Puede ver como maximo desde hace 120 meses (10 años)')
}

async function obtenerOrdenes(){
    return await tablerosRepository.obtenerOrdenesVivas()
}

async function obtenerOrdenesUltimosMeses(cantMeses){
    const mesesValidados = validarMeses(cantMeses)
    return await tablerosRepository.obtenerOrdenesUltimosMeses(mesesValidados)
}

async function obtenerProximosTurnos(){
    return await tablerosRepository.obtenerProximosTurnos()
}

async function obtenerInfoFinanciera(){
    return await tablerosRepository.obtenerInfoFinanciera()
}

export default {obtenerInfoFinanciera, obtenerOrdenes, obtenerOrdenesUltimosMeses, obtenerProximosTurnos}