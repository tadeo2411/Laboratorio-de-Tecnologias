// mapea cada metodo + url a una funcion de controller
import {Router} from 'express';
import controller from "./turnos.controller.js";

const router = Router();

router.get("/", controller.listar);
router.post("/", controller.cargar);
router.patch("/:id", controller.modificar);
router.delete("/:id", controller.eliminar);
router.get("/:id", controller.buscar);

export default router;