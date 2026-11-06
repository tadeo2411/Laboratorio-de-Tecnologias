import BotonEliminarSVG from '../../assets/icons/botonEliminar.svg?react'
import "../compartido.css"
function BotonEliminar({ onClick }) {
    return(
        <button type ='button'
        className="botonEliminar"
        onClick={onClick}
        >
            <BotonEliminarSVG alt = "modificar"/>
        </button>
    )
}

export default BotonEliminar