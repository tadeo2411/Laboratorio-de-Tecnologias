import { serviciosData } from "./data/ServiceData"
import ServiceCard from "./components/ServiceCard"
import ServiceModal from "./components/ServiceModal"
function ServiceSection(){
    return(
    <section id="servicios" className="py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="titulo-servicios">Nuestros Servicios</h2>
          <p className="subtitulo-servicios">
            Especialistas en inyección, mecánica integral y potenciación.
          </p>
        </div>

        <div className="row g-4">
          {serviciosData.map((servicio) => (
            <ServiceCard
              key={servicio.id}
              servicio={servicio}
            />
          ))}
        </div>
      </div>

      {serviciosData.map((servicio) => (
        <ServiceModal
          key={servicio.id}
          servicio={servicio}
        />
      ))}
    </section>
    );
}
export default ServiceSection;