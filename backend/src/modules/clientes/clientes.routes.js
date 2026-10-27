// mapea cada metodo + url a una funcion de controller
// import { verificarToken } from '../../middlewares/verificarToken.js';
import  clientesController  from'./clientes.controller.js'
import express from 'express'
import { verificarToken } from '../../middlewares/verificarToken.js'

const router = express.Router();
//lo saco cuando verifiquemos todo
router.use(verificarToken)

router.get('/', clientesController.listar)
router.get('/:id', clientesController.buscar)
router.post('/', clientesController.alta)
router.patch('/:id', clientesController.modificar)
router.delete('/:id', clientesController.eliminar)

export default router
