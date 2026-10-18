import img_cuenta from "../../../assets/icons/cuentaIcono.svg"
import "../../estilos.css"

function CuentaPage() {
    return (
        <div className="contenedor">
            <div className="page-header">
                <div className="page-header-image">
                    <img src={img_cuenta} alt="Cuenta" />
                </div>
                <div className="page-header-title">
                    <h1>Cuenta</h1>
                    <p>Tus datos y los empleados del taller.</p>
                </div>
            </div>
        </div>
    );
}

export default CuentaPage;
