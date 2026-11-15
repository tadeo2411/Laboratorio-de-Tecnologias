import { useState } from "react";
import { formatearPrecio } from "../utils/presupuestosVista";

function TrabajoForm({ tiposTrabajo, repuestos, empleados, onGuardar, onCancelar }) {
    const [formulario, setFormulario] = useState({
        tipoTrabajoId: "",
        descripcion: "",
        manoDeObra: "",
        empleados: [],
        repuestos: []
    });
    const [error, setError] = useState("");
    const [guardando, setGuardando] = useState(false);

    const tiposActivos = tiposTrabajo.filter(tipo => tipo.activo);

    function elegirTipo(event){
        const tipoElegido = tiposTrabajo.find(tipo => tipo.id === Number(event.target.value));
        setFormulario(valoresActuales => ({
            ...valoresActuales,
            tipoTrabajoId: tipoElegido.id,
            manoDeObra: String(Number(tipoElegido.precio_estandar))
        }));
    }

    function actualizarCampo(event){
        const { name, value } = event.target;
        setFormulario(valoresActuales => ({ ...valoresActuales, [name]: value }));
    }

    function marcarEmpleado(idEmpleado){
        setFormulario(valoresActuales => ({
            ...valoresActuales,
            empleados: valoresActuales.empleados.includes(idEmpleado)
                ? valoresActuales.empleados.filter(id => id !== idEmpleado)
                : [...valoresActuales.empleados, idEmpleado]
        }));
    }

    function agregarRepuesto(){
        setFormulario(valoresActuales => ({
            ...valoresActuales,
            repuestos: [...valoresActuales.repuestos, { repuestoId: "", cantidad: "1" }]
        }));
    }

    function cambiarRepuesto(posicion, campo, valor){
        setFormulario(valoresActuales => ({
            ...valoresActuales,
            repuestos: valoresActuales.repuestos.map((linea, indice) =>
                indice === posicion ? { ...linea, [campo]: valor } : linea
            )
        }));
    }

    function quitarRepuesto(posicion){
        setFormulario(valoresActuales => ({
            ...valoresActuales,
            repuestos: valoresActuales.repuestos.filter((linea, indice) => indice !== posicion)
        }));
    }

    function buscarRepuesto(repuestoId){
        return repuestos.find(repuesto => repuesto.id === Number(repuestoId));
    }

    function validar(){
        if (!formulario.tipoTrabajoId){
            return "Elegí el tipo de trabajo.";
        }

        const manoDeObra = Number(formulario.manoDeObra);
        if (formulario.manoDeObra === "" || Number.isNaN(manoDeObra) || manoDeObra < 0){
            return "La mano de obra tiene que ser un número mayor o igual a 0.";
        }

        for (const linea of formulario.repuestos){
            if (!linea.repuestoId){
                return "Elegí el repuesto en todas las filas, o quitá las que sobran.";
            }
            if (!(Number(linea.cantidad) > 0)){
                return "La cantidad de cada repuesto tiene que ser mayor a 0.";
            }
        }

        const idsRepuestos = formulario.repuestos.map(linea => linea.repuestoId);
        if (new Set(idsRepuestos).size !== idsRepuestos.length){
            return "Hay un repuesto repetido. Usá una sola fila y poné la cantidad total.";
        }
        return "";
    }

    async function manejarEnvio(event){
        event.preventDefault();
        setError("");

        const mensaje = validar();
        if (mensaje){
            setError(mensaje);
            return;
        }

        const tipoElegido = tiposTrabajo.find(tipo => tipo.id === formulario.tipoTrabajoId);
        const trabajo = {
            tipoTrabajoId: tipoElegido.id,
            tipoTrabajo: tipoElegido.nombre,
            descripcion: formulario.descripcion.trim() || null,
            manoDeObra: Number(formulario.manoDeObra),
            empleados: empleados.filter(empleado => formulario.empleados.includes(empleado.id)),
            repuestos: formulario.repuestos.map(linea => {
                const repuesto = buscarRepuesto(linea.repuestoId);
                return {
                    repuestoId: repuesto.id,
                    nombre: repuesto.nombre,
                    cantidad: Number(linea.cantidad),
                    precioUnitario: Number(repuesto.precio_estandar)
                };
            })
        };

        setGuardando(true);
        try {
            await onGuardar(trabajo);
        } catch (errorGuardado) {
            setError(errorGuardado.message);
            setGuardando(false);
        }
    }

    return (
        <form className="trabajo-form" onSubmit={manejarEnvio}>
            {error && <p className="alert alert-danger" role="alert">{error}</p>}

            <div className="trabajo-form-campo">
                <label htmlFor="trabajo-tipo">
                    Tipo de trabajo <span className="asterisco">*</span>
                </label>
                <select
                    id="trabajo-tipo"
                    className="select"
                    value={formulario.tipoTrabajoId}
                    onChange={elegirTipo}
                >
                    <option value="" disabled>
                        Seleccionar del catálogo
                    </option>
                    {tiposActivos.map(tipo => (
                        <option key={tipo.id} value={tipo.id}>
                            {tipo.nombre}
                        </option>
                    ))}
                </select>
            </div>

            <div className="trabajo-form-campo">
                <label htmlFor="trabajo-mano-de-obra">
                    Mano de obra ($) <span className="asterisco">*</span>
                </label>
                <input
                    id="trabajo-mano-de-obra"
                    name="manoDeObra"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formulario.manoDeObra}
                    onChange={actualizarCampo}
                />
                <small>Viene con el precio del catálogo, pero se puede cambiar para este auto.</small>
            </div>

            <div className="trabajo-form-campo">
                <label htmlFor="trabajo-descripcion">Descripción</label>
                <textarea
                    id="trabajo-descripcion"
                    name="descripcion"
                    maxLength={300}
                    placeholder="Ej.: Aceite 5W30 sintético, 4 litros."
                    value={formulario.descripcion}
                    onChange={actualizarCampo}
                />
            </div>

            <fieldset className="trabajo-form-campo">
                <legend>Empleados que lo hacen</legend>
                {empleados.map(empleado => (
                    <label key={empleado.id} className="trabajo-form-empleado">
                        <input
                            type="checkbox"
                            checked={formulario.empleados.includes(empleado.id)}
                            onChange={() => marcarEmpleado(empleado.id)}
                        />
                        {empleado.nombre}
                    </label>
                ))}
            </fieldset>

            <fieldset className="trabajo-form-campo">
                <legend>Repuestos</legend>

                {formulario.repuestos.length === 0 && (
                    <small>Este trabajo no usa repuestos.</small>
                )}

                {formulario.repuestos.map((linea, indice) => {
                    const repuesto = buscarRepuesto(linea.repuestoId);

                    return (
                        <div className="trabajo-form-repuesto" key={indice}>
                            <select
                                className="select"
                                aria-label="Repuesto"
                                value={linea.repuestoId}
                                onChange={(event) => cambiarRepuesto(indice, "repuestoId", event.target.value)}
                            >
                                <option value="" disabled>
                                    Seleccionar repuesto
                                </option>
                                {repuestos.map(opcion => (
                                    <option key={opcion.id} value={opcion.id}>
                                        {opcion.nombre}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="number"
                                aria-label="Cantidad"
                                min="0.01"
                                step="0.01"
                                value={linea.cantidad}
                                onChange={(event) => cambiarRepuesto(indice, "cantidad", event.target.value)}
                            />

                            <span>
                                {repuesto ? formatearPrecio(repuesto.precio_estandar *Number(linea.cantidad || 0)) : "-"}
                            </span>

                            <button type="button" className="btn btn-secondary" onClick={() => quitarRepuesto(indice)}>
                                Quitar
                            </button>
                        </div>
                    );
                })}

                <button type="button" className="btn btn-outline-success" onClick={agregarRepuesto}>
                    + Agregar repuesto
                </button>
            </fieldset>

            <div className="trabajo-form-acciones">
                <button type="button" className="btn btn-secondary" onClick={onCancelar}>
                    Cancelar
                </button>
                <button type="submit" className="btn btn-success" disabled={guardando}>
                    {guardando ? "Guardando..." : "Guardar trabajo"}
                </button>
            </div>
        </form>
    );
}

export default TrabajoForm;
