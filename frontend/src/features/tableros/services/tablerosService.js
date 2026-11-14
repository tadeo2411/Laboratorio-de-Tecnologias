import {obtenerToken, manejarSesionVencida} from '../../auth/services/authService'

const URL = 'http://localhost:3000/api/tableros'

async function pedir(ruta, opciones = {}) {
    const headers = { Authorization: `Bearer ${obtenerToken()}` }
    if (opciones.body) headers['Content-Type'] = 'application/json'

    let respuesta
    try {
        respuesta = await fetch(`${URL}${ruta}`, { ...opciones, headers })
    } catch {
        throw new Error('No se pudo conectar con el servidor.')
    }

    manejarSesionVencida(respuesta)
    const datos = respuesta.status === 204 ? null : await respuesta.json()

    if (!respuesta.ok) {
        throw new Error(datos?.error || datos?.mensaje || 'Ocurrió un error cargando el tablero.')
    }
    return datos
}

export async function ordenesActivas(){
    return pedir('/ordenes')
}

export async function ordenesXMeses(meses){
    const ruta = meses ? `/resumen?meses=${meses}` : '/resumen'
    return pedir(ruta)
}

export async function infoFinanciera(){
    return pedir('/info')
}

export async function proximosTurnos(){
    return pedir('/turnos')
}