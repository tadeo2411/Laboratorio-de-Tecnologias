import { useEffect, useId } from "react";
import "../compartido.css"
function Modal({
    titulo,
    onCerrar,
    cerrarAlTocarFondo = true,

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

    // Cierra el modal al apretar Escape mientras esté montado.
    useEffect(() => {
        const handleEscSalida = (event) => {
            if (event.key === "Escape") onCerrar();
        };

        document.addEventListener("keydown", handleEscSalida);
        return () => document.removeEventListener("keydown", handleEscSalida);
    }, [onCerrar]);


    return (
        <div
            className="modal-fondo"
            role="presentation"
            onMouseDown={manejarClickFondo}
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