import botonEditar from '../../assets/icons/botonEditar.png'

function BotonEditar({ onClick }) {
    return(
        <button type ='button'
        className="btn btn-primary btn-sm"
        onClick={onClick}
        >
                <img src={botonEditar} alt="Editar datos del cliente"/>
        </button>
    )
}

export default BotonEditar