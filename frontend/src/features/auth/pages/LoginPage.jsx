import { Link, useNavigate } from 'react-router'
import LoginForm from '../components/LoginForm'
import { iniciarSesion } from '../services/authService'
import '../LoginPage.css'

function LoginPage() {
  const navigate = useNavigate()
  async function handleIngresar(usuario, contrasena) {
    await iniciarSesion(usuario, contrasena)
    navigate('/gestor', { replace: true })
  }
  
  return (
    <div className="login-page">
      <section className="login-page__tarjeta">
        <img className="login-page__logo" src="/images/logo-303mei.jpg" alt="303 Mecánica e Inyección" />
        <h1>Iniciar sesión</h1>
        <p className="login-page__texto">Ingresá con tu usuario del taller para usar el gestor.</p>

        <LoginForm onIngresar={handleIngresar} />

        <Link className="login-page__volver" to="/">
          ← Volver a la página principal
        </Link>
      </section>
    </div>
  )
}

export default LoginPage
