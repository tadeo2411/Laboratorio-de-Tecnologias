import FooterGestor from "./FooterGestor/FooterGestor";
import NavBarGestor from "./NavBarGestor/NavBarGestor";
import { Outlet } from "react-router";

// Recibe el usuario y la acción de cerrar sesión por props (desde GestorProtegido),
// así el layout no depende de la feature auth.
function LayoutGestor({ usuario, onCerrarSesion }) {
    return (
        <>
            <NavBarGestor usuario={usuario} onCerrarSesion={onCerrarSesion} />
            <main className = 'contenido'>
                <Outlet />
            </main>
            {/* <FooterGestor /> */}
        </>
    );
}

export default LayoutGestor;