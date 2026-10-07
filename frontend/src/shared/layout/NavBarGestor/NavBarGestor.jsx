
import './navBarGestor.css';

function NavBarGestor({ usuario, onCerrarSesion }) {
    return (
        <>
            <header className='navbar-gestor'>

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
                        <li ><NavLink to="trabajos" className="hoverNavBar" onClick={cerrarMenu}>Trabajos</NavLink></li>
                    

                        {usuario && (
                            <div className="usuario-info barra-gestor__sesion">
                                <span className="usuario-info__nombre">{usuario.nombre}</span>
                                <button type="button" className="btn-cerrar-sesion" onClick={() => {
                                    onCerrarSesion()
                                }}>
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                   
                </nav>

            </header>
        </>
    );
}

export default NavBarGestor;
