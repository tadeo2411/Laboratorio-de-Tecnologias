// mapea cada metodo + url a una funcion de controller
const clientesController = require('./clientes.controller')
const express = require('express')

const router = express.Router()

router.get('/', clientesController.listarClientes)
router.get('/:documento', clientesController.buscarCliente)
router.post('/', clientesController.altaCliente)
router.patch('/:documento', clientesController.modificarCliente)

module.exports = router
