import BotonEditarSVG from '../../assets/icons/botonEditar.svg?react'
import "../compartido.css"
function BotonEditar({ onClick }) {
    return(
        
        <button type ='button'
        className="botonEditar"
        onClick={onClick}
        >
            <BotonEditarSVG   alt = "eliminar"/>
            
        </button>
       
    )
}

export default BotonEditar
