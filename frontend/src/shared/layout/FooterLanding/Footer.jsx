import './footer.css';

function Footer() {
    return (
        <footer className="footer-landing" id="footer">
            <div className="footer-landing__contenido">
                <img className="footer-landing__logo" src="/images/logo-303mei.jpg" alt="303 Mecánica e Inyección" />
                <span className="footer-landing__titulo">CONTACTO</span>
                <div className="footer-landing__dato">
                    <img className="footer-landing__icono" src="/images/img_whatsapp.png" alt="" />
                    <span>+11 123456789</span>
                </div>
                <div className="footer-landing__dato">
                    <img className="footer-landing__icono" src="/images/img_mail.png" alt="" />
                    <span>correo@gmail.com</span>
                </div>
                <div className="footer-landing__dato">
                    <img className="footer-landing__icono" src="/images/img_location.png" alt="" />
                    <span>San Luis</span>
                </div>
            </div>
            <div className="footer-landing__copyright">
                <p className="footer-landing__copyright-texto">© 2026 303 Mecánica e inyección. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}

export default Footer;
