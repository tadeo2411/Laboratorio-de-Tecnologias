import botonEliminar from '../../assets/icons/botonEliminar.png'
import "../compartido.css"
function BotonEliminar({ onClick }) {
    return(
        <button type ='button'
        className="botonEliminar btn btn-danger"
        onClick={onClick}
        >
                <img src={botonEliminar} alt="Eliminar cliente"/>
        </button>
    )
}

export default BotonEliminar