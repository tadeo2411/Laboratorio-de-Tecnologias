// mapea cada metodo + url a una funcion de controller
import clientesController from './clientes.controller.js';
import express from 'express';

const router = express.Router();

router.get('/', clientesController.listarClientes);

export default router;