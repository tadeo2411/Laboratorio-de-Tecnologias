import { useId } from "react";
import "../compartido.css"
function Modal({
    titulo,
    onCerrar,
    cerrarAlTocarFondo = true,
    onEscSalida,
    children,
}) {
    const idTitulo = useId();

    const manejarClickFondo = (event) => {
        if (
            cerrarAlTocarFondo &&
            event.target === event.currentTarget
        ) {
            onCerrar();
        }
    };

    // const handleEscSalida = (event) =>{
    //     if
    // }


    return (
        <div
            className="modal-fondo"
            role="presentation"
            onMouseDown={manejarClickFondo}
            onEscSalida = {handleEscSalida}
        >
            <section
                className="modal-contenido"
                role="dialog"
                aria-modal="true"
                aria-labelledby={idTitulo}
            >
                <div className="modal-cabecera">
                    <h2 id={idTitulo}>{titulo}</h2>

                    <button
                        type="button"
                        className="modal-cerrar"
                        onClick={onCerrar}
                        aria-label="Cerrar"
                    >
                        ×
                    </button>
                </div>

                {children}
            </section>
        </div>
    );
}

export default Modal;