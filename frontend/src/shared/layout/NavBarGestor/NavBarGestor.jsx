import { NavLink } from 'react-router';
import './navBarGestor.css';

function NavBarGestor() {
    return (
        <>
            <header className='navbar-gestor'>

                <img className="logo" src="\images\logo-303mei.jpg" alt="Logo" height="100px" width="100px" />

                <button className="btn-menu" id="btnMenu"></button>
                <nav>

                    <ul className="barra-gestor" id="menuNavegacion">
                        <li><NavLink  to="" className="hoverNavBar">Tableros</NavLink></li>
                        <li><NavLink to="ordenes" className="hoverNavBar">Ordenes</NavLink></li>
                        <li ><NavLink to="turnos" className="hoverNavBar">Turnos</NavLink></li>
                        <li ><NavLink to="presupuestos" className="hoverNavBar">Presupuestos</NavLink></li>
                        <li ><NavLink to="clientes" className="hoverNavBar">Clientes</NavLink></li>
                        <li ><NavLink to="vehiculos" className="hoverNavBar">Vehículos</NavLink></li>
                        <li ><NavLink to="repuestos" className="hoverNavBar">Repuestos</NavLink></li>

                    </ul>
                </nav>

                <img className="darkTheme" src="/images/img_darkTheme.png" alt="Boton de tema oscuro" height="50px" width="50px" />
            </header>
        </>
    );
}

export default NavBarGestor;