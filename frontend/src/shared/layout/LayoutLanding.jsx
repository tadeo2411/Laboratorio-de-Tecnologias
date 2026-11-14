import Footer from './Footer.jsx'
import NavBarLanding from './NavBarLanding.jsx'
import { ScrollRestoration, Outlet } from 'react-router'


function LayoutLanding(){
    return(
        <div className="layout-landing">
            <a className="visually-hidden-focusable landing-saltar" href="#contenido">Saltar al contenido</a>
            <NavBarLanding />

            <main id="contenido" className="landing-main">
                <Outlet />
            </main>

            <Footer />

            <ScrollRestoration />
        </div>
    )
}
export default LayoutLanding
