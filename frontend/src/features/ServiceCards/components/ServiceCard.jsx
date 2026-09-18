

function ServiceCard({title, target, icono}) {
    return (
    <div>
        {/* Service Card */}
        <div className="container">
            <div className="text-center mb-5">
                <h2 className="titulo-servicios">Nuestros Servicios</h2>
                <p className="subtitulo-servicios">Especialistas en inyección, mecánica integral y potenciación.</p>
            </div>
        </div>
        {/*Grilla de tarjetas de servicios*/}
        <div className="row g-4">
            {/*S1: Electricidad*/}
            <div className="col-6 col-md-4 col-lg-3">
                <div className="card service-card h-100 text-center p-3" data-bs-toggle="modal" data-bs-target="#modal1">
                    <div className="service-icon mx-auto mb-3">⚡</div>
                    <h3 className="service-title">Electricidad</h3>
                    <span className="ver-mas-txt mt-auto">Ver detalle +</span>
                </div>
            </div>
        </div>
        {/*S2: Bateria */}
        <div className="col-6 col-md-4 col-lg-3">
            <div className="card service-card h-100 text-center p-3" data-bs-toggle="modal" data-bs-target="#modal2">
                <div className="service-icon mx-auto mb-3">🔋</div>
                <h3 className="service-title">Batería</h3>
                <span className="ver-mas-txt mt-auto">Ver detalle +</span>
            </div>
        </div>
        {/*S3: Cambio de aceite*/}
        <div class="col-6 col-md-4 col-lg-3">
            <div class="card service-card h-100 text-center p-3" data-bs-toggle="modal" data-bs-target="#modal3">
                <div class="service-icon mx-auto mb-3">🛢️</div>
                <h3 class="service-title">Cambio de aceite</h3>
                <span class="ver-mas-txt mt-auto">Ver detalle +</span>
            </div>
        </div>
        {/*S4: Bateria */}
        {/*S5: Bateria */}
        {/*S6: Bateria */}
        {/*S7: Bateria */}
        {/*S8: Bateria */}
        {/*S9: Bateria */}
        {/*S10: Bateria */}
        {/*S11: Bateria */}
        {/*S12: Bateria */}
        {/*S13: Bateria */}
        {/*S14: Bateria */}
        {/*S15: Bateria */}
        {/*S16: Bateria */}
    </div>
        
    );
}

export default ServiceCard;
