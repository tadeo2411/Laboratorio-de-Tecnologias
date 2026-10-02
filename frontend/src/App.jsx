import { RouterProvider } from 'react-router/dom'
import { router } from './router'
import AuthProvider from './features/auth/context/AuthProvider'

// AuthProvider envuelve todo para que cualquier pantalla sepa si hay sesión iniciada.
function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
