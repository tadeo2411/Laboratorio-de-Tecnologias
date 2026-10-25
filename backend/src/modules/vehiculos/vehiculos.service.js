// aca va la logica de negocio. Genera id y llama a repository
import vehiculosRepository from './vehiculos.repository.js'
import {httpError} from '../../utils/httpError.js'

const CAMBIOS_MODIFICABLES =['patente', 'marca', 'modelo', 'anio', 'descripcion']

async function normalizar(patente){
    
}