

function ServiceCard({ servicio}) {
    const {id,icono,titulo} = servicio;
    return (
    <div className="col-6 com-md-4 col-lg-3">
        <div className="car service-card h-100 text-center p-3" data-bs-toggle="modal" data-bs-target={`#Modal${id}`}>
            <div className="service-icon mx-auto mb-3">{icono}</div>
            <h3 className="service-title">{titulo}</h3>
            <span className="ver-mas-txt mt-auto">Ver detalle +</span>
        </div>
    </div>
    );
}

export default ServiceCard;
