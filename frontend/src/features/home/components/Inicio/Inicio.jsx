function Inicio() {
    return(
          <section className="section1" id="inicio">
            <img className="section1__fondo" src="/images/img_fondo1.png" alt="" />
            <div className="section1__contenido">
              <span className="text1">CUIDAMOS TU AUTO</span>
              <span className="text2">POR DENTRO Y POR FUERA</span>

              <p className="section1__descripcion">Calidad, confianza y experiencia para mantenerlo siempre en las mejores condiciones.</p>
              <div className="infoContainer">
                <div className="infoSection1">
                  <img className="infoSection1__icono" src="/images/img_security.png" alt="" />
                  <div>
                    <p className="infoSection1__titulo">TRABAJO GARANTIZADDO</p>
                    <p className="infoSection1__texto">Calidad y confianza</p>
                  </div>
                </div>
              <div className="infoSection1">
                <img className="infoSection1__icono" src="/images/img_technology.png" alt="" />
                <div>
                  <p className="infoSection1__titulo">TECNOLOGÍA AVANZADA</p>
                  <p className="infoSection1__texto">Equipamiento de última generación</p>
                </div>
              </div>
              <div className="infoSection1">
                <img className="infoSection1__icono" src="/images/img_potenciar.png" alt="" />
                <div>
                  <p className="infoSection1__titulo">RENDIMIENTO REAL</p>
                  <p className="infoSection1__texto">Potenciamos tu auto al máximo</p>
                </div>
              </div>
            </div>
          </div>
        </section>
    )
}
export default Inicio
