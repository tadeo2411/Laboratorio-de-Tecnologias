import { useState } from 'react'

function LoginForm({ onIngresar }) {
  const [formulario, setFormulario] = useState({ usuario: '', contrasena: '' })
  const [error, setError] = useState('')
  const [ingresando, setIngresando] = useState(false)
  const [mostrarContrasena, setMostrarContrasena] = useState(false)


  function actualizarCampo(event) {
    const { name, value } = event.target
    setFormulario((valoresActuales) => ({ ...valoresActuales, [name]: value }))
  }

  async function manejarEnvio(event) {
    event.preventDefault()
    setError('')
    setIngresando(true)

    try {
      await onIngresar(formulario.usuario, formulario.contrasena)
    } catch (errorIngreso) {
      setError(errorIngreso.message)
      // Se borra solo la contraseña: el usuario queda escrito para reintentar.
      setFormulario((valoresActuales) => ({ ...valoresActuales, contrasena: '' }))
    } finally {
      setIngresando(false)
    }
  }

  return (
    <form className="login-form" onSubmit={manejarEnvio}>
      {error && <p className="alert alert-danger" role="alert">{error}</p>}

      <div className="login-form__campo">
        <label htmlFor="login-usuario">Usuario</label>
        <input
          id="login-usuario"
          name="usuario"
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          value={formulario.usuario}
          onChange={actualizarCampo}
          required
        />
      </div>

      <div className="login-form__campo contrasenaCampo">
        <label htmlFor="login-contrasena">Contraseña</label>
        <input
          id="login-contrasena"
          name="contrasena"
          type={mostrarContrasena ? "text" : "password"}
          autoComplete="current-password"
          value={formulario.contrasena}
          onChange={actualizarCampo}
          required
        />
        <button
            type="button"
            className="mostrarContrasena"
            onClick={() => setMostrarContrasena(!mostrarContrasena)}
            aria-pressed={mostrarContrasena}
          >
            {mostrarContrasena ? 'Ocultar' : 'Mostrar'}
          </button>
      </div>

      <button type="submit" className="login-form__boton" disabled={ingresando}>
        {ingresando ? 'Ingresando...' : 'Ingresar'}
      </button>
    </form>
  )
}

export default LoginForm
