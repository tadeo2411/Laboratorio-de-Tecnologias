import BotonEditarSVG from '../../assets/icons/botonEditar.svg?react'
import "../compartido.css"
function BotonEditar({ onClick, etiqueta = "Editar" }) {
    return(
        
        <button type ='button'
        className="botonEditar"
        onClick={onClick}
        aria-label={etiqueta}
        title={etiqueta}
        >
            <BotonEditarSVG aria-hidden="true" focusable="false" />
            
        </button>
       
    )
}

export default BotonEditar
