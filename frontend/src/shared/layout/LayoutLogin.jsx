import { Outlet } from "react-router";
import './LayoutLogin.css';

// Estructura de las pantallas de acceso. El formulario de login vive en la
// feature auth (features/auth/pages/LoginPage.jsx) y se muestra en el <Outlet />.
function LayoutLogin() {
    return (
        <main className="layout-login">
            <Outlet />
        </main>
    );
}

export default LayoutLogin;
