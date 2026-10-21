// mapea cada metodo + url a una funcion de controller
const express = require('express')
const authController = require('./auth.controller')
const { verificarToken } = require('../../middlewares/verificarToken')

const router = express.Router()

router.post('/login', authController.login)
router.get('/perfil', verificarToken, authController.perfil)

module.exports = router
