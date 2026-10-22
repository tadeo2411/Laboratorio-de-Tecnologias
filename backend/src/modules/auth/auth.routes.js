// mapea cada metodo + url a una funcion de controller
import express from 'express'
import authController from './auth.controller.js'
import { verificarToken } from '../../middlewares/verificarToken.js'

const router = express.Router()

router.post('/login', authController.login)
router.get('/perfil', verificarToken, authController.perfil)

export default router
