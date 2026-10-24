// mapea cada metodo + url a una funcion de controller
import { verificarToken } from '../../middlewares/verificarToken.js';
import  clientesController  from'./clientes.controller.js'
import express from 'express'

const router = express.Router();

router.use(verificarToken)

router.get('/', clientesController.listar)
router.get('/:id', clientesController.buscar)
router.post('/', clientesController.alta)
router.patch('/:id', clientesController.modificar)

export default router
