// mapea cada metodo + url a una funcion de controller

import vehiculosController from './vehiculos.controller.js'
import express from 'express'

const router = express.Router();

router.get('/', vehiculosController.listar)
router.get('/:id', vehiculosController.buscar)
router.post('/', vehiculosController.alta)
router.patch('/:id', vehiculosController.modificar)
router.delete('/:id', vehiculosController.eliminar)




export default router