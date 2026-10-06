function Faq(){
        return(
    <section className='faq' id='faq'>
    <div className='row faq__contenido'>

            <div className='col-12 col-lg-5'>
                <span className='textosFaq'>ANTES DE TRAER TU AUTO:<br /></span>
                <h2 className='faq__titulo'>Preguntas Frecuentes</h2>
                <span className='faq__texto'>Si no encontrás lo que buscás, contactános. Podemos asesorarte, orientandote según el modelo y la falla que tenga tu auto. <br /></span>
                <a href='https://wa.me/5492664344135?' className='textosFaq faq__enlace' target='_blank' rel='noopener noreferrer'>Hacer una consulta ↗</a>
            </div>
        <div className='col-12 col-lg-7 mt-4 mt-lg-0'>{/*col-lg hace que las columnas aparezcan una al lado de la otra a partir de los 992px fuente: codex*/ }
                {/* 1ra faq */} 
                <div className="accordion accordion-flush" id="accordionFlushExample">
                    <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                            ¿Qué servicios realiza el taller?
                        </button>
                    </h2>
                <div id="flush-collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                    <div className="accordion-body">Ofrecemos un servicio integral para el cuidado y rendimiento de tu vehículo: 
                        electricidad y batería, cambio de aceite y filtros, diagnóstico automotriz, reparación de frenos, dirección y 
                        suspensión, aire acondicionado, transmisiones automáticas y mecánica diésel. También nos especializamos en el 
                        diagnóstico de sistemas DPF/EGR, potenciación de motores, chip tuning e instalación y puesta a punto de inyecciones 
                        programables.
                    </div>
                </div>
                    </div>
            
            {/* 2da faq */}
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                            ¿Realizan diagnóstico electrónico y reparación de fallas?
                        </button>
                    </h2>
                    <div id="flush-collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                        <div className="accordion-body">
                            Sí. Realizamos diagnóstico computarizado para identificar fallas y determinar qué reparaciones necesita el vehículo.
                        </div>
                    </div>
                </div>
            {/*  3ra faq  */}
            <div className="accordion-item">
                <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                        ¿Trabajan con vehículos automáticos y diésel?
                    </button>
                </h2>
                <div id="flush-collapseThree" className="accordion-collapse collapse"
                    data-bs-parent="#accordionFlushExample">
                    <div className="accordion-body">
                        Sí. Trabajamos con vehículos automáticos y diésel, tanto para tareas de diagnóstico como de mantenimiento y reparación.
                    </div>
                </div>
            </div>
            {/* 4ta faq  */}
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseFour" aria-expanded="false" aria-controls="flush-collapseFour">
                            ¿Realizan cambio de aceite y filtros?
                        </button>
                    </h2>
                    <div id="flush-collapseFour" className="accordion-collapse collapse"
                        data-bs-parent="#accordionFlushExample">
                        <div className="accordion-body">
                            Sí. Realizamos cambios de aceite y filtros como parte del mantenimiento periódico del vehículo.
                        </div>
                    </div>
                </div>
            {/* 5ta faq  */}
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseFive" aria-expanded="false" aria-controls="flush-collapseFive">
                            ¿Solucionan problemas eléctricos y de batería?
                        </button>
                    </h2>
                    <div id="flush-collapseFive" className="accordion-collapse collapse"
                        data-bs-parent="#accordionFlushExample">
                        <div className="accordion-body">
                            Sí. Realizamos diagnóstico y reparación de fallas eléctricas, además de revisión y cambio de batería.
                        </div>
                    </div>
                </div>
            {/* 6ta faq  */}
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseSix" aria-expanded="false" aria-controls="flush-collapseSix">
                            ¿Reparan frenos, dirección y suspensión?
                        </button>
                    </h2>
                    <div id="flush-collapseSix" className="accordion-collapse collapse"
                        data-bs-parent="#accordionFlushExample">
                        <div className="accordion-body">
                            Sí. Realizamos mantenimiento y reparación de sistemas de frenos, dirección y suspensión.
                        </div>
                    </div>
                </div>
            {/* 7ma faq  */}
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseSeven" aria-expanded="false" aria-controls="flush-collapseSeven">
                            ¿Realizan mantenimiento y reparación de aire acondicionado?
                        </button>
                    </h2>
                    <div id="flush-collapseSeven" className="accordion-collapse collapse"
                        data-bs-parent="#accordionFlushExample">
                        <div className="accordion-body">
                            Sí. Trabajamos sobre el sistema de aire acondicionado y realizamos el cambio de filtros de aire y ventilación del vehículo.
                        </div>
                    </div>
                </div>
            {/* 8va faq */}
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseEight" aria-expanded="false" aria-controls="flush-collapseEight">
                            ¿Reparan sistemas de transmisión?
                        </button>
                    </h2>
                    <div id="flush-collapseEight" className="accordion-collapse collapse"
                        data-bs-parent="#accordionFlushExample">
                        <div className="accordion-body">
                            Sí. Realizamos mantenimiento y reparación de sistemas de transmisión, incluyendo vehículos automáticos.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </section>)
}

export default Faq