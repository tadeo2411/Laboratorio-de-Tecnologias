// mapea cada metodo + url a una funcion de controller
import express from 'express'
import authController from './auth.controller.js'
import { verificarToken } from '../../middlewares/verificarToken.js'
import { soloAdministrador } from '../../middlewares/soloAdministrador.js'

const router = express.Router()

router.post('/login', authController.login)
router.get('/perfil', verificarToken, authController.perfil)
router.get('/empleados', verificarToken, authController.listarEmpleados)
router.get('/empleados/todos', verificarToken, soloAdministrador, authController.listarTodosLosEmpleados)
router.post('/empleados',verificarToken,soloAdministrador,authController.crearEmpleado)


export default router
