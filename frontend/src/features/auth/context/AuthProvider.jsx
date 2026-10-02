import { useCallback, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { autenticarUsuario } from '../services/authService'
import { borrarToken, guardarToken, leerDatosToken, leerToken } from '../utils/token'

// Convierte un token en la sesión que usa la aplicación. Devuelve null si no sirve.
function crearSesion(token) {
  const datos = token ? leerDatosToken(token) : null
  if (!datos) return null

  return {
    token,
    usuario: { id: datos.sub, usuario: datos.usuario, nombre: datos.nombre, rol: datos.rol },
    vence: datos.exp * 1000,
  }
}

// Al abrir la aplicación se recupera la sesión guardada, si sigue vigente.
function recuperarSesionGuardada() {
  const sesion = crearSesion(leerToken())
  if (!sesion) borrarToken()
  return sesion
}

// Envuelve toda la aplicación para que cualquier pantalla sepa si hay sesión.
function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(recuperarSesionGuardada)

  async function iniciarSesion(usuario, contrasena) {
    const { token } = await autenticarUsuario(usuario, contrasena)
    guardarToken(token)
    setSesion(crearSesion(token))
  }

  const cerrarSesion = useCallback(() => {
    borrarToken()
    setSesion(null)
  }, [])

  // Cuando el token vence, la sesión se cierra sola aunque la página siga abierta.
  useEffect(() => {
    if (!sesion) return

    const temporizador = setTimeout(cerrarSesion, sesion.vence - Date.now())
    return () => clearTimeout(temporizador)
  }, [sesion, cerrarSesion])

  return (
    <AuthContext.Provider value={{ sesion, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
