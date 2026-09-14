import "./footer.css";

function Footer() {
    return (
        <footer id="footer">
            <div>
                <img id="logo" src="images/logo-303mei.jpg" />
                <span>CONTACTO</span>
                <div className="infoContacto">
                    <img src="images/img_whatsapp.png" />
                    <span>+11 123456789</span>
                </div>
                <div className="infoContacto">
                    <img src="images/img_mail.png" />
                    <span>correo@gmail.com</span>
                </div>
                <div className="infoContacto">
                    <img src="images/img_location.png" />
                    <span>San Luis</span>
                </div>
            </div>
            <div className="copyright">
                <p>© 2026 303 Mecánica e inyección. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}

export default Footer;