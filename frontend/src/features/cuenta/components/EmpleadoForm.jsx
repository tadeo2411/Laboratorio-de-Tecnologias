import { useState } from 'react'
import { ROLES } from '../../auth'

const valoresIniciales = {
    nombre: '',
    usuario: '',
    contrasena: '',
    rol: 'MECANICO',
}

function EmpleadoForm({ empleado, onGuardar, onCancelar, error }) {
    const [formulario, setFormulario] = useState(
        empleado ? { nombre: empleado.nombre, usuario: empleado.usuario, contrasena: '', rol: empleado.rol } : valoresIniciales
    )
    const [mostrarContrasena, setMostrarContrasena] = useState(false)
    const esEdicion = Boolean(empleado)

    function actualizarCampo(evento) {
        const { name, value } = evento.target
        setFormulario(anteriores => ({ ...anteriores, [name]: value }))
    }

    function manejarEnvio(evento) {
        evento.preventDefault()
        onGuardar({
            nombre: formulario.nombre.trim(),
            usuario: formulario.usuario.trim(),
            contrasena: formulario.contrasena,
            rol: formulario.rol,
        })
    }

    return (
        <div>
            <p>Los campos con * son obligatorios.</p>
            {error && <p role="alert" className="text-danger">{error}</p>}
            <form onSubmit={manejarEnvio}>
                <div className="row">
                    <div className="col-12 col-md-6 mb-3">
                        <label htmlFor="empleadoNombre" className="form-label">Nombre y apellido *</label>
                        <input id="empleadoNombre" name="nombre" type="text" className="form-control" value={formulario.nombre} onChange={actualizarCampo} maxLength={120} required />
                    </div>
                    <div className="col-12 col-md-6 mb-3">
                        <label htmlFor="empleadoUsuario" className="form-label">Usuario *</label>
                        <input id="empleadoUsuario" name="usuario" type="text" className="form-control" value={formulario.usuario} onChange={actualizarCampo} maxLength={50} required />
                    </div>
                    <div className="col-12 col-md-6 mb-3">
                        <label htmlFor="empleadoContrasena" className="form-label">{esEdicion ? 'Nueva contraseña (dejar vacío para no cambiarla)' : 'Contraseña inicial *'}</label>
                        <div className="input-group">
                            <input id="empleadoContrasena" name="contrasena" type={mostrarContrasena ? 'text' : 'password'} autoComplete="new-password" className="form-control" value={formulario.contrasena} onChange={actualizarCampo} minLength={8} required={!esEdicion} />
                            <button type="button" className="btn btn-outline-secondary mt-0" onClick={() => setMostrarContrasena(!mostrarContrasena)} aria-pressed={mostrarContrasena}>
                                {mostrarContrasena ? 'Ocultar' : 'Mostrar'}
                            </button>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 mb-3">
                        <label htmlFor="empleadoRol" className="form-label">Rol *</label>
                        <select id="empleadoRol" name="rol" className="form-select" value={formulario.rol} onChange={actualizarCampo} required>
                            {Object.keys(ROLES).map(rol => <option key={rol} value={rol}>{ROLES[rol]}</option>)}
                        </select>
                    </div>
                </div>
                <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-secondary" onClick={onCancelar}>Cancelar</button>
                    <button type="submit" className="btn btnGuardar">Guardar</button>
                </div>
            </form>
        </div>
    )
}

export default EmpleadoForm
