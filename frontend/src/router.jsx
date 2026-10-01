import { createBrowserRouter } from 'react-router'

import LayoutLanding from './shared/layout/LayoutLanding'
import PaginaInicial from './features/home/PaginaInicial/pages/PaginaInicial'
import LayoutLogin from './shared/layout/LayoutLogin'
import LayoutGestor from './shared/layout/LayoutGestor'
import Tablero from './features/gestor/tablero/pages/Tablero'
import Ordenes from './features/gestor/tablero/pages/Ordenes'
import Presupuestos from './features/presupuestos/pages/PresupuestosPage'
import Turnos from './features/turnos/pages/Turnos'
import VehiculosPage from './features/vehiculos/pages/VehiculosPage'
import RepuestosPage from './features/repuestos/pages/RepuestosPage'

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
                element: <VehiculosPage />
            },
            {
                path: "repuestos",
                element: <RepuestosPage />
            }
        ]
    } //no me carga si no comento
]
)
