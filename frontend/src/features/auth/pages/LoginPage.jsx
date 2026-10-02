import { Link, Navigate, useLocation } from 'react-router'
import LoginForm from '../components/LoginForm'
import { useAuth } from '../hooks/useAuth'
import './LoginPage.css'

function LoginPage() {
  const { sesion, iniciarSesion } = useAuth()
  const ubicacion = useLocation()

  // Si alguien quiso entrar a una pantalla del gestor sin sesión, después del
  // login vuelve a esa pantalla; si no, va al inicio del gestor.
  const destino = ubicacion.state?.desde ?? '/gestor'

  // Con sesión iniciada no tiene sentido ver el login: se pasa directo al gestor.
  // Esto también hace la redirección justo después de ingresar.
  if (sesion) {
    return <Navigate to={destino} replace />
  }

  return (
    <div className="login-page">
      <section className="login-page__tarjeta">
        <img className="login-page__logo" src="/images/logo-303mei.jpg" alt="303 Mecánica e Inyección" />
        <h1>Iniciar sesión</h1>
        <p className="login-page__texto">Ingresá con tu usuario del taller para usar el gestor.</p>

        <LoginForm onIngresar={iniciarSesion} />

        <Link className="login-page__volver" to="/">
          ← Volver a la página principal
        </Link>
      </section>
    </div>
  )
}

export default LoginPage
