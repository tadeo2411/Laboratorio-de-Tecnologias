
import img_orden from "../../../assets/icons/img_orden.svg";
import img_trabajo from "../../../assets/icons/img_trabajo.svg";
import img_empleado from "../../../assets/icons/img_empleado.svg";
import img_precio from "../../../assets/icons/img_precio.svg";
import img_repuestos from "../../../assets/icons/img_repuestos.svg";
import service from "../services/trabajos";
import { useEffect, useState } from "react";
import ModalNotificacion from "../../../shared/components/ModalNotification";

function TrabajosForm({ trabajo, onCerrar, onGuardar }) {

    const [ordenes, setOrdenes] = useState([]);
    const [tiposTrabajo, setTiposTrabajo] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [repuestos, setRepuestos] = useState([]);

    const [ordenSeleccionada, setOrdenSeleccionada] = useState("");
    const [tipoSeleccionado, setTipoSeleccionado] = useState("");
    // Lista de empleados asignados al trabajo
    const [empleadosSeleccionados, setEmpleadosSeleccionados] = useState([]);

    // Nuevo empleado a agregar
    const [nuevoEmpleadoId, setNuevoEmpleadoId] = useState("");

    // Lista de repuestos seleccionados
    const [repuestosSeleccionados, setRepuestosSeleccionados] = useState([]);

    // Nuevo repuesto a agregar
    const [nuevoRepuestoId, setNuevoRepuestoId] = useState("");
    const [cantidadRepuesto, setCantidadRepuesto] = useState("1");

    const [descripcion, setDescripcion] = useState("");
    const [manoDeObra, setManoDeObra] = useState("");

    const [guardando, setGuardando] = useState(false);

    const [notificacion, setNotificacion] = useState(null);

    // Agregar un empleado a la lista
    function agregarEmpleado() {

        const empleado = empleados.find(
            (e) => String(e.id) === String(nuevoEmpleadoId)
        );

        if (!empleado) {
            setNotificacion({
                tipo: "advertencia",
                mensaje: "Seleccioná un empleado.",
                onCerrar: () => setNotificacion(null)
            })
            return;
        }

        setEmpleadosSeleccionados((prev) => {

            // Evitar empleados duplicados
            const existente = prev.some(
                (e) => e.empleado_id === empleado.id
            );

            if (existente) {
                setNotificacion({
                    tipo: "advertencia",
                    mensaje: "Este empleado ya está asignado al trabajo.",
                    onCerrar: () => setNotificacion(null)
                })
                return prev;
            }

            return [
                ...prev,
                {
                    empleado_id: empleado.id,
                    nombre: empleado.nombre
                }
            ];
        });

        setNuevoEmpleadoId("");
    }

    // Quitar un empleado de la lista
    function quitarEmpleado(id) {

        setEmpleadosSeleccionados((prev) =>
            prev.filter((e) => e.empleado_id !== id)
        );
    }

    useEffect(() => {
        async function cargarDatos() {
            try {
                const [
                    ordenesData,
                    tiposData,
                    empleadosData,
                    repuestosData
                ] = await Promise.all([
                    service.obtenerOrdenes(),
                    service.obtenerTiposTrabajo(),
                    service.obtenerEmpleados(),
                    service.obtenerRepuestos()
                ]);

                setOrdenes(ordenesData);
                setTiposTrabajo(tiposData);
                setEmpleados(empleadosData);
                setRepuestos(repuestosData);

                // Cargar datos existentes si estamos editando
                if (trabajo) {
                    setOrdenSeleccionada(String(trabajo.orden_id));
                    setTipoSeleccionado(String(trabajo.tipo_trabajo_id));
                    setDescripcion(trabajo.descripcion);
                    setManoDeObra(String(trabajo.mano_de_obra));

                    setEmpleadosSeleccionados(
                        (trabajo.empleados || []).map((e) => ({
                            empleado_id: e.empleado_id,
                            nombre: e.nombre
                        }))
                    );

                    setRepuestosSeleccionados(
                        (trabajo.repuestos || []).map((r) => ({
                            repuesto_id: r.repuesto_id,
                            nombre: r.nombre,
                            precio_unitario: Number(r.precio_unitario),
                            cantidad: Number(r.cantidad)
                        }))
                    );
                }

            } catch (error) {
                console.error("Error al cargar los datos:", error);
                setNotificacion({
                    tipo: "advertencia",
                    mensaje: "No se pudieron cargar los datos del formulario.",
                    onCerrar: () => setNotificacion(null)
                });
            }
        }

        cargarDatos();
    }, [trabajo]);

    // Agregar un repuesto a la lista
    function agregarRepuesto() {

        const repuesto = repuestos.find(
            (r) => String(r.id) === String(nuevoRepuestoId)
        );

        const cantidad = Number(cantidadRepuesto);

        if (!repuesto) {
            setNotificacion({
                tipo: "advertencia",
                mensaje: "Seleccioná un repuesto.",
                onCerrar: () => setNotificacion(null)
            });
            return;
        }

        if (!Number.isInteger(cantidad) || cantidad < 1) {
            setNotificacion({
                tipo: "advertencia",
                mensaje: "La cantidad debe ser un número entero mayor a cero.",
                onCerrar: () => setNotificacion(null)
            });
            return;
        }

        setRepuestosSeleccionados((prev) => {

            const existente = prev.find(
                (r) => r.repuesto_id === repuesto.id
            );

            // Si ya existe, acumular la cantidad
            if (existente) {
                return prev.map((r) =>
                    r.repuesto_id === repuesto.id
                        ? {
                            ...r,
                            cantidad: r.cantidad + cantidad
                        }
                        : r
                );
            }

            // Si no existe, agregarlo
            return [
                ...prev,
                {
                    repuesto_id: repuesto.id,
                    nombre: repuesto.nombre,
                    precio_unitario: Number(repuesto.precio_estandar),
                    cantidad
                }
            ];
        });

        setNuevoRepuestoId("");
        setCantidadRepuesto("1");
    }

    // Modificar cantidad de un repuesto
    function modificarCantidad(id, nuevaCantidad) {

        if (!Number.isInteger(nuevaCantidad) || nuevaCantidad < 1) {
            return;
        }

        setRepuestosSeleccionados((prev) =>
            prev.map((r) =>
                r.repuesto_id === id
                    ? { ...r, cantidad: nuevaCantidad }
                    : r
            )
        );
    }

    // Quitar un repuesto de la lista
    function quitarRepuesto(id) {

        setRepuestosSeleccionados((prev) =>
            prev.filter((r) => r.repuesto_id !== id)
        );
    }

    // Calcular el total de los repuestos
    const totalRepuestos = repuestosSeleccionados.reduce(
        (total, r) => total + r.precio_unitario * r.cantidad,
        0
    );

    async function handleSubmit(e) {
        e.preventDefault();

        if (empleadosSeleccionados.length === 0) {
            setNotificacion({
                tipo: "advertencia",
                mensaje: "Debés asignar al menos un empleado al trabajo.",
                onCerrar: () => setNotificacion(null)
            });
            return;
        }

        try {
            setGuardando(true);

            const datos = {
                orden_id: Number(ordenSeleccionada),
                tipo_trabajo_id: Number(tipoSeleccionado),
                descripcion: descripcion.trim(),

                empleados: empleadosSeleccionados.map(
                    (e) => e.empleado_id
                ),

                mano_de_obra: Number(manoDeObra),

                repuestos: repuestosSeleccionados.map((r) => ({
                    repuesto_id: r.repuesto_id,
                    cantidad: r.cantidad
                }))
            };

            let resultado;

            if (trabajo) {
                resultado = await service.modificarTrabajo(trabajo.id, datos);

                setNotificacion({
                    tipo: "exito",
                    mensaje: "Trabajo actualizado correctamente.",
                    onCerrar: () => {
                        setNotificacion(null);
                        window.location.reload();
                    }
                });

            } else {
                resultado = await service.cargarTrabajo(datos);

                setNotificacion({
                    tipo: "exito",
                    mensaje: "Se ha cargado correctamente el trabajo.",
                    onCerrar: () => {
                        setNotificacion(null);
                        window.location.reload();
                    }
                });
            }

            onGuardar(resultado);

        } catch (error) {
            console.error("Error al guardar el trabajo:", error);
            setNotificacion({
                tipo: "advertencia",
                mensaje: error.message || "No se pudo guardar el trabajo",
                onCerrar: () => setNotificacion(null)
            });

        } finally {
            setGuardando(false);
        }
    }

    return (
        <div>
            <p className="campos-obligatorios">
                Los campos con <span className="asterisco">*</span> son obligatorios.
            </p>

            <form className="form-trabajos" onSubmit={handleSubmit}>

                {/* Orden de trabajo */}
                <div>
                    <div>
                        <label>
                            Orden de trabajo <span className="asterisco">*</span>
                        </label>

                        <div className="campo-icono">
                            <img src={img_orden} alt="" />

                            <select
                                className="select"
                                value={ordenSeleccionada}
                                onChange={(e) => setOrdenSeleccionada(e.target.value)}
                                required
                            >
                                <option value="">Seleccionar orden</option>

                                {ordenes.map((orden) => (
                                    <option key={orden.id} value={orden.id}>
                                        Orden #{orden.id} - {orden.estado}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tipo de trabajo */}
                <div>
                    <div>
                        <label>
                            Tipo de trabajo <span className="asterisco">*</span>
                        </label>

                        <div className="campo-icono">
                            <img src={img_trabajo} alt="" />

                            <select
                                className="select"
                                value={tipoSeleccionado}
                                onChange={(e) => setTipoSeleccionado(e.target.value)}
                                required
                            >
                                <option value="">Seleccionar tipo</option>

                                {tiposTrabajo.map((tipo) => (
                                    <option key={tipo.id} value={tipo.id}>
                                        {tipo.nombre} - {tipo.categoria}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Descripción */}
                <div>
                    <div>
                        <label>
                            Descripción <span className="asterisco">*</span>
                        </label>

                        <div>
                            <textarea
                                placeholder="Describí el trabajo realizado..."
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Agregar empleados */}
                <div>
                    <div>
                        <label>Empleados asignados <span className="asterisco">*</span></label>

                        <div className="campo-icono">
                            <img src={img_empleado} alt="icono empleado" />

                            <select
                                className="select"
                                value={nuevoEmpleadoId}
                                onChange={(e) => setNuevoEmpleadoId(e.target.value)}
                            >
                                <option value="">Seleccionar empleado</option>

                                {empleados
                                    .filter(
                                        (empleado) =>
                                            !empleadosSeleccionados.some(
                                                (e) => e.empleado_id === empleado.id
                                            )
                                    )
                                    .map((empleado) => (
                                        <option key={empleado.id} value={empleado.id}>
                                            {empleado.nombre}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={agregarEmpleado}
                            disabled={!nuevoEmpleadoId}
                        >
                            Agregar empleado
                        </button>
                    </div>
                </div>

                {/* Lista de empleados agregados */}
                {empleadosSeleccionados.length > 0 && (
                    <div className="lista-empleados">
                        <div className="empleados-agregados">
                            <h4>Empleados asignados</h4>

                            {empleadosSeleccionados.map((empleado) => (
                                <div
                                    className="empleado-item"
                                    key={empleado.empleado_id}
                                >
                                    <div>
                                        <strong>{empleado.nombre}</strong>
                                    </div>

                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() =>
                                            quitarEmpleado(empleado.empleado_id)
                                        }
                                    >
                                        Quitar
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Precio */}
                <div>
                    <div>
                        <label>
                            Precio del trabajo <span className="asterisco">*</span>
                        </label>

                        <div className="campo-icono">
                            <img src={img_precio} alt="" />

                            <input
                                className="input"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Precio"
                                value={manoDeObra}
                                onChange={(e) => setManoDeObra(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Agregar repuestos */}
                <div>
                    <div>
                        <label>Repuestos utilizados</label>

                        <div className="campo-icono">
                            <img src={img_repuestos} alt="" />

                            <select
                                className="select"
                                value={nuevoRepuestoId}
                                onChange={(e) => setNuevoRepuestoId(e.target.value)}
                            >
                                <option value="">Seleccionar repuesto</option>

                                {repuestos.map((repuesto) => (
                                    <option key={repuesto.id} value={repuesto.id}>
                                        {repuesto.nombre} - $
                                        {Number(repuesto.precio_estandar).toLocaleString("es-AR")}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label>Cantidad</label>

                            <input
                                className="input"
                                type="number"
                                min="1"
                                step="1"
                                value={cantidadRepuesto}
                                onChange={(e) => setCantidadRepuesto(e.target.value)}
                            />

                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={agregarRepuesto}
                                disabled={
                                    !nuevoRepuestoId ||
                                    !Number.isInteger(Number(cantidadRepuesto)) ||
                                    Number(cantidadRepuesto) < 1
                                }
                            >
                                Agregar repuesto
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lista de repuestos agregados */}
                {repuestosSeleccionados.length > 0 && (
                    <div className="lista-repuestos">
                        <div className="repuestos-agregados">
                            <h4>Repuestos agregados</h4>

                            {repuestosSeleccionados.map((repuesto) => (
                                <div
                                    className="repuesto-item"
                                    key={repuesto.repuesto_id}
                                >
                                    <div>
                                        <strong>{repuesto.nombre}</strong>

                                        <p>
                                            Precio unitario: $
                                            {repuesto.precio_unitario.toLocaleString("es-AR")}
                                        </p>

                                        <p>
                                            Subtotal: $
                                            {(
                                                repuesto.precio_unitario * repuesto.cantidad
                                            ).toLocaleString("es-AR")}
                                        </p>
                                    </div>

                                    <div>
                                        <label>Cantidad</label>

                                        <input
                                            className="input"
                                            type="number"
                                            min="1"
                                            step="1"
                                            value={repuesto.cantidad}
                                            onChange={(e) => {
                                                const valor = e.target.value;

                                                if (valor === "") return;

                                                modificarCantidad(
                                                    repuesto.repuesto_id,
                                                    Number(valor)
                                                );
                                            }}
                                        />

                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() =>
                                                quitarRepuesto(repuesto.repuesto_id)
                                            }
                                        >
                                            Quitar
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div>
                                <strong>
                                    Total de repuestos: $
                                    {totalRepuestos.toLocaleString("es-AR")}
                                </strong>
                            </div>
                        </div>
                    </div>
                )}

                {/* Botones */}
                <div className="d-flex justify-content-end gap-2">

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onCerrar}
                        disabled={guardando}
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        className="btn btn-success"
                        disabled={guardando}
                    >
                        {guardando ? "Guardando..." : "Guardar"}
                    </button>

                </div>

            </form>
            {notificacion && (
                <ModalNotificacion
                    {...notificacion}
                    onCerrar={notificacion.onCerrar}
                />
            )}
        </div>
    );
}

export default TrabajosForm;
