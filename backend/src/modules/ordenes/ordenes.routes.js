// mapea cada metodo + url a una funcion de controller
const express = require('express')
const ordenesController = require('./ordenes.controller')
const { verificarToken } = require('../../middlewares/verificarToken')

const router = express.Router()

router.use(verificarToken)

router.get('/', ordenesController.listar)
router.get('/:id', ordenesController.obtener)
router.post('/', ordenesController.crear)
router.patch('/:id', ordenesController.actualizar)
router.patch('/:id/estado', ordenesController.cambiarEstado)
router.post('/:id/fichas', ordenesController.agregarFicha)
router.post('/:id/trabajos', ordenesController.agregarTrabajo)
router.delete('/:id/trabajos/:idTrabajo', ordenesController.quitarTrabajo)

module.exports = router
