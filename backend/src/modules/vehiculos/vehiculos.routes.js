// mapea cada metodo + url a una funcion de controller

import vehiculosController from './vehiculos.controller.js'
import express from 'express'
import { verificarToken } from '../../middlewares/verificarToken.js'


const router = express.Router();
router.use(verificarToken)
router.get('/', vehiculosController.listar)
router.get('/:id', vehiculosController.buscar)
router.get('/:id/duenos', vehiculosController.listarDuenos)
router.get('/:id/duenos/:idCliente', vehiculosController.buscarDueno)
router.post('/:id/duenos', vehiculosController.asociarDueno)
router.delete('/:id/duenos/:idCliente', vehiculosController.desasociarDueno)
router.post('/', vehiculosController.alta)
router.patch('/:id', vehiculosController.modificar)
router.delete('/:id', vehiculosController.eliminar)
router.get('/:id/historial', vehiculosController.verHistorialService)
// router.patch('/:id/aviso', vehiculosController.gestionarAviso)



export default router