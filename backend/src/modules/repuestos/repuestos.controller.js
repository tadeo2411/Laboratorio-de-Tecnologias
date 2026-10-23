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

const eliminar = async (req, res, next) => {
try {
        res.json(service.eliminar());
    } catch (err) {
        next(err);
    }
}

const cargar = async (req, res, next) => {
try {
        res.json(service.cargar());
    } catch (err) {
        next(err);
    }
}

const modificar = async (req, res, next) => {
try {
        res.json(service.modificar());
    } catch (err) {
        next(err);
    }
}

export default {listar, eliminar, cargar, modificar}