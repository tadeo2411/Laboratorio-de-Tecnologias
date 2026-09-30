import { useEffect, useState } from 'react'
import './navBarLanding.css'

function NavBarLanding() {
    const [menuAbierto, setMenuAbierto] = useState(false)


    const cerrarMenu = () => setMenuAbierto(false)
//podría haberlo hecho con import pero no me dejaba
    return (
        <>
            <header className='navbar-landing'>
                <div className="header-contenido">
                    <div id="logo-container">
                        <a href="#inicio">
                            <img
                                id="logo"
                                src="/images/logo-303mei.jpg"
                                alt="303 Mecánica e Inyección"
                            />
                        </a>
                    </div>

                    <button
                        className="btn-menu"
                        type="button"
                        aria-controls="menuNavegacion"
                        aria-expanded={menuAbierto}
                        onClick={() => setMenuAbierto(!menuAbierto)}
                    >
                        {menuAbierto ? 'X' : '☰'}
                    </button>

                    <div id="nav-container">
                        <nav className="barra">
                            <ul
                                className={`menu-horizontal ${menuAbierto ? 'mostrar' : ''}`}
                                id="menuNavegacion"
                            >
                                <li><a href="#servicios" onClick={cerrarMenu}>Servicios</a></li>
                                <li><a href="#faq" onClick={cerrarMenu}>Preguntas</a></li>
                                <li><a href="#footer" onClick={cerrarMenu}>Contacto</a></li>
                                <li className="item-turno">
                                    <a
                                        href="https://wa.me/5492664344135?text=Hola,%20quisiera%20solicitar%20un%20turno"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={cerrarMenu}
                                    >
                                        Solicitar turno
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>
        </>
    )
}

export default NavBarLanding