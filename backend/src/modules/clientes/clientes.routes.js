// mapea cada metodo + url a una funcion de controller
import * as clientesController  from'./clientes.controller.js'
import express from 'express'

const router = express.Router();

router.get('/', clientesController.listarClientes)
router.get('/:documento', clientesController.buscarCliente)
router.post('/', clientesController.altaCliente)
router.patch('/:documento', clientesController.modificarCliente)

export default router
