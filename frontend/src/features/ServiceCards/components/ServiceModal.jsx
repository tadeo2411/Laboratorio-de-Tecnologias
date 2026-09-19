function ServiceModal({servicio}){
    const {id, icono, titulo, destacada, detalle} = servicio;
    const mensajeWPP = encodeURIComponent(`Hola, estoy interesado en el servicio de ${titulo}. Me gustaría obtener más información al respecto.`);
    return (
        <div className="modal fade" id={`modal${id}`} tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content modal-oscuro">
                    <div className="modal-header border-0">
                    <h5 className="modal-title">{icono} {titulo}</h5>
                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <p className="modal-destacado">{destacada}</p>
                    <p>{detalle}</p>
                </div>
                <div className="modal-footer border-0">
                    <a href={`https://wa.me/5492664344135?text=${mensajeWPP}`} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-100 text-center">
                        📱 Cotizar por WhatsApp
                    </a>
                </div>
                </div>
            </div>
        </div>
    );
}
export default ServiceModal;