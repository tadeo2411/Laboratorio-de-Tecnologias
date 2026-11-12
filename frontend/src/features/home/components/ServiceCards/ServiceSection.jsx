import { useEffect, useRef, useState } from "react"
import { serviciosData } from "./data/ServiceData"
import { urlWhatsApp } from "../../../../shared/constantes/contacto"

function Flecha({ direccion }) {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={direccion === "anterior" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
        </svg>
    )
}

function ServiceSection(){
    const pistaRef = useRef(null)
    const [enInicio, setEnInicio] = useState(true)
    const [enFinal, setEnFinal] = useState(false)

    // Los botones se deshabilitan cuando la pista llega a una punta.
    useEffect(() => {
        const pista = pistaRef.current

        function actualizarBotones() {
            setEnInicio(pista.scrollLeft <= 1)
            setEnFinal(pista.scrollLeft + pista.clientWidth >= pista.scrollWidth - 1)
        }

        actualizarBotones()
        pista.addEventListener("scroll", actualizarBotones, { passive: true })
        window.addEventListener("resize", actualizarBotones)
        return () => {
            pista.removeEventListener("scroll", actualizarBotones)
            window.removeEventListener("resize", actualizarBotones)
        }
    }, [])

    // Avanza o retrocede de a una tarjeta.
    function desplazar(direccion) {
        const pista = pistaRef.current
        const tarjeta = pista.querySelector(".servicio-slide")
        const paso = tarjeta.offsetWidth + parseFloat(getComputedStyle(pista).columnGap)
        const sinAnimacion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        pista.scrollBy({ left: direccion * paso, behavior: sinAnimacion ? "auto" : "smooth" })
    }

    return(
    <section className="servicios" id="servicios" aria-labelledby="servicios-titulo">
      <div className="services-container">
        <div className="services-heading">
          <h2 id="servicios-titulo" className="titulo-servicios">Nuestros servicios</h2>
          <p className="subtitulo-servicios">
            Especialistas en inyección, mecánica integral y potenciación.
          </p>
        </div>

        <div className="servicios-carrusel" role="region" aria-roledescription="carrusel" aria-label="Servicios del taller">
          <ul ref={pistaRef} className="servicios-pista">
            {serviciosData.map((servicio, indice) => (
              <li key={servicio.id} className="servicio-slide">
                <img className="servicio-slide__foto" src={servicio.imagen} alt="" loading={indice < 4 ? "eager" : "lazy"} />
                <div className="servicio-slide__texto">
                  <h3 className="servicio-slide__titulo">{servicio.titulo}</h3>
                  <p className="servicio-slide__descripcion">{servicio.descripcion}</p>
                  <a
                    className="servicio-slide__enlace"
                    href={urlWhatsApp(`Hola, quisiera consultar por ${servicio.titulo}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Consultar<span className="visually-hidden"> por {servicio.titulo} (abre WhatsApp)</span>
                  </a>
                </div>
              </li>
            ))}
          </ul>

          <div className="servicios-carrusel__controles">
            <button type="button" className="servicios-carrusel__boton" onClick={() => desplazar(-1)} disabled={enInicio} aria-label="Ver servicios anteriores">
              <Flecha direccion="anterior" />
            </button>
            <button type="button" className="servicios-carrusel__boton" onClick={() => desplazar(1)} disabled={enFinal} aria-label="Ver más servicios">
              <Flecha direccion="siguiente" />
            </button>
          </div>
        </div>
      </div>
    </section>
    );
}
export default ServiceSection;
