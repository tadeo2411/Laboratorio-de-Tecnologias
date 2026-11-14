import { textoRol } from "../../auth";
import { iniciales } from "../utils/cuenta";

function MiCuenta({ cuenta }) {
    return (
        <div className="mi-cuenta">
            <div className="cuenta-avatar cuenta-avatar-grande">{iniciales(cuenta.nombre)}</div>
            <div className="mi-cuenta-datos">
                <h2>{cuenta.nombre}</h2>
                <span className="cuenta-usuario">@{cuenta.usuario}</span>
                <div className="mi-cuenta-etiquetas">
                    <span className={`cuenta-badge cuenta-rol-${cuenta.rol.toLowerCase()}`}>{textoRol(cuenta.rol)}</span>
                    <span className="cuenta-badge cuenta-activo">Activo</span>
                </div>
            </div>
            <dl className="mi-cuenta-info">
                <div><dt>Usuario</dt><dd>{cuenta.usuario}</dd></div>
                <div><dt>Rol</dt><dd>{textoRol(cuenta.rol)}</dd></div>
            </dl>
        </div>
    );
}

export default MiCuenta;
