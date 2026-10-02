import FooterGestor from "./FooterGestor/FooterGestor";
import NavBarGestor from "./NavBarGestor/NavBarGestor";
import { Outlet } from "react-router";

function LayoutGestor() {
    return (
        <>
            <NavBarGestor />
            <main className = 'contenido'>
                <Outlet />
            </main>
            {/* <FooterGestor /> */}
        </>
    );
}

export default LayoutGestor;