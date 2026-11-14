import botonMas from '../../assets/icons/botonMas.png'
import "../compartido.css"
function BotonNuevo({ onClick,  componente, esFemenino = false }) {
    const palabraNuevo = esFemenino ? "Nueva" : "Nuevo"
    return (
        <button
        type="button"
        onClick={onClick}
        className="btnNuevo">
            <img src={botonMas} alt="" />
            <span> {palabraNuevo} {componente} </span>
        </button>
    )
}
export default BotonNuevo
