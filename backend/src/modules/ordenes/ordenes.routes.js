// mapea cada metodo + url a una funcion de controller
import express from 'express'
import ordenesController from './ordenes.controller.js'
import { verificarToken } from '../../middlewares/verificarToken.js'

const router = express.Router()

router.use(verificarToken)  //Preguntar esto

router.get('/', ordenesController.listar)
router.get('/:id', ordenesController.obtener)
router.post('/', ordenesController.crear)
router.patch('/:id', ordenesController.actualizar)
router.patch('/:id/estado', ordenesController.cambiarEstado)
router.post('/:id/fichas', ordenesController.agregarFicha)
router.patch('/:id/fichas/:idFicha', ordenesController.actualizarFicha)
router.post('/:id/trabajos', ordenesController.agregarTrabajo)
router.delete('/:id/trabajos/:idTrabajo', ordenesController.quitarTrabajo)

export default router
