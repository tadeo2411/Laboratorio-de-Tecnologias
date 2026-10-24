// es quien recibe las req y responde res
// Lee `req.params` / `req.body`,
// llama al service y responde con status + JSON.
import service from "./repuestos.service.js"

const listar = async (req, res, next) => {
    try {
        res.json(await service.listar());
    } catch (err) {
        next(err);
    }
}

const eliminar = async (req, res, next) => {
try {
        res.json(await service.eliminar(req.params.id));
    } catch (err) {
        next(err);
    }
}

const cargar = async (req, res, next) => {
try {
        res.json(await service.cargar(req.body));
    } catch (err) {
        next(err);
    }
}

const modificar = async (req, res, next) => {
try {
        res.json(await service.modificar({id : req.params.id, ...req.body}));
    } catch (err) {
        next(err);
    }
}

export default {listar, eliminar, cargar, modificar}