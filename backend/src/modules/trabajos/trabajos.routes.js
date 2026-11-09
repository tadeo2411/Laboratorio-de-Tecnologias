// mapea cada metodo + url a una funcion de controller
import {Router} from 'express';
import controller from "./trabajos.controller.js";
import { verificarToken } from '../../middlewares/verificarToken.js';

const router = Router();

router.use(verificarToken);

router.get("/", controller.listar);
router.post("/", controller.cargar);

router.get("/tipoTrabajos", controller.listarTipos);


router.patch("/:id", controller.modificar);
router.delete("/:id", controller.eliminar);
router.get("/:id", controller.buscar);



export default router;