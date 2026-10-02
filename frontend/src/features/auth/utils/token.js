// Funciones del lado del navegador para guardar y leer el token de sesión.
// El token se guarda en localStorage para que la sesión siga abierta al
// recargar la página o cerrar la pestaña, hasta que venza.
// try/catch: en modo incógnito o con el almacenamiento bloqueado, localStorage
// puede fallar; en ese caso la sesión dura solo mientras la página esté abierta.
const CLAVE_TOKEN = 'taller303.token'

export function guardarToken(token) {
  try {
    localStorage.setItem(CLAVE_TOKEN, token)
  } catch {
    // Sin almacenamiento disponible: la sesión queda solo en memoria.
  }
}

export function leerToken() {
  try {
    return localStorage.getItem(CLAVE_TOKEN)
  } catch {
    return null
  }
}

export function borrarToken() {
  try {
    localStorage.removeItem(CLAVE_TOKEN)
  } catch {
    // Nada que borrar si el almacenamiento no está disponible.
  }
}

function decodificarBase64Url(texto) {
  const base64 = texto.replace(/-/g, '+').replace(/_/g, '/')
  const binario = atob(base64)
  const bytes = Uint8Array.from(binario, (caracter) => caracter.charCodeAt(0))
  return JSON.parse(new TextDecoder().decode(bytes))
}

// Lee la parte del medio del token (los datos del usuario y el vencimiento).
// Devuelve null si el token está roto o vencido.
export function leerDatosToken(token) {
  try {
    const datos = decodificarBase64Url(token.split('.')[1])
    const vencido = !datos.exp || datos.exp * 1000 <= Date.now()
    return vencido ? null : datos
  } catch {
    return null
  }
}
