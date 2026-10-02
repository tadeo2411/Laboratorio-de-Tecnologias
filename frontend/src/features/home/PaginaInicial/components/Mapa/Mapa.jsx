function Mapa(){
    const MAPA_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3334.9611328489304!2d-66.3035062!3d-33.2936798!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95d43f19678983d9%3A0x49964d82776106b9!2s303%20mec%C3%A1nica-inyecci%C3%B3n!5e0!3m2!1ses-419!2sar!4v1788966364859!5m2!1ses-419!2sar";

    return(
        <section className="ubicacion" id="ubicacion">
            <div className="ubicacion__contenido">

                <div className="ubicacion__mapa">
                    <iframe
                        className="ubicacion__iframe"
                        src={MAPA_URL}
                        title="Ubicación de 303 Mecánica e Inyección"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                    />
                </div>

                <div className="ubicacion__informacion">
                    <span className="ubicacion__etiqueta">UBICACIÓN</span>

                    <h2 className="ubicacion__titulo">¿Dónde encontrarnos?</h2>

                    <p className="ubicacion__descripcion">
                    Acercate a nuestro taller para realizar el diagnóstico y
                    mantenimiento de tu vehículo.
                    </p>

                    <address className="ubicacion__datos">
                        <div className="ubicacion__dato">
                            <span className="ubicacion__dato-nombre">Dirección</span>
                            <p className="ubicacion__dato-valor">303 Mecánica e Inyección, San Luis</p>
                        </div>

                        <div className="ubicacion__dato">
                            <span className="ubicacion__dato-nombre">Horarios</span>
                            <p className="ubicacion__dato-valor">Lunes a viernes de 8:00 a 18:00</p>
                        </div>
                    </address>

                    <a
                        className="ubicacion__boton"
                        href="https://www.google.com/maps/search/?api=1&query=303+mecánica+inyección+San+Luis"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Cómo llegar
                    </a>
                </div>

            </div>
        </section>
    )
}

export default Mapa
