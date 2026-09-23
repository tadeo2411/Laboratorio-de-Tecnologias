import { createBrowserRouter, RouterProvider } from 'react-router'

import LayoutLanding from './shared/layout/LayoutLanding'
import PaginaInicial from './features/home/PaginaInicial/pages/PaginaInicial'
import { Children } from 'react'
import LayoutLogin from './shared/layout/LayoutLogin'
import LayoutGestor from './shared/layout/LayoutGestor'
import Tablero from './features/home/gestor/tablero/pages/Tablero'
import Ordenes from './features/home/gestor/tablero/pages/Ordenes'
import Presupuestos from './features/home/gestor/tablero/pages/Presupuestos'
import Repuestos from './features/home/gestor/tablero/pages/Repuestos'
import Turnos from './features/home/gestor/tablero/pages/Turnos'
import Vehiculos from './features/home/gestor/tablero/pages/Vehiculos'
import Clientes from './features/home/gestor/tablero/pages/Clientes'

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
                element: <Vehiculos />
            },
            {
                path: "repuestos",
                element: <Repuestos />
            }
        ]
    } //no me carga si no comento
]
)