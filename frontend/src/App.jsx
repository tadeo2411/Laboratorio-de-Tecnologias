//import './features/App.css'
import './features/section1.css'
import Footer from './shared/components/layout/FooterLanding/Footer'
import NavBarLanding from './shared/components/layout/NavBarLanding/NavBarLanding'
import ServiceSection from './features/ServiceCards/ServiceSection'
import Faq from './features/home/FAQ/Faq'

function App() {

  return (
    <>
      <NavBarLanding />




      {/*  LO HACEMOS COMPONENTE?  */}
      <main>
        <section className="section1" id="inicio">
          <img src="/images/img_fondo1.png" />
          <div>
            <span className="text1">CUIDAMOS TU AUTO</span>
            <span className="text2">POR DENTRO Y POR FUERA</span>

            <p>Calidad, confianza y experiencia para mantenerlo siempre en las mejores condiciones.</p>
            <div className="infoContainer">
              <div className="infoSection1">
                <img src="images/img_security.png" />
                <div>
                  <p style={{ fontWeight: "bold" }}>TRABAJO GARANTIZADDO</p>
                  <p>Calidad y confianza</p>
                </div>
              </div>
              <div className="infoSection1">
                <img src="images/img_technology.png" />
                <div>
                  <p style={{ fontWeight: "bold" }}>TECNOLOGÍA AVANZADA</p>
                  <p>Equipamiento de última generación</p>
                </div>
              </div>
              <div className="infoSection1">
                <img src="images/img_potenciar.png" />
                <div>
                  <p style={{ fontWeight: "bold" }}>RENDIMIENTO REAL</p>
                  <p>Potenciamos tu auto al máximo</p>
                </div>
              </div>
            </div>
          </div>
        </section>


        <section id="servicios" className="py-5">
        
          <ServiceSection />

        </section >

      </main >


  
    <Faq />
  



      <Footer />
    </>
  )
}

export default App
