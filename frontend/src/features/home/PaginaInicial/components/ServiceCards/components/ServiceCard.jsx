

function ServiceCard({servicio}) {
    const {id, icono, titulo} = servicio
    return (
    <div>
        {/* Service Card */}

        {/*Grilla de tarjetas de servicios*/}
        <div className="row g-4">
            {/*S1: Electricidad*/}
            <div className="col-6 col-md-4 col-lg-3">
                <div className="card service-card h-100 text-center p-3" data-bs-toggle="modal" data-bs-target={"#modal${id}"}>
                    <div className="service-icon mx-auto mb-3">{icono}</div>
                    <h3 className="service-title">{titulo}</h3>
                    <span className="ver-mas-txt mt-auto">Ver detalle +</span>
                </div>
            </div>
        </div>
    </div>
            );
}

export default ServiceCard;
