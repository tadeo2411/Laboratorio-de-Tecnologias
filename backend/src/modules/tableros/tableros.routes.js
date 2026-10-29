// mapea cada metodo + url a una funcion de controller
import { Router } from 'express';
import controller from "./tableros.controller.js";
import { verificarToken } from '../../middlewares/verificarToken.js'

const router = Router();

// router.use(verificarToken);

router.get("/resumen", controller.resumen);
router.get("/ordenes", controller.ordenesPorEstado);

export default router;
