import './section1.css'
function Inicio() {
    return(
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
    )
}
export default Inicio