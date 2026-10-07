import "./table.css";
import img_lupa from "../../../assets/icons/img_lupa.svg"
import img_filter from "../../../assets/icons/img_filter.svg"
import img_calender from "../../../assets/icons/img_calender.svg"

function Table({
    inputPlaceholder,
    columnas,
    datos,
    mensajeVacio = "No hay datos para mostrar.",
    renderFila,
}) {
    return (
        <div className="table">

            {/* Filtros */}
            <div className="filters">
                <div className="input-container">
                    <img
                        src={img_lupa}
                        className="input-icon"
                        alt="lupa"
                    />

                    <input
                        type="text"
                        placeholder={
                            inputPlaceholder ||
                            "Buscar por descripción, orden, trabajo..."
                        }
                    />
                </div>

                <div className="filter-button-container">
                    <button className="filter-button">
                        <img src={img_filter} alt="filtro" />
                        Filtros
                    </button>
                </div>

                <div className="filter-button-container">
                    <button className="filter-button">
                        <img src={img_calender} alt="calendario" />
                        Fecha
                    </button>
                </div>
            </div>

            {/* Lista */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            {columnas.map((columna) => (
                                <th key={columna.key}>
                                    {columna.nombre}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {datos.length > 0 ? (
                            datos.map((dato, index) =>
                                renderFila(dato, index)
                            )
                        ) : (
                            <tr>
                                <td
                                    colSpan={columnas.length}
                                    className="sinDatos"
                                >
                                    {mensajeVacio}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Botones */}
            <div className="buttons">
                <p>
                    Mostrando {datos.length} de {datos.length} resultados
                </p>

                <div className="buttons-container">
                    <button className="button-list">{"<"}</button>
                    <button className="button-list">1</button>
                    <button className="button-list">{">"}</button>
                </div>
            </div>

        </div>
    );
}

export default Table;