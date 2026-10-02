import { createBrowserRouter } from 'react-router'

import LayoutLanding from './shared/layout/LayoutLanding'
import PaginaInicial from './features/home/PaginaInicial/pages/PaginaInicial'
import LayoutLogin from './shared/layout/LayoutLogin'
import LoginPage from './features/auth/pages/LoginPage'
import GestorProtegido from './features/auth/components/GestorProtegido'
import OrdenesPage from './features/ordenes/pages/OrdenesPage'
import Presupuestos from './features/presupuestos/pages/PresupuestosPage'
import Turnos from './features/turnos/pages/Turnos'
import VehiculosPage from './features/vehiculos/pages/VehiculosPage'
import RepuestoPage from './features/repuestos/pages/RepuestosPage'
import TablerosPage from './features/tableros/pages/TablerosPage';
import NoEncontradaPage from './shared/pages/NoEncontradaPage'

import Clientes from './features/gestor/tablero/pages/Clientes'

export const router = createBrowserRouter([
    // rutas de la Landing
    {
        path: '/',
        element: <LayoutLanding />,
        errorElement: <NoEncontradaPage />,
        children: [
            { index: true, element: <PaginaInicial /> } // Deberiamos crear otra sentencia
            //si queremos otra pag de sección de carreras
        ],
    },
    {
        path: '/login',
        element: <LayoutLogin />,
        errorElement: <NoEncontradaPage />,
        children: [
            { index: true, element: <LoginPage /> }
        ],
    },
    {
        // GestorProtegido controla que haya sesión antes de mostrar cualquier pantalla del gestor
        path: '/gestor',
        element: <GestorProtegido />,
        errorElement: <NoEncontradaPage />,
        children: [
            {
                index: true,
                element: <TablerosPage />
            },
            {
                path: "ordenes",
                element: <OrdenesPage />
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
                element: <RepuestoPage />
            }
        ]
    } //no me carga si no comento
]
)
