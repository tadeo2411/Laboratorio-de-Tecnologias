import { Navigate, useLocation } from 'react-router'
import LayoutGestor from '../../../shared/layout/LayoutGestor'
import { useAuth } from '../hooks/useAuth'

// Puerta de entrada al gestor: sin sesión manda al login; con sesión muestra el
// gestor y le pasa el usuario y la acción de cerrar sesión.
// Vive en la feature auth (y no en shared/layout) porque una feature puede usar
// shared, pero shared no debe depender de una feature.
function GestorProtegido() {
  const { sesion, cerrarSesion } = useAuth()
  const ubicacion = useLocation()

  if (!sesion) {
    // "desde" guarda a qué pantalla quería ir, para volver ahí después del login.
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />
  }

  return <LayoutGestor usuario={sesion.usuario} onCerrarSesion={cerrarSesion} />
}

export default GestorProtegido
