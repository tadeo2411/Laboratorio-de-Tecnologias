import { useLoaderData, useNavigate } from 'react-router'
import LayoutGestor from '../../../shared/layout/LayoutGestor'
import { cerrarSesion } from '../services/authService'

// Conecta la sesión con el layout del gestor. El usuario lo entrega el loader
// protegerRuta (router.jsx). Vive en auth porque una feature puede usar shared,
// pero shared no debe depender de una feature.
function GestorConSesion() {
  const usuario = useLoaderData()
  const navigate = useNavigate()

  function handleCerrarSesion() {
    cerrarSesion()
    navigate('/login', { replace: true })
  }

  return <LayoutGestor usuario={usuario} onCerrarSesion={handleCerrarSesion} />
}

export default GestorConSesion