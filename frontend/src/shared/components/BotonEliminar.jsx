import BotonEliminarSVG from '../../assets/icons/botonEliminar.svg?react'
import '../compartido.css'

function BotonEliminar({ onClick, ...props }) {
  return (
    <button
      type="button"
      className="botonEliminar"
      onClick={onClick}
      aria-label="Eliminar"
      {...props}
    >
      <BotonEliminarSVG aria-hidden="true" focusable="false" />
    </button>
  )
}

export default BotonEliminar
