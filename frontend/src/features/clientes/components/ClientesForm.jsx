import { useState } from 'react'
import { tipoCliente } from '../services/clientesServices'

const valoresIniciales = {
    nombre: '',
    apellido: '',
    telefono: '',
    id: '',
    tipo: 'PERSONA',
}

function ClientesForm({ clienteInicial, onGuardar, error }) {
    const [formulario, setFormulario] = useState(
        clienteInicial ? { ...valoresIniciales, ...clienteInicial } : valoresIniciales
    )

    function actualizarCampo(evento) {
        const { name, value } = evento.target
        setFormulario(anteriores => ({ ...anteriores, [name]: value }))
    }

    function manejarEnvio(evento) {
        evento.preventDefault()
        onGuardar({
            nombre: formulario.nombre.trim(),
            apellido: formulario.apellido.trim(),
            telefono: formulario.telefono.trim(),
            id: formulario.id.trim(),
            tipo: formulario.tipo,
        })
    }

    return (
        <div>
            <p>Los campos con * son obligatorios.</p>
            {error && <p role="alert" className="text-danger">{error}</p>}
            <form onSubmit={manejarEnvio}>
                <div className="row">
                    <div className="col-12 col-md-6 mb-3">
                        <label htmlFor="clienteNombre" className="form-label">Nombre / Razón social *</label>
                        <input id="clienteNombre" name="nombre" type="text" className="form-control" value={formulario.nombre} onChange={actualizarCampo} pattern={'.*\\S.*'} title="Escribí un nombre que no contenga solo espacios." required />
                    </div>
                    <div className="col-12 col-md-6 mb-3">
                        <label htmlFor="clienteApellido" className="form-label">Apellido{formulario.tipo === 'PERSONA' ? ' *' : ''}</label>
                        <input id="clienteApellido" name="apellido" type="text" className="form-control" value={formulario.apellido} onChange={actualizarCampo} pattern={'.*\\S.*'} title="Escribí un apellido que no contenga solo espacios." required={formulario.tipo === 'PERSONA'} />
                    </div>
                    <div className="col-12 col-md-6 mb-3">
                        <label htmlFor="clienteTelefono" className="form-label">Teléfono *</label>
                        <input id="clienteTelefono" name="telefono" type="tel" className="form-control" value={formulario.telefono} onChange={actualizarCampo} pattern={'.*\\S.*'} title="Escribí un teléfono que no contenga solo espacios." required />
                    </div>
                    <div className="col-12 col-md-6 mb-3">
                        <label htmlFor="clienteDni" className="form-label">DNI / CUIT *</label>
                        <input id="clienteDni" name="id" type="text" className="form-control" value={formulario.id} onChange={actualizarCampo} pattern={'[0-9][0-9. \\-]*'} title="Usá números; podés incluir puntos, espacios y guiones." required />
                    </div>
                    <div className="col-12 col-md-6 mb-3">
                        <label htmlFor="clienteTipo" className="form-label ">Tipo *</label>
                        <select id="clienteTipo" name="tipo" className="form-select" value={formulario.tipo} onChange={actualizarCampo} required>
                            {tipoCliente.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
                        </select>
                    </div>
                </div>
                <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" className="btn btnGuardar">Guardar</button>
                </div>
            </form>
        </div>
    )
}

export default ClientesForm
