import './App.css'
import Footer from './Footer'
import NavBarLanding from './NavBarLanding'
import ServiceCard from './ServiceCard'


function App() {

  return (
    <>
      <NavBarLanding />




      {/*  LO HACEMOS COMPONENTE?  */}
      <main>
        <section className="section1" id="inicio">
          <img src="../public/images/img_fondo1.png" />
          <div>
            <br></br>
            <span className="text1">CUIDAMOS TU AUTO</span>
            <span className="text2">POR DENTRO Y POR FUERA</span>

            <p>Calidad, confianza y experiencia para mantenerlo siempre en las mejores condiciones.</p>
            <div className="infoContainer">
              <div className="infoSection1">
                <img src="../public/images/img_security.png" />
                <div>
                  <p style={{ fontWeight: "bold" }}>TRABAJO GARANTIZADDO</p>
                  <p>Calidad y confianza</p>
                </div>
              </div>
              <div className="infoSection1">
                <img src="../public/images/img_technology.png" />
                <div>
                  <p style={{ fontWeight: "bold" }}>TECNOLOGÍA AVANZADA</p>
                  <p>Equipamiento de última generación</p>
                </div>
              </div>
              <div className="infoSection1">
                <img src="../public/images/img_potenciar.png" />
                <div>
                  <p style={{ fontWeight: "bold" }}>RENDIMIENTO REAL</p>
                  <p>Potenciamos tu auto al máximo</p>
                </div>
              </div>
            </div>
          </div>
        </section>


        <section id="servicios" className="py-5">
          <div className="container">

            <div className="text-center mb-5">
              <h2 className="titulo-servicios">Nuestros Servicios</h2>
              <p className="subtitulo-servicios">Especialistas en inyección, mecánica integral y potenciación.</p>
            </div>

            <div className="row g-4">
              <ServiceCard title="Electricidad" icono="⚡" target="#modal1" />
              <ServiceCard title="Batería" icono="🔋" target="#modal2" />
              <ServiceCard title="Cambio de aceite" icono="🛢️" target="#modal3" />
              <ServiceCard title="Filtros A/A y ventilación" icono="💨" target="#modal4" />
              <ServiceCard title="Diagnóstico de automóviles" icono="💻" target="#modal5" />
              <ServiceCard title="Frenos" icono="🛑" target="#modal6" />
              <ServiceCard title="Dirección y suspensión" icono="🔧" target="#modal7" />
              <ServiceCard title="Aire acondicionado" icono="❄️" target="#modal8" />
              <ServiceCard title="Autos automáticos" icono="⚙️" target="#modal9" />
              <ServiceCard title="Mecánica diésel" icono="🛻" target="#modal10" />
              <ServiceCard title="Servicio y rep. de frenos" icono="🛠️" target="#modal11" />
              <ServiceCard title="Sistemas de transmisión" icono="🔄" target="#modal12" />
              <ServiceCard title="Anulación DPF/EGR" icono="⚠️" target="#modal13" />
              <ServiceCard title="Potenciación de motores" icono="🚀" target="#modal14" />
              <ServiceCard title="Chip Tuning" icono="🏁" target="#modal15" />
              <ServiceCard title="Inyecciones programables" icono="💻" target="#modal16" />
            </div>
          </div>

        </section >

      </main >






      <Footer />
    </>
  )
}

export default App
