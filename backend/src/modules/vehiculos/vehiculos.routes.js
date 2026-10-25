// mapea cada metodo + url a una funcion de controller

import vehiculosController from './vehiculos.controller'
import express from 'express'

const router = express.Router();

router.get('/', vehiculosController.listar)