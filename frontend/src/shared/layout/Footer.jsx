import { TELEFONO, MAIL, DIRECCION, urlWhatsApp } from '../constantes/contacto.js'

function Footer() {
    return (
        <footer className="footer-landing" id="footer">
            <div className="footer-landing__contenido">
                <img className="footer-landing__logo" src="/images/logo-303mei.jpg" alt="303 Mecánica e Inyección" />
                <h2 className="footer-landing__titulo">CONTACTO</h2>
                <address className="footer-landing__datos">
                    <div className="footer-landing__dato">
                        <img className="footer-landing__icono" src="/images/img_whatsapp.png" alt="" />
                        <a href={urlWhatsApp('Hola, quisiera hacer una consulta')} target="_blank" rel="noopener noreferrer">
                            {TELEFONO}<span className="visually-hidden"> (WhatsApp, se abre en una pestaña nueva)</span>
                        </a>
                    </div>
                    <div className="footer-landing__dato">
                        <img className="footer-landing__icono" src="/images/img_mail.png" alt="" />
                        <a href={`mailto:${MAIL}`}>{MAIL}</a>
                    </div>
                    <div className="footer-landing__dato">
                        <img className="footer-landing__icono" src="/images/img_location.png" alt="" />
                        <span>{DIRECCION}</span>
                    </div>
                </address>
            </div>
            <div className="footer-landing__copyright">
                <p className="footer-landing__copyright-texto">© 2026 303 Mecánica e Inyección. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}

export default Footer;
