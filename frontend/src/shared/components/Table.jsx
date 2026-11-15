import { useState } from "react";
import "../compartido.css";
import img_lupa from "../../assets/icons/img_lupa.svg";
import img_filter from "../../assets/icons/img_filter.svg";
import img_calender from "../../assets/icons/img_calender.svg";

function Table({
    inputPlaceholder,
    columnas,
    datos,
    mensajeVacio = "No hay datos para mostrar.",
    valorBusqueda = '',
    alCambiarBusqueda,
    renderFila,
    itemsPorPagina = 10
}) {
    const [paginaActual, setPaginaActual] = useState(1);
    const [busquedaPrevia, setBusquedaPrevia] = useState(valorBusqueda);

    const listaDatos = Array.isArray(datos) ? datos : [];
    const totalItems = listaDatos.length;
    const totalPaginas = Math.max(1, Math.ceil(totalItems / itemsPorPagina));

    // Si cambió el término de búsqueda por prop o input, reiniciamos a página 1
    if (busquedaPrevia !== valorBusqueda) {
        setBusquedaPrevia(valorBusqueda);
        setPaginaActual(1);
    }

    // Si la página actual excede el total de páginas (ej. al reducirse los datos)
    if (paginaActual > totalPaginas) {
        setPaginaActual(totalPaginas);
    }

    const paginaSegura = Math.min(Math.max(1, paginaActual), totalPaginas);

    const indiceInicio = (paginaSegura - 1) * itemsPorPagina;
    const indiceFin = indiceInicio + itemsPorPagina;
    const datosPaginados = listaDatos.slice(indiceInicio, indiceFin);

    const irAPaginaAnterior = () => {
        setPaginaActual((prev) => Math.max(prev - 1, 1));
    };

    const irAPaginaSiguiente = () => {
        setPaginaActual((prev) => Math.min(prev + 1, totalPaginas));
    };

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
                        placeholder={inputPlaceholder}
                        value={valorBusqueda}
                        onChange={(e) => {
                            setPaginaActual(1);
                            if (alCambiarBusqueda) {
                                alCambiarBusqueda(e.target.value);
                            }
                        }}
                    />
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
                        {datosPaginados.length > 0 ? (
                            datosPaginados.map((dato, index) =>
                                renderFila(dato, indiceInicio + index)
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
                    {totalItems === 0
                        ? "Mostrando 0 resultados"
                        : `Mostrando ${indiceInicio + 1} - ${Math.min(indiceFin, totalItems)} de ${totalItems} resultados`}
                </p>

                <div className="buttons-container">
                    <button
                        type="button"
                        className="button-list"
                        onClick={irAPaginaAnterior}
                        disabled={paginaSegura <= 1}
                        aria-label="Página anterior"
                    >
                        {"<"}
                    </button>
                    <span className="pagina-indicador">
                        Página {totalItems === 0 ? 0 : paginaSegura} de {totalPaginas}
                    </span>
                    <button
                        type="button"
                        className="button-list"
                        onClick={irAPaginaSiguiente}
                        disabled={paginaSegura >= totalPaginas || totalItems === 0}
                        aria-label="Página siguiente"
                    >
                        {">"}
                    </button>
                </div>
            </div>

        </div>
    );
}

export default Table;
