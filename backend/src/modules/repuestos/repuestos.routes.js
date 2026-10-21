// mapea cada metodo + url a una funcion de controller
import {Router} from 'express';
import controller from "./repuestos.controller.js";

const router = Router();

router.get("/", controller.listar);

export default router;