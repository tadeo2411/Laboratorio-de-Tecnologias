import { RouterProvider } from 'react-router/dom'
import { router } from './router'

// AuthProvider envuelve todo para que cualquier pantalla sepa si hay sesión iniciada.
function App() {
  return (
      <RouterProvider router={router} />
  )
}

export default App
