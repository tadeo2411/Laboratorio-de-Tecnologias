// Crea un error que lleva un código HTTP.
// El service no tiene `res`, así que cuando algo está mal "lanza" este error
// (throw) y el errorHandler lo convierte en la respuesta con ese código.
function httpError(status, mensaje) {
    const error = new Error(mensaje)
    error.status = status
    return error
}

export { httpError }
