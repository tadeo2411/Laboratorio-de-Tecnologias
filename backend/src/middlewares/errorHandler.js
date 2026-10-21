function errorHandler(err, req, res, next) {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'El cuerpo del pedido no es un JSON válido' })
    }

    const status = err.status ?? 500

    if (status === 500) {
        console.error(err)
        return res.status(500).json({ error: 'Error interno del servidor' })
    }

    res.status(status).json({ error: err.message })
}

module.exports = { errorHandler }
