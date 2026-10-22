// es quien recibe las req y responde res
// Lee `req.params` / `req.body`,
// llama al service y responde con status + JSON.
import service from "./repuestos.service.js"

const listar = async (req, res, next) => {
    try {
        res.json(service.listar());
    } catch (err) {
        next(err);
    }
}

export default {listar}