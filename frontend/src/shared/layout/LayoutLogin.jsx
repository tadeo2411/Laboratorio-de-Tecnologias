

function LayoutLogin() {
    return (
        <>
            <section>
                <h1>Iniciar sesión</h1>
                <form action="login.html" method="post">
                    <label for="username">Usuario:</label>
                    <input type="text" id="username" name="username" required />
                    <label for="password">Contraseña:</label>
                    <input type="password" id="password" name="password" required />
                    <input type="submit" value="Iniciar sesión" />
                </form>
            </section>
        </>
    );
}

export default LayoutLogin;