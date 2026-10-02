import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

// Da acceso a la sesión desde cualquier componente: { sesion, iniciarSesion, cerrarSesion }.
export function useAuth() {
  const contexto = useContext(AuthContext)

  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>.')
  }
  return contexto
}
