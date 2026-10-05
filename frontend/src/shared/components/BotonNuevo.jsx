import botonMas from '../../assets/icons/botonMas.png'
import '../../features/estilos.css'
function BotonNuevo({ onClick,  componente }) {
    return (
        <button 
        type="button" 
        onClick={onClick} 
        className="btnNuevo" 
        aria-label={` Nuevo ${componente}`}>
            <img src={botonMas} />
            <span> Nuevo {componente} </span>
        </button>
    )
}
export default BotonNuevo
