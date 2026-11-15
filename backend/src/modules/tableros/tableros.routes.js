import {Router} from 'express';
import { verificarToken } from '../../middlewares/verificarToken.js';
import { soloAdministrador } from '../../middlewares/soloAdministrador.js'
import tablerosController from './tableros.controller.js'

const router = Router()
router.use(verificarToken)

router.get('/ordenes', tablerosController.obtenerOrdenes)
router.get('/resumen', tablerosController.obtenerOrdenesUltimosMeses)
router.get('/turnos', tablerosController.obtenerProximosTurnos)
router.get('/info', soloAdministrador, tablerosController.obtenerInfoFinanciera)

export default router