import botonEliminar from '../../assets/icons/botonEliminar.png'

function BotonEliminar({ onClick }) {
    return(
        <button type ='button'
        className="btn btn-danger btn-sm"
        onClick={onClick}
        >
                <img src={botonEliminar} alt="Eliminar cliente"/>
        </button>
    )
}

export default BotonEliminar