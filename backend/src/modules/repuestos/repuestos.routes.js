// mapea cada metodo + url a una funcion de controller
import {Router} from 'express';
import controller from "./repuestos.controller.js";

const router = Router();

router.get("/", controller.listar);
router.post("/cargar", controller.cargar);
router.patch("/modificar", controller.modificar);
router.delete("/eliminar", controller.eliminar);

export default router;