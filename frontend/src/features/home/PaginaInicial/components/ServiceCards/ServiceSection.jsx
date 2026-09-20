import { useState } from "react"
import { serviciosData } from "./data/ServiceData"
import ServiceCard from "./components/ServiceCard"
import ServiceModal from "./components/ServiceModal"
import "./serviceCard.css"

function ServiceSection(){
    const [servicioSeleccionado, setServicioSeleccionado] = useState(null)

    return(
    <section id="servicios">
      <div className="services-container">
        <div className="services-heading">
          <h2 className="titulo-servicios">Nuestros Servicios</h2>
          <p className="subtitulo-servicios">
            Especialistas en inyección, mecánica integral y potenciación.
          </p>
        </div>

        <div className="services-grid">
          {serviciosData.map((servicio) => (
            <ServiceCard
              key={servicio.id}
              servicio={servicio}
              onSelect={setServicioSeleccionado}
            />
          ))}
        </div>
      </div>

      {servicioSeleccionado && (
        <ServiceModal
          servicio={servicioSeleccionado}
          onClose={() => setServicioSeleccionado(null)}
        />
      )}
    </section>
    );
}
export default ServiceSection;
