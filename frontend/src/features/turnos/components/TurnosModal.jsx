import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'


function TurnosModal({ children, onCerrar, comp }) {
    const modalRef = useRef(null)
comp = 'turno'
    useEffect(() => {
        const elemento = modalRef.current
        const disparador = document.activeElement
        const modal = new window.bootstrap.Modal(elemento)

        elemento.addEventListener('hidden.bs.modal', onCerrar)
        modal.show()

        return () => {
            elemento.removeEventListener('hidden.bs.modal', onCerrar)
            // Sin la clase fade, hide elimina el fondo y desbloquea el scroll
            // antes de que React desmonte el modal
            modal.hide()
            modal.dispose()
            if (disparador instanceof HTMLElement && disparador.isConnected) {
                disparador.focus()
            }
        }
    }, [onCerrar])

    return createPortal(
        <div
            ref={modalRef}
            className="modal"
            id="nuevoTurnoModal"
            tabIndex={-1}
            aria-labelledby="nuevoTurnoModalTitulo"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="modal-title fs-5" id="nuevoTurnoModalTitulo">Nuevo {comp}</h2>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Cerrar formulario"
                        />
                    </div>
                    <div className="modal-body">{children}</div>
                </div>
            </div>
        </div>,
        document.body,
    )
}

export default TurnosModal
