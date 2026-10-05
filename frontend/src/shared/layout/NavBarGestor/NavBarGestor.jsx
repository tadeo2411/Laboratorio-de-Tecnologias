import { NavLink } from 'react-router';
import { useState } from 'react';
import './navBarGestor.css';

function NavBarGestor({ usuario, onCerrarSesion }) {
    const [menuAbierto, setMenuAbierto] = useState(false)
    const cerrarMenu = () => setMenuAbierto(false)
    return (
        <>
            <header className='navbar-gestor'>

                <img className="logo" src="/images/logo-303mei.jpg" alt="Logo" height="100px" width="100px" />

                <button className="btn-menu"
                id="botonNavGestor"
                type="button"
                aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
                aria-controls="menuNavegacion"
                aria-expanded={menuAbierto}
                onClick={() => setMenuAbierto((abierto) => !abierto)}>
                    {menuAbierto ? 'Cerrar' : 'Menú'}
                </button>
                <nav>

                    <ul className={`barra-gestor ${menuAbierto ? 'barra-gestor--abierto' : ''}`}
                    id="menuNavegacion"
                    >
                        <li><NavLink  to="" className="hoverNavBar" onClick={cerrarMenu}>Tableros</NavLink></li>
                        <li><NavLink to="ordenes" className="hoverNavBar" onClick={cerrarMenu}>Ordenes</NavLink></li>
                        <li ><NavLink to="turnos" className="hoverNavBar" onClick={cerrarMenu}>Turnos</NavLink></li>
                        <li ><NavLink to="presupuestos" className="hoverNavBar" onClick={cerrarMenu}>Presupuestos</NavLink></li>
                        <li ><NavLink to="clientes" className="hoverNavBar" onClick={cerrarMenu}>Clientes</NavLink></li>
                        <li ><NavLink to="vehiculos" className="hoverNavBar" onClick={cerrarMenu}>Vehículos</NavLink></li>
                        <li ><NavLink to="repuestos" className="hoverNavBar" onClick={cerrarMenu}>Repuestos</NavLink></li>

                    

                        {usuario && (
                            <li className="usuario-info barra-gestor__sesion">
                                <span className="usuario-info__nombre">{usuario.nombre}</span>
                                <button type="button" className="btn-cerrar-sesion" onClick={() => {
                                    cerrarMenu()
                                    onCerrarSesion()
                                }}>
                                    Cerrar sesión
                                </button>
                            </li>
                        )}
                    </ul>
                </nav>

            </header>
        </>
    );
}

export default NavBarGestor;
