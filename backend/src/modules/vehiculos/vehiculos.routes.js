// mapea cada metodo + url a una funcion de controller

import vehiculosController from './vehiculos.controller.js'
import express from 'express'

const router = express.Router();

router.get('/', vehiculosController.listar)
router.get('/:id', vehiculosController.buscar)
router.get('/:id/duenos', vehiculosController.listarDuenos)
router.get('/:id/duenos/:idCliente', vehiculosController.buscarDueno)
// router.post('/:id/duenos', vehiculosController.asignarDueno)
// router.delete('/:id/duenos/:idCliente', vehiculosController.eliminarDueno)
router.post('/', vehiculosController.alta)
router.patch('/:id', vehiculosController.modificar)
router.delete('/:id', vehiculosController.eliminar)




export default router