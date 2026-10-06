import { useEffect } from "react"

function ServiceModal({ servicio, onClose }) {
    const {id, icono, titulo, destacada, detalle} = servicio;
    const mensajeWPP = encodeURIComponent(`Hola, estoy interesado en el servicio de ${titulo}. Me gustaría obtener más información al respecto.`);

    useEffect(() => {
        const cerrarConEscape = (event) => {
            if (event.key === "Escape") onClose()
        }

        window.addEventListener("keydown", cerrarConEscape)
        return () => window.removeEventListener("keydown", cerrarConEscape)
    }, [onClose])

    return (
        <div className="service-modal-backdrop" role="presentation" onMouseDown={onClose}>
            <div className="service-modal" role="dialog" aria-modal="true" aria-labelledby={`modal${id}-title`} onMouseDown={(event) => event.stopPropagation()}>
                <div className="modal-oscuro">
                    <div className="service-modal__cabecera">
                    <h5 id={`modal${id}-title`} className="service-modal__titulo">{icono} {titulo}</h5>
                    <button type="button" className="service-modal__cerrar" onClick={onClose} aria-label="Cerrar">×</button>
                    </div>
                    <div className="service-modal__cuerpo">
                        <p className="modal-destacado">{destacada}</p>
                        <p className="service-modal__detalle">{detalle}</p>
                    </div>
                    <div className="service-modal__pie">
                        <a href={`https://wa.me/5492664344135?text=${mensajeWPP}`} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                            📱 Cotizar por WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ServiceModal;
