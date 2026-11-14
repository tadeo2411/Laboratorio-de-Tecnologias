function errorHandler(err,req,res,next){
    const status = err.status ?? 500

    if (status < 500) {
        return res.status(status).json({error: err.message})
    }

    // 23505 es un error de postgresql por unique repetido.
    if (err.code === '23505') {
        return res.status(409).json({error: 'Ya existe un registro con esos datos'})
    }

    // 23503 es un error de postgresql por clave foránea: el registro está en uso o no existe.
    if (err.code === '23503') {
        return res.status(409).json({error: 'No se puede completar la operación porque el registro está relacionado con otros datos'})
    }

    // error inesperado
    console.error(err)
    res.status(500).json({error:"Error interno del servidor"})
}
export default errorHandler
