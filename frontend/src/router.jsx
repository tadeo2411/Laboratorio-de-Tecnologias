import {createBrowserRouter, RouterProvider} from 'react-router'

import LayoutLanding from './shared/layout/LayoutLanding'
import PaginaInicial from './features/home/PaginaInicial/pages/PaginaInicial'
import { Children } from 'react'

export const router = createBrowserRouter([
    // rutas de la Landing
    {
        path: '/',
        element: <LayoutLanding />,
        
        children:[
            {index : true, element : <PaginaInicial />} // Deberiamos crear otra sentencia
                                                        //si queremos otra pag de sección de carreras
        ],
    }
    /*{
        path: 'login',
        //element: aa,//la/s componente/s del login
        //creo q deben ir las validaciones del login
    },
    {
        path : '/gestor',

    }*/ //no me carga si no comento
    ]
)