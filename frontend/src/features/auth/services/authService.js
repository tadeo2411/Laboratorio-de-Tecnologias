// Simula el endpoint POST /api/auth/login mientras no exista el backend.
// Lee los usuarios del JSON que sirve Vite, controla la contraseña y, si es
// correcta, devuelve un token con el formato de un JWT.
//
// Limitación de la simulación: todo esto corre en el navegador, así que no es
// seguro de verdad (cualquiera puede leer usuarios.json). Cuando exista el
// backend, este control y la firma del token los hará el servidor; el resto del
// login (pantalla, sesión, rutas protegidas) no cambia.
const URL = '/backend/data'

// Duración de la sesión: una jornada de trabajo en el taller.
const DURACION_SESION_SEGUNDOS = 8 * 60 * 60

async function leerUsuarios() {
  const respuesta = await fetch(`${URL}/usuarios.json`)

  if (!respuesta.ok) {
    throw new Error('No se pudo conectar para iniciar sesión.')
  }
  return respuesta.json()
}

// Las contraseñas no se guardan, se guarda su "huella" (hash SHA-256 de salt + contraseña).
// Para controlar, se calcula la huella de lo que escribió la persona y se compara.
async function calcularHash(salt, contrasena) {
  const bytes = new TextEncoder().encode(salt + contrasena)
  const huella = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(huella), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function codificarBase64Url(objeto) {
  const bytes = new TextEncoder().encode(JSON.stringify(objeto))
  const binario = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('')
  return btoa(binario).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

// Arma un token con el formato de un JWT: cabecera.datos.firma
// La firma queda vacía porque no hay servidor que la firme ("alg": "none").
function crearToken(usuario) {
  const ahora = Math.floor(Date.now() / 1000)
  const cabecera = { alg: 'none', typ: 'JWT' }
  const datos = {
    sub: usuario.id,
    usuario: usuario.usuario,
    nombre: usuario.nombre,
    rol: usuario.rol,
    iat: ahora,
    exp: ahora + DURACION_SESION_SEGUNDOS,
  }
  return `${codificarBase64Url(cabecera)}.${codificarBase64Url(datos)}.`
}

export async function autenticarUsuario(usuario, contrasena) {
  const usuarios = await leerUsuarios()
  const nombreUsuario = usuario.trim().toLowerCase()
  const encontrado = usuarios.find((usuarioGuardado) => usuarioGuardado.usuario === nombreUsuario)

  const contrasenaCorrecta =
    encontrado && (await calcularHash(encontrado.salt, contrasena)) === encontrado.contrasenaHash

  // Mismo mensaje si falla el usuario o la contraseña: así no se revela qué usuarios existen.
  if (!contrasenaCorrecta) {
    throw new Error('Usuario o contraseña incorrectos.')
  }

  return { token: crearToken(encontrado) }
}
