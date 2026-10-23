// Tiene que tener 4 parámetros (err, req, res, next): así Express sabe que es un manejador de errores.
function errorHandler(err,req,res,next){
    const status = err.status ?? 500

    // Errores "esperados" (400, 404, 409...): el mensaje es para el cliente.
    if (status < 500) {
        return res.status(status).json({error: err.message})
    }

    // Error inesperado: el detalle se queda en la terminal, al cliente le decimos poco.
    console.error(err)
    res.status(500).json({error:"Error interno del servidor"})
}
export default errorHandler
