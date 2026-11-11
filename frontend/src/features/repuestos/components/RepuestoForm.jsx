import { useState } from 'react'

function crearValoresIniciales(repuesto) {
    return {
        nombre: repuesto?.nombre ?? '',
        precio_estandar: repuesto?.precio_estandar ?? ''
    }
}

// Si recibe un repuesto, el formulario lo edita; si recibe null, registra uno nuevo.
function RepuestoForm({ repuesto, onCancelar, onGuardar }) {
    const [formulario, setFormulario] = useState(() => crearValoresIniciales(repuesto))
    const [error, setError] = useState('')
    const [guardando, setGuardando] = useState(false)
    const esEdicion = Boolean(repuesto)

    function actualizarCampo(event) {
        const { name, value } = event.target
        setFormulario((valoresActuales) => ({ ...valoresActuales, [name]: value }))
    }

    async function manejarEnvio(event) {
        event.preventDefault()
        setError('')
        setGuardando(true)

        try {
            // Los inputs siempre entregan texto: los campos numéricos se convierten antes de guardar.
            await onGuardar({
    ...formulario,
    precio_estandar: Number(formulario.precio_estandar)
});
        } catch (errorGuardado) {
            setError(errorGuardado.message)
        } finally {
            setGuardando(false)
        }
    }

    return (
        <div>
            <p className="campos-obligatorios">
                Los campos con <span className="asterisco">*</span> son obligatorios.
            </p>

            {error && <p className="alert alert-danger" role="alert">{error}</p>}

            <form className="form-ordenes" onSubmit={manejarEnvio}>
                <div>
                    <div>
                        <label htmlFor="repuesto-nombre">
                            Nombre <span className="asterisco">*</span>
                        </label>
                        <input
                            id="repuesto-nombre"
                            name="nombre"
                            type="text"
                            value={formulario.nombre}
                            onChange={actualizarCampo}
                            required
                        />
                    </div>


                </div>

                <div>
                    <div>
                        <label htmlFor="repuesto-precio-venta">
                            Precio <span className="asterisco">*</span>
                        </label>
                        <input
                            id="repuesto-precio-venta"
                            name="precio_estandar"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formulario.precio_estandar}
                            onChange={actualizarCampo}
                            required
                        />
                    </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onCancelar}
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        className="btn btn-success"
                        disabled={guardando}
                    >
                        {guardando
                            ? 'Guardando...'
                            : esEdicion
                                ? 'Guardar cambios'
                                : 'Crear repuesto'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default RepuestoForm
