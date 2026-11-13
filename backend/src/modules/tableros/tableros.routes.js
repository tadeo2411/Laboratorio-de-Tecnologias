import {Router} from 'express';
import { verificarToken } from '../../middlewares/verificarToken.js';
import tablerosController from './tableros.controller.js'

const router = Router()
router.use(verificarToken)

router.get('/ordenes', tablerosController.obtenerOrdenes)
router.get('/resumen:meses', tablerosController.obtenerOrdenesUltimosMeses)
router.get('/turnos', tablerosController.obtenerProximosTurnos)
router.get('/info', tablerosController.obtenerInfoFinanciera)

export default router