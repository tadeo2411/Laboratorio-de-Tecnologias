import { useEffect, useId } from "react";
import "../compartido.css"
function Modal({
    titulo,
    onCerrar,
    cerrarAlTocarFondo = true,
    children,
}) {
    const idTitulo = useId();

    useEffect(() => {
    const manejarTecla = (event) => {
        if (event.key === "Escape") {
            onCerrar();
        }
    };

    window.addEventListener("keydown", manejarTecla);

    return () => {
        window.removeEventListener("keydown", manejarTecla);
    };
}, [onCerrar]);

    const manejarClickFondo = (event) => {
        if (
            cerrarAlTocarFondo &&
            event.target === event.currentTarget
        ) {
            onCerrar();
        }
    };

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