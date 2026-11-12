import express from 'express'
import presupuestosController from './presupuestos.controller.js'
import { verificarToken } from '../../middlewares/verificarToken.js'

const router = express.Router()

router.use(verificarToken)

router.get('/', presupuestosController.listar)
router.get('/trabajos-presupuestables', presupuestosController.trabajosPresupuestables)
router.get('/:id', presupuestosController.obtener)
router.post('/', presupuestosController.crear)
router.patch('/:id', presupuestosController.actualizar)
router.delete('/:id', presupuestosController.eliminar)

export default router
