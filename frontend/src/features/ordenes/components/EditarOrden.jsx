import { useState } from "react";
import OrdenForm from "./OrdenForm.jsx";
import PresupuestosOrdenABM from "./PresupuestosOrdenABM.jsx";

// Pestañas de "Editar orden". Las fichas se cargan desde el formulario de datos
// y los trabajos desde "Más información".
const PESTANAS = [
    { id: "datos", texto: "Datos de la orden" },
    { id: "presupuestos", texto: "Presupuestos" },
];

// Las pestañas inactivas se ocultan en vez de desmontarse,
// así no se pierde lo cargado al pasar de una a otra.
function EditarOrden({ orden, vehiculos, clientes, onGuardar, onCerrar }) {
    const [pestanaActiva, setPestanaActiva] = useState("datos");

    return (
        <>
            <ul className="nav nav-tabs mb-3" role="tablist">
                {PESTANAS.map((pestana) => (
                    <li className="nav-item" role="presentation" key={pestana.id}>
                        <button
                            type="button"
                            role="tab"
                            id={`pestana-${pestana.id}`}
                            aria-controls={`panel-${pestana.id}`}
                            aria-selected={pestanaActiva === pestana.id}
                            className={`nav-link ${pestanaActiva === pestana.id ? "active" : ""}`}
                            onClick={() => setPestanaActiva(pestana.id)}
                        >
                            {pestana.texto}
                        </button>
                    </li>
                ))}
            </ul>

            <div role="tabpanel" id="panel-datos" aria-labelledby="pestana-datos" hidden={pestanaActiva !== "datos"}>
                <OrdenForm orden={orden} vehiculos={vehiculos} clientes={clientes} onGuardar={onGuardar} onCerrar={onCerrar} />
            </div>

            <div
                role="tabpanel"
                id="panel-presupuestos"
                aria-labelledby="pestana-presupuestos"
                hidden={pestanaActiva !== "presupuestos"}
            >
                <PresupuestosOrdenABM ordenId={orden.id} />
            </div>
        </>
    );
}

export default EditarOrden;
