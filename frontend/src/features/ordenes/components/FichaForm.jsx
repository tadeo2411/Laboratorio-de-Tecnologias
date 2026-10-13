import { CONCEPTOS_FICHA, TEXTO_TIPO_FICHA } from "../utils/fichas";

function FichaForm({ tipo, ficha, onCambiar, onQuitar }) {

    function cambiarCampo(campo, valor){
        onCambiar({ ...ficha, [campo]: valor });
    }

    function cambiarConcepto(nombreConcepto, valor){
        onCambiar({
            ...ficha,
            valores: { ...ficha.valores, [nombreConcepto]: valor }
        });
    }

    return (
        <fieldset className="ficha-form">
            <legend>{TEXTO_TIPO_FICHA[tipo]}</legend>

            <div className="ficha-form-campo">
                <label htmlFor={`ficha-${tipo}-kilometraje`}>
                    Kilometraje <span className="asterisco">*</span>
                </label>
                <input
                    id={`ficha-${tipo}-kilometraje`}
                    type="number"
                    min="0"
                    step="1"
                    value={ficha.kilometraje}
                    onChange={(event) => cambiarCampo("kilometraje", event.target.value)}
                />
            </div>

            {CONCEPTOS_FICHA.map(concepto => (
                <div className="ficha-form-campo" key={concepto.id}>
                    <label htmlFor={`ficha-${tipo}-concepto-${concepto.id}`}>
                        {concepto.nombre} <span className="asterisco">*</span>
                    </label>

                    {concepto.opciones ? (
                        <select
                            id={`ficha-${tipo}-concepto-${concepto.id}`}
                            className="select"
                            value={ficha.valores[concepto.nombre] ?? ""}
                            onChange={(event) => cambiarConcepto(concepto.nombre, event.target.value)}
                        >
                            <option value="" disabled>
                                Seleccionar
                            </option>
                            {concepto.opciones.map(opcion => (
                                <option key={opcion} value={opcion}>
                                    {opcion}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            id={`ficha-${tipo}-concepto-${concepto.id}`}
                            type="text"
                            maxLength={80}
                            placeholder={concepto.ayuda}
                            value={ficha.valores[concepto.nombre] ?? ""}
                            onChange={(event) => cambiarConcepto(concepto.nombre, event.target.value)}
                        />
                    )}
                </div>
            ))}

            <label className="ficha-form-conformidad">
                <input
                    type="checkbox"
                    checked={ficha.conformidad}
                    onChange={(event) => cambiarCampo("conformidad", event.target.checked)}
                />
                El cliente dio su conformidad
            </label>

            <div className="ficha-form-acciones">
                <button type="button" className="btn btn-secondary" onClick={onQuitar}>
                    Quitar ficha
                </button>
            </div>
        </fieldset>
    );
}

export default FichaForm;
