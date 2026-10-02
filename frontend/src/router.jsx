import { createBrowserRouter } from 'react-router'

import LayoutLanding from './shared/layout/LayoutLanding'
import PaginaInicial from './features/home/PaginaInicial/pages/PaginaInicial'
import LayoutLogin from './shared/layout/LayoutLogin'
import LayoutGestor from './shared/layout/LayoutGestor'
import Tablero from './features/gestor/tablero/pages/Tablero'
import OrdenesPage from './features/ordenes/pages/OrdenesPage'
import Presupuestos from './features/presupuestos/pages/PresupuestosPage'
import Turnos from './features/turnos/pages/Turnos'
import VehiculosPage from './features/vehiculos/pages/VehiculoPage'
import RepuestoPage from './features/Repuestos/RepuestoPage'
import MetricaPage from './features/metricas/pages/MetricaPage';
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
        //element: aa,//la/s componente/s del login
        //creo q deben ir las validaciones del login
    },
    {
        path: '/gestor',
        element: <LayoutGestor />,
        errorElement: <NoEncontradaPage />,
        children: [
            {
                index: true,
                element: <Tablero />
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
            },
            {
                path: "metricas",
                element: <MetricaPage />
            }
        ]
    } //no me carga si no comento
]
)
