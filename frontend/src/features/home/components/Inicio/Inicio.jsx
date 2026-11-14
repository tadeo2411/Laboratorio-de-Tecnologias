import { urlWhatsApp } from '../../../../shared/constantes/contacto'

function Inicio() {
    return(
          <section className="section1" id="inicio" aria-labelledby="inicio-titulo">
            <img className="section1__fondo" src="/images/img_fondo1.png" alt="" fetchPriority="high" />
            <div className="section1__contenido">
              <h1 id="inicio-titulo" className="section1__titulo">
                <span className="text1">CUIDAMOS TU AUTO</span>
                <span className="text2">POR DENTRO Y POR FUERA</span>
              </h1>

              <p className="section1__descripcion">Diagnóstico computarizado, mecánica general y potenciación en San Luis.</p>

              <a
                className="ubicacion__boton section1__boton"
                href={urlWhatsApp('Hola, quisiera solicitar un turno')}
                target="_blank"
                rel="noopener noreferrer"
              >
                Pedir turno por WhatsApp
                <span className="visually-hidden"> (se abre en una pestaña nueva)</span>
              </a>
            </div>
        </section>
    )
}
export default Inicio
