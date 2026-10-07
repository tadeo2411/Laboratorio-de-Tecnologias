
import './navBarGestor.css';

function NavBarGestor({ usuario, onCerrarSesion }) {
    return (
        <>
            <header className='navbar-gestor'>

                <nav>
                    <img className="logo" src="/images/logo-303mei.jpg" alt="Logo" height="100px" width="100px" />
                
                    

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
