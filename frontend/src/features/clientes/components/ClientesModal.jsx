import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

function ClientesModal({ children, titulo, onCerrar }) {
    const modalRef = useRef(null)

    useEffect(() => {
        const elemento = modalRef.current
        const disparador = document.activeElement
        const modal = new window.bootstrap.Modal(elemento)

        elemento.addEventListener('hidden.bs.modal', onCerrar)
        modal.show()

        return () => {
            elemento.removeEventListener('hidden.bs.modal', onCerrar)
            // Como en turnos, sin fade el fondo se elimina antes del desmontaje.
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
            id="clienteModal"
            tabIndex={-1}
            aria-labelledby="clienteModalTitulo"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="modal-title fs-5" id="clienteModalTitulo">{titulo}</h2>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar formulario" />
                    </div>
                    <div className="modal-body">{children}</div>
                </div>
            </div>
        </div>,
        document.body,
    )
}

export default ClientesModal
