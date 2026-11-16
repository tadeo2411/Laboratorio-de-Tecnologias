import { useState } from "react";

const categorias = [
    { valor: "MANTENIMIENTO", nombre: "Mantenimiento" },
    { valor: "REPARACION", nombre: "Reparación" },
    { valor: "DIAGNOSTICO", nombre: "Diagnóstico" }
];

function crearValoresIniciales(tipo) {
    return {
        nombre: tipo?.nombre ?? "",
        categoria: tipo?.categoria ?? "MANTENIMIENTO",
        precio_estandar: tipo?.precio_estandar ?? "",
        activo: tipo?.activo ?? true
    };
}

// Si recibe un tipo de trabajo lo edita; si recibe null, registra uno nuevo.
function TrabajosForm({ tipo, onCancelar, onGuardar }) {
    const [formulario, setFormulario] = useState(() => crearValoresIniciales(tipo));
    const [error, setError] = useState("");
    const [guardando, setGuardando] = useState(false);
    const esEdicion = Boolean(tipo);

    function actualizarCampo(event) {
        const { name, value, type, checked } = event.target;
        setFormulario((actuales) => ({
            ...actuales,
            [name]: type === "checkbox" ? checked : value
        }));
    }

    async function manejarEnvio(event) {
        event.preventDefault();
        setError("");
        setGuardando(true);

        try {
            await onGuardar({
                ...formulario,
                precio_estandar: Number(formulario.precio_estandar)
            });
        } catch (errorGuardado) {
            setError(errorGuardado.message);
        } finally {
            setGuardando(false);
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
                        <label htmlFor="trabajo-nombre">
                            Nombre <span className="asterisco">*</span>
                        </label>
                        <input
                            id="trabajo-nombre"
                            name="nombre"
                            type="text"
                            maxLength={120}
                            value={formulario.nombre}
                            onChange={actualizarCampo}
                            required
                        />
                    </div>
                </div>

                <div>
                    <div>
                        <label htmlFor="trabajo-categoria">
                            Categoría <span className="asterisco">*</span>
                        </label>
                        <select
                            id="trabajo-categoria"
                            name="categoria"
                            value={formulario.categoria}
                            onChange={actualizarCampo}
                            required
                        >
                            {categorias.map((categoria) => (
                                <option key={categoria.valor} value={categoria.valor}>
                                    {categoria.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="trabajo-precio">
                            Precio estándar <span className="asterisco">*</span>
                        </label>
                        <input
                            id="trabajo-precio"
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

                {esEdicion && (
                    <div>
                        <div className="form-check">
                            <input
                                id="trabajo-activo"
                                name="activo"
                                type="checkbox"
                                className="form-check-input"
                                checked={formulario.activo}
                                onChange={actualizarCampo}
                            />
                            <label htmlFor="trabajo-activo" className="form-check-label">
                                Activo (se puede elegir al cargar trabajos en una orden)
                            </label>
                        </div>
                    </div>
                )}

                <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-secondary" onClick={onCancelar}>
                        Cancelar
                    </button>

                    <button type="submit" className="btn btn-success" disabled={guardando}>
                        {guardando
                            ? "Guardando..."
                            : esEdicion
                                ? "Guardar cambios"
                                : "Crear trabajo"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default TrabajosForm;
