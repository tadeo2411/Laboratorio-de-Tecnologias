import { useState } from "react";
import { ESTADOS_PRESUPUESTO, TIPOS_ITEM, formatearPrecio } from "../utils/presupuestosVista";

// Estados que se pueden elegir a mano. VENCIDO lo asigna el sistema.
const ESTADOS_ELEGIBLES = ["ENVIADO", "APROBADO", "CANCELADO"];

let ultimaClave = 0;
const nuevaClave = () => ++ultimaClave;

function crearItemVacio() {
    return { clave: nuevaClave(), tipo: "MANO_DE_OBRA", descripcion: "", cantidad: 1, precioUnitario: "" };
}

// "clave" solo identifica la fila en pantalla; no se guarda.
function crearItemsIniciales(presupuesto) {
    if (!presupuesto) return [crearItemVacio()];
    return presupuesto.items.map((item) => ({ ...item, clave: nuevaClave() }));
}

// Vista previa mientras se escribe; el precio que vale es el que calcula el backend al guardar.
const totalItem = (item) => Number(item.cantidad) * Number(item.precioUnitario);
// Para el precio final, los descuentos restan.
const importeConSigno = (item) => (item.tipo === "DESCUENTO" ? -totalItem(item) : totalItem(item));

// Si recibe un presupuesto, lo edita; si recibe null, arma uno nuevo (queda como borrador).
// Número y fechas no se cargan a mano: los asigna el sistema.
function PresupuestoForm({ presupuesto, onCancelar, onGuardar }) {
    const [items, setItems] = useState(() => crearItemsIniciales(presupuesto));
    const [estado, setEstado] = useState(presupuesto?.estadoPresupuesto ?? "BORRADOR");
    const [error, setError] = useState("");
    const [guardando, setGuardando] = useState(false);
    const esEdicion = Boolean(presupuesto);

    // Una vez enviado, los ítems quedan fijos: el cliente ya tiene esos precios.
    const itemsEditables = !esEdicion || presupuesto.estadoPresupuesto === "BORRADOR";

    // El estado actual siempre figura; además se ofrecen los que se pueden elegir.
    const opcionesEstado = esEdicion
        ? [...new Set([presupuesto.estadoPresupuesto, ...ESTADOS_ELEGIBLES])]
        : [];

    function actualizarItem(clave, event) {
        const { name, value } = event.target;
        setItems((actuales) =>
            actuales.map((item) => (item.clave === clave ? { ...item, [name]: value } : item)),
        );
    }

    function agregarItem() {
        setItems((actuales) => [...actuales, crearItemVacio()]);
    }

    function quitarItem(clave) {
        setItems((actuales) => actuales.filter((item) => item.clave !== clave));
    }

    async function manejarEnvio(event) {
        event.preventDefault();
        setError("");
        setGuardando(true);

        // Los inputs entregan texto: cantidad y precio se convierten antes de guardar.
        const datos = { estadoPresupuesto: estado };
        if (itemsEditables) {
            // Se conserva el trabajoId de los renglones que salieron de un trabajo:
            // si se perdiera, ese trabajo quedaría libre para otro presupuesto.
            datos.items = items.map((item, indice) => ({
                id: indice + 1,
                tipo: item.tipo,
                descripcion: item.descripcion.trim(),
                cantidad: Number(item.cantidad),
                precioUnitario: Number(item.precioUnitario),
                ...(item.trabajoId !== undefined && { trabajoId: item.trabajoId }),
            }));
        }

        try {
            await onGuardar(datos);
        } catch (errorGuardado) {
            setError(errorGuardado.message);
            setGuardando(false);
        }
    }

    return (
        <form className="presupuesto-form" onSubmit={manejarEnvio}>
            <div className="info-orden-seccion-header">
                <h3 className="info-orden-titulo">
                    {esEdicion ? `Editar presupuesto ${presupuesto.numero}` : "Nuevo presupuesto"}
                </h3>
            </div>

            {error && <p className="alert alert-danger" role="alert">{error}</p>}

            {esEdicion && (
                <div className="presupuesto-form-campo presupuesto-form-estado">
                    <label htmlFor="presupuesto-estado">Estado</label>
                    <select
                        id="presupuesto-estado"
                        className="form-select"
                        value={estado}
                        onChange={(event) => setEstado(event.target.value)}
                    >
                        {opcionesEstado.map((valor) => (
                            <option key={valor} value={valor}>{ESTADOS_PRESUPUESTO[valor].texto}</option>
                        ))}
                    </select>
                </div>
            )}

            {!itemsEditables && (
                <p className="presupuesto-solo-lectura">
                    Los ítems solo se pueden modificar mientras el presupuesto es un borrador.
                </p>
            )}

            <fieldset className="presupuesto-form-items" disabled={!itemsEditables}>
                <legend className="visually-hidden">Ítems del presupuesto</legend>

                {items.map((item, indice) => (
                    <div className="presupuesto-form-item" key={item.clave}>
                        <div className="presupuesto-form-campo">
                            <label htmlFor={`tipo-${item.clave}`}>Tipo</label>
                            <select
                                id={`tipo-${item.clave}`}
                                name="tipo"
                                className="form-select"
                                value={item.tipo}
                                onChange={(event) => actualizarItem(item.clave, event)}
                            >
                                {Object.entries(TIPOS_ITEM).map(([valor, texto]) => (
                                    <option key={valor} value={valor}>{texto}</option>
                                ))}
                            </select>
                        </div>

                        <div className="presupuesto-form-campo presupuesto-form-descripcion">
                            <label htmlFor={`descripcion-${item.clave}`}>Descripción</label>
                            <input
                                id={`descripcion-${item.clave}`}
                                name="descripcion"
                                type="text"
                                className="form-control"
                                value={item.descripcion}
                                onChange={(event) => actualizarItem(item.clave, event)}
                                required
                            />
                        </div>

                        <div className="presupuesto-form-campo">
                            <label htmlFor={`cantidad-${item.clave}`}>Cantidad</label>
                            <input
                                id={`cantidad-${item.clave}`}
                                name="cantidad"
                                type="number"
                                min="1"
                                step="1"
                                className="form-control"
                                value={item.cantidad}
                                onChange={(event) => actualizarItem(item.clave, event)}
                                required
                            />
                        </div>

                        <div className="presupuesto-form-campo">
                            <label htmlFor={`precio-${item.clave}`}>Precio unitario</label>
                            <input
                                id={`precio-${item.clave}`}
                                name="precioUnitario"
                                type="number"
                                min="0"
                                step="0.01"
                                className="form-control"
                                value={item.precioUnitario}
                                onChange={(event) => actualizarItem(item.clave, event)}
                                required
                            />
                        </div>

                        <div className="presupuesto-form-campo presupuesto-form-total">
                            <span className="info-orden-label">Total</span>
                            <span>{formatearPrecio(totalItem(item))}</span>
                        </div>

                        <button
                            type="button"
                            className="presupuesto-form-quitar"
                            onClick={() => quitarItem(item.clave)}
                            disabled={items.length === 1}
                            aria-label={`Quitar ítem ${indice + 1}`}
                            title="Quitar ítem"
                        >
                            ×
                        </button>
                    </div>
                ))}

                {itemsEditables && (
                    <button type="button" className="btn btn-outline-secondary btn-sm presupuesto-form-agregar" onClick={agregarItem}>
                        + Agregar ítem
                    </button>
                )}
            </fieldset>

            <div className="info-orden-resumen-total presupuesto-form-precio-final">
                <span>Precio final</span>
                <strong>{formatearPrecio(items.reduce((total, item) => total + importeConSigno(item), 0))}</strong>
            </div>

            <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={onCancelar}>
                    Cancelar
                </button>
                <button type="submit" className="btn btn-success" disabled={guardando}>
                    {guardando ? "Guardando..." : esEdicion ? "Guardar cambios" : "Crear presupuesto"}
                </button>
            </div>
        </form>
    );
}

export default PresupuestoForm;
