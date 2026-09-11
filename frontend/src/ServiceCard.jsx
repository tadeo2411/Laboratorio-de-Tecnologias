

function ServiceCard({title, target, icono}) {
    return (
        <div className="col-6 col-md-4 col-lg-3">
            <div className="card service-card h-100 text-center p-3" data-bs-toggle="modal"
                data-bs-target={target}>
                <div className="service-icon mx-auto mb-3">{icono}</div>
                <h3 className="service-title">{title}</h3>
                <span className="ver-mas-txt mt-auto">Ver detalle +</span>
            </div>
        </div>
    );
}

export default ServiceCard;