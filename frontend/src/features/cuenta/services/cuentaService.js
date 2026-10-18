import { obtenerSesion, obtenerMiCuenta, obtenerTodosLosEmpleados, esAdministrador } from '../../auth'

export async function cargarPaginaCuenta(){
    const esAdmin = esAdministrador(obtenerSesion())
    const [miCuenta, empleados] = await Promise.all([
        obtenerMiCuenta(),
        esAdmin ? obtenerTodosLosEmpleados() : []
    ])
    return { miCuenta, empleados, esAdmin }
}
