import { createBrowserRouter } from 'react-router'
import LayoutLanding from './shared/layout/LayoutLanding'
import PaginaInicial from './features/home/pages/PaginaInicial'
import { OrdenesPage, cargarPaginaOrdenes } from './features/ordenes'
// import Presupuestos from './features/presupuestos/pages/PresupuestosPage'
import TurnosPage from './features/turnos/pages/TurnosPage'
import { VehiculosPage } from './features/vehiculos'
import RepuestoPage from './features/repuestos/pages/RepuestosPage'
import TablerosPage from './features/tableros/pages/TablerosPage';
import TrabajosPage from './features/trabajos/pages/TrabajosPage';
import NoEncontradaPage from './shared/pages/NoEncontradaPage'
import { ClientesPage } from './features/clientes'
import { CuentaPage, cargarPaginaCuenta } from './features/cuenta'
import Spinner from './shared/components/Spinner'
import {LoginPage, GestorConSesion, protegerRuta, redirigirSiHaySesion} from './features/auth'
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
        element: <LoginPage />,
        loader: redirigirSiHaySesion,
        hydrateFallbackElement: <Spinner />,
        errorElement: <NoEncontradaPage />,

    },
    {
        // protegerRuta redirige a /login de no haber sesion.
        path: '/gestor',
        element: <GestorConSesion />,
        loader: protegerRuta,
        hydrateFallbackElement: <Spinner />,
        errorElement: <NoEncontradaPage />,
        children: [
            {
                index: true,
                element: <TablerosPage />
            },
            {
                path: "ordenes",
                element: <OrdenesPage />,
                loader: cargarPaginaOrdenes
            },
            {
                path: "turnos",
                element: <TurnosPage />
            },
            // {
            //     path: "presupuestos",
            //     element: <Presupuestos />
            // },
            {
                path: "clientes",
                element: <ClientesPage />
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
                path: "trabajos",
                element: <TrabajosPage />
            },
            {
                path: "cuenta",
                element: <CuentaPage />,
                loader: cargarPaginaCuenta
            }
        ]
    }
]
)
