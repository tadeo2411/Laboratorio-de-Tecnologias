// es quien recibe las req y responde res
// llama al service y responde con status + JSON.
import service from "./tableros.service.js"

const resumen = async (req, res, next) => {
    try {
        res.json(await service.resumen());
    } catch (err) {
        next(err);
    }
}

const ordenesPorEstado = async (req, res, next) => {
    try {
        res.json(await service.ordenesPorEstado());
    } catch (err) {
        next(err);
    }
}

export default { resumen, ordenesPorEstado }
