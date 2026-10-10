import { useState } from 'react'
import "../compartido.css"

function NavBarLanding() {
    const [menuAbierto, setMenuAbierto] = useState(false)

    const cerrarMenu = () => setMenuAbierto(false)

    return (
        <header className="navbar-landing">
            <div className="navbar-landing__contenido">
                <div className="navbar-landing__logo-contenedor">
                    <a href="#inicio">
                        <img
                            className="navbar-landing__logo"
                            src="/images/logo-303mei.jpg"
                            alt="303 Mecánica e Inyección"
                        />
                    </a>
                </div>

                <button
                    className="navbar-landing__boton-menu"
                    type="button"
                    aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
                    aria-controls="menuNavegacion"
                    aria-expanded={menuAbierto}
                    onClick={() => setMenuAbierto(!menuAbierto)}
                >
                    {menuAbierto ? 'X' : '☰'}
                </button>

                <div className="navbar-landing__nav-contenedor">
                    <nav className="navbar-landing__nav">
                        <ul
                            className={`navbar-landing__menu ${menuAbierto ? 'navbar-landing__menu--abierto' : ''}`}
                            id="menuNavegacion"
                        >
                            <li className="navbar-landing__item"><a className="navbar-landing__enlace" href="#servicios" onClick={cerrarMenu}>Servicios</a></li>
                            <li className="navbar-landing__item"><a className="navbar-landing__enlace" href="#faq" onClick={cerrarMenu}>Preguntas</a></li>
                            <li className="navbar-landing__item"><a className="navbar-landing__enlace" href="#footer" onClick={cerrarMenu}>Contacto</a></li>
                            <li className="navbar-landing__item navbar-landing__item--turno">
                                <a
                                    className="navbar-landing__boton-turno"
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
    )
}

export default NavBarLanding
