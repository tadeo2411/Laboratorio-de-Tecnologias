import botonEditar from '../../assets/icons/botonEditar.png'
import "../compartido.css"
function BotonEditar({ onClick }) {
    return(
        
        <button type ='button'
        className="botonEditar btn btn-primary"
        onClick={onClick}
        >
                <img src={botonEditar} alt="Editar datos del cliente"/>
        </button>
       
    )
}

export default BotonEditar