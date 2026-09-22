import  Footer  from './FooterLanding/Footer.jsx'
import NavBarLanding from './NavBarLanding/NavBarLanding.jsx'
import { ScrollRestoration, Outlet } from 'react-router'


function LayoutLanding(){
    
    return(<>
        <NavBarLanding />

        <Outlet />


        <Footer />
        
        <ScrollRestoration />
    </>)
}
export default LayoutLanding