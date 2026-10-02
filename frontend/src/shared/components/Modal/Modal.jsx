import { useId } from 'react'
import './Modal.css'

// Ventana modal genérica: no conoce vehículos ni ningún otro concepto del taller.
// Con cerrarAlTocarFondo={false} un toque fuera de la ventana no la cierra,
// para no perder lo que se estaba cargando en un formulario.
function Modal({ titulo, onCerrar, cerrarAlTocarFondo = true, children }) {
  const idTitulo = useId()

  return (
    <div
      className="modal-fondo"
      role="presentation"
      onMouseDown={cerrarAlTocarFondo ? onCerrar : undefined}
    >
      <section
        className="modal-contenido"
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-cabecera">
          <h2 id={idTitulo}>{titulo}</h2>
          <button type="button" className="modal-cerrar" onClick={onCerrar} aria-label="Cerrar">
            ×
          </button>
        </div>
        {children}
      </section>
    </div>
  )
}

export default Modal
