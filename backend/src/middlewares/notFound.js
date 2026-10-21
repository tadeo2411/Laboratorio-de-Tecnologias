function notFound(req, res){
    res.status(404).json({error : "Ruta no Existente"})
}

module.exports = notFound