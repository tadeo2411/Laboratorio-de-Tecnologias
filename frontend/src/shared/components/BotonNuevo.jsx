import botonMas from '../../assets/icons/botonMas.png'
import "../compartido.css"
function BotonNuevo({ onClick,  componente, esFemenino = false }) {
    const palabraNuevo = esFemenino ? "Nueva" : "Nuevo"
    return (
        <button
        type="button"
        onClick={onClick}
        className="btnNuevo"
        aria-label={` ${palabraNuevo} ${componente}`}>
            <img src={botonMas} />
            <span> {palabraNuevo} {componente} </span>
        </button>
    )
}
export default BotonNuevo
