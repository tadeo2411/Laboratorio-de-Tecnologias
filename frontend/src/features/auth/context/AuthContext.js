import { createContext } from 'react'

// "Caja" compartida donde vive la sesión. AuthProvider la llena y useAuth la lee.
export const AuthContext = createContext(null)
