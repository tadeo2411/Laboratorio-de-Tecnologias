import { useState } from "react";
import img_auto from "../../../assets/icons/img_auto.png";
import { normalizarPatente } from "../../vehiculos";

// Con muchos vehículos un select se vuelve inmanejable: se busca por patente
// y solo se muestran las primeras coincidencias.
const MAX_RESULTADOS = 6;

function BuscadorVehiculo({ vehiculos, patenteSeleccionada, onSeleccionar, onRegistrarNuevo }) {
    const [busqueda, setBusqueda] = useState("");
    const seleccionado = vehiculos.find(vehiculo => vehiculo.patente === patenteSeleccionada);

    const texto = normalizarPatente(busqueda);
    const resultados = texto
        ? vehiculos.filter(vehiculo => normalizarPatente(vehiculo.patente).includes(texto)).slice(0, MAX_RESULTADOS)
        : [];

    function elegir(vehiculo){
        onSeleccionar(vehiculo.patente);
        setBusqueda("");
    }

    // Enter no envía la orden: si hay una sola coincidencia, la elige.
    // Escape borra la búsqueda sin cerrar el modal de la orden.
    function manejarTecla(event){
        if (event.key === "Escape" && busqueda) {
            event.stopPropagation();
            setBusqueda("");
            return;
        }
        if (event.key !== "Enter") return;
        event.preventDefault();
        if (resultados.length === 1) elegir(resultados[0]);
    }

    if (seleccionado) {
        return (
            <div className="buscador-vehiculo-elegido">
                <img src={img_auto} alt="" />
                <span>
                    <strong>{seleccionado.patente}</strong> · {seleccionado.marca} {seleccionado.modelo}
                </span>
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => onSeleccionar("")}>
                    Cambiar
                </button>
            </div>
        );
    }

    return (
        <div className="buscador-vehiculo">
            <input
                id="orden-vehiculo"
                type="search"
                placeholder="Buscar por patente (ej.: AB123CD)"
                autoComplete="off"
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                onKeyDown={manejarTecla}
            />

            {texto && (
                resultados.length > 0 ? (
                    <ul className="buscador-vehiculo-resultados">
                        {resultados.map(vehiculo => (
                            <li key={vehiculo.id}>
                                <button type="button" onClick={() => elegir(vehiculo)}>
                                    <strong>{vehiculo.patente}</strong> · {vehiculo.marca} {vehiculo.modelo}
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="buscador-vehiculo-vacio">No hay vehículos con esa patente.</p>
                )
            )}

            <button type="button" className="btn btn-outline-success btn-sm buscador-vehiculo-nuevo" onClick={onRegistrarNuevo}>
                + Registrar vehículo nuevo
            </button>
        </div>
    );
}

export default BuscadorVehiculo;
