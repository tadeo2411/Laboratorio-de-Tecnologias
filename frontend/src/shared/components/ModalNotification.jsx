
import { createPortal } from "react-dom";
import "../compartido.css";

const configuracion = {
    exito: { titulo: "¡Operación exitosa!", icono: "✓" },
    error: { titulo: "Ha ocurrido un error", icono: "×" },
    advertencia: { titulo: "Atención", icono: "!" },
    informacion: { titulo: "Información", icono: "i" },
    confirmacion: { titulo: "¿Estás seguro?", icono: "?" },
};

function ModalNotificacion({
    tipo = "informacion",
    titulo,
    mensaje,
    onCerrar,
    onAceptar,
    textoAceptar = "Aceptar",
    textoCancelar = "Cancelar",
}) {
    if (!mensaje) return null;

    const config = configuracion[tipo] || configuracion.informacion;
    const esConfirmacion = tipo === "confirmacion";

    return createPortal(
        <div className="modal-notificacion-overlay">
            <div
                className={`modal-notificacion-contenido modal-notificacion-${tipo}`}
                role="alertdialog"
                aria-modal="true"
            >
                <button
                    className="modal-notificacion-cerrar"
                    onClick={onCerrar}
                    aria-label="Cerrar"
                >
                    ×
                </button>

                <div className="modal-notificacion-icono">
                    {config.icono}
                </div>

                <h2 className="modal-notificacion-titulo">
                    {titulo || config.titulo}
                </h2>

                <p className="modal-notificacion-mensaje">
                    {mensaje}
                </p>

                <div className="modal-notificacion-acciones">
                    {esConfirmacion && (
                        <button
                            className="modal-notificacion-cancelar"
                            onClick={onCerrar}
                        >
                            {textoCancelar}
                        </button>
                    )}

                    <button
                        className="modal-notificacion-boton"
                        onClick={esConfirmacion ? onAceptar : onCerrar}
                    >
                        {esConfirmacion ? textoAceptar : "Entendido"}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default ModalNotificacion;
