import Footer from './FooterLanding/Footer.jsx'
import NavBarLanding from './NavBarLanding/NavBarLanding.jsx'
import { ScrollRestoration, Outlet } from 'react-router'
import './LayoutLanding.css'

function LayoutLanding(){
    return(
        <div className="layout-landing">
            <NavBarLanding />

            <Outlet />

            <Footer />

            <ScrollRestoration />
        </div>
    )
}
export default LayoutLanding
