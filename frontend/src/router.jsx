import { createBrowserRouter } from 'react-router'

import LayoutLanding from './shared/layout/LayoutLanding'
import PaginaInicial from './features/home/PaginaInicial/pages/PaginaInicial'
import LayoutLogin from './shared/layout/LayoutLogin'
import LayoutGestor from './shared/layout/LayoutGestor'
import Tablero from './features/gestor/tablero/pages/Tablero'
import Ordenes from './features/gestor/tablero/pages/Ordenes'
<<<<<<< HEAD
import Presupuestos from './features/presupuestos/pages/PresupuestosPage'
import Repuestos from './features/gestor/tablero/pages/Repuestos'
import Turnos from './features/turnos/pages/Turnos'
import Vehiculos from './features/gestor/tablero/pages/Vehiculos'
=======
import Presupuestos from './features/gestor/tablero/pages/Presupuestos'
import Turnos from './features/gestor/tablero/pages/Turnos'
import VehiculoPage from './features/Vehiculo/VehiculoPage'
import RepuestoPage from './features/Repuestos/RepuestoPage'
>>>>>>> c6d65f5e9ce2b7f504addeb062fb9df2ab76407b
import Clientes from './features/gestor/tablero/pages/Clientes'

export const router = createBrowserRouter([
    // rutas de la Landing
    {
        path: '/',
        element: <LayoutLanding />,

        children: [
            { index: true, element: <PaginaInicial /> } // Deberiamos crear otra sentencia
            //si queremos otra pag de sección de carreras
        ],
    },
    {
        path: '/login',
        element: <LayoutLogin />
        //element: aa,//la/s componente/s del login
        //creo q deben ir las validaciones del login
    },
    {
        path: '/gestor',
        element: <LayoutGestor />,
        children: [
            {
                index: true,
                element: <Tablero />
            },
            {
                path: "ordenes",
                element: <Ordenes />
            },
            {
                path: "turnos",
                element: <Turnos />
            },
            {
                path: "presupuestos",
                element: <Presupuestos />
            },
            {
                path: "clientes",
                element: <Clientes />
            },
            {
                path: "vehiculos",
                element: <VehiculoPage />
            },
            {
                path: "repuestos",
                element: <RepuestoPage />
            }
        ]
    } //no me carga si no comento
]
)
