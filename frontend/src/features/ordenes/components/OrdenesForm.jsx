import { useEffect, useState } from "react";
import { obtenerVehiculos, obtenerRepuestos, obtenerPresupuestos } from "../services/ordenesService";
import { NavLink } from "react-router";
import "../ordenes.css";

function OrdenesForm({ onAgregar }) {

    const [vehiculos, setVehiculos] = useState([]);
    const [repuestos, setRepuestos] = useState([]);
    const [presupuestos, setPresupuestos] = useState([]);
    const [diagnostico, setDiagnostico] = useState("");
    const [trabajoDesc, setTrabajoDesc] = useState("");
    const [precioEstimado, setPrecioEstimado] = useState("");

    const [nombrepresupuesto, setNombrePresupuesto] = useState("");
    const [descripcionpresupuesto, setDescripcionPresupuesto] = useState("");
    const [preciototalpresupuesto, setPreciototalPresupuesto] = useState("");
    const [presupuestoSeleccionado, setPresupuestoSeleccionado] = useState("");

    useEffect(() => {
        async function pedirVehiculos() {
            const vehiculos = await obtenerVehiculos();
            setVehiculos(vehiculos);
        }
        pedirVehiculos();
    }, []);

    useEffect(() => {
        async function pedirRepuestos() {
            const repuestos = await obtenerRepuestos();
            setRepuestos(repuestos);
        }
        pedirRepuestos();
    }, []);

    useEffect(() => {
        async function pedirPresupuestos() {
            const presupuestos = await obtenerPresupuestos();
            setPresupuestos(presupuestos);
        }
        pedirPresupuestos();
    }, []);

    function envioForm(evento) {
        evento.preventDefault();
        const formulario = new FormData(evento.target);
        const nuevaOrden = {
            id: 10,
            vehiculoId: formulario.get("vehiculo"),
            trabajo: {
                descripcion: trabajoDesc,
                tipo: formulario.get("tipoTrabajo"),
                estado: formulario.get("estado"),
                precioEstimado: precioEstimado
            },
            presupuestoId: presupuestoSeleccionado === "crear" ? null : presupuestoSeleccionado,
            repuestoId: formulario.get("repuesto"),
            diagnostico: diagnostico,
            estado: formulario.get("estado"),
            garantia: false,
            esService: false,
            esUrgencia: false
        };
        console.log("Nueva orden:", nuevaOrden);
        onAgregar(nuevaOrden);
    }

    return (
        <>
            <section className="contenedor">
                <h3>Nueva orden</h3>
                <form id="formularioOrden" onSubmit={envioForm}>
                    {/* VEHÍCULO */}
                    <div className="">
                        <h3>Vehículo</h3>
                        <label htmlFor="idVehiculo">Seleccione un vehículo:</label>
                        <select name="vehiculo" id="idVehiculo">
                            {vehiculos.map((vehiculo) => (
                                <option key={vehiculo.id} value={vehiculo.id}>{"id: " + vehiculo.id + " - patente: " + vehiculo.patente + " - marca: " + vehiculo.marca + " - modelo: " + vehiculo.modelo}</option>
                            ))}
                        </select>
                        <NavLink className="btnGuardar" to="/gestor/vehiculos">Cargar vehículo</NavLink>
                    </div>
                    {/* TRABAJO */}
                    <div className="">
                        <h3>Trabajo</h3>
                        <label htmlFor="idTrabajoDesc">Descripción</label>
                        <textarea value={trabajoDesc} onChange={(event) =>
                            setTrabajoDesc(event.target.value)} id="idTrabajoDesc" />
                        <label htmlFor="tipoTrabajo">Tipo de trabajo</label>
                        <select name="tipoTrabajo" id="tipoTrabajo">
                            <option value="">Seleccionar tipo</option>
                            <option value="MANTENIMIENTO">Mantenimiento</option>
                            <option value="REPARACION">Reparación</option>
                            <option value="DIAGNOSTICO">Diagnóstico</option>
                        </select>
                        <label htmlFor="estado">Estado</label>
                        <select name="estado" id="estado" defaultValue="RECIBIDO">
                            <option value="RECIBIDO">Recibido</option>
                            <option value="DIAGNOSTICANDO">Diagnosticando</option>
                            <option value="ESPERANDO_APROBACION_PRESUPUESTO">Esperando aprobación de presupuesto</option>
                            <option value="EN_REPARACION">En reparación</option>
                            <option value="TERMINADO">Terminado</option>
                            <option value="ENTREGADO">Entregado</option>
                            <option value="CANCELADO">Cancelado</option>
                        </select>
                        <label htmlFor="idPrecioEstimado">Precio estimado</label>
                        <input value={precioEstimado} onChange={(event) =>
                            setPrecioEstimado(event.target.value)} id="idPrecioEstimado" type="number" />
                    </div>
                    {/* PRESUPUESTO */}
                    <div className="">
                        <h3>Presupuesto</h3>
                        <label htmlFor="idPresupuesto">Seleccionar presupuesto:</label>
                        <select name="presupuesto" id="idPresupuesto" value={presupuestoSeleccionado} onChange={(event) =>
                            setPresupuestoSeleccionado(event.target.value)} >
                            <option value="">Seleccionar presupuesto</option>
                            <option value="crear">Crear nuevo presupuesto</option>
                            {presupuestos.map((presupuesto) => (
                                <option key={presupuesto.id} value={presupuesto.id}>{"id: " + presupuesto.id + " - total: $" + presupuesto.total}</option>
                            ))}
                        </select>
                        {/* CREAR PRESUPUESTO */} {presupuestoSeleccionado === "crear" && (
                            <div className="crearPresupuesto">
                                <label htmlFor="nombrepresupuesto">Nombre</label>
                                <textarea value={nombrepresupuesto} onChange={(event) =>
                                    setNombrePresupuesto(event.target.value)} id="nombrepresupuesto" />
                                <label htmlFor="descripcionpresupuesto">Descripción</label>
                                <textarea value={descripcionpresupuesto} onChange={(event) =>
                                    setDescripcionPresupuesto(event.target.value)} id="descripcionpresupuesto" />
                                <label htmlFor="preciototalpresupuesto">Precio total</label>
                                <input value={preciototalpresupuesto} onChange={(event) =>
                                    setPreciototalPresupuesto(event.target.value)} id="preciototalpresupuesto" type="number" />
                            </div>
                        )}
                    </div>
                    {/* REPUESTOS */}
                    <div className="">
                        <h3>Repuestos utilizados</h3>
                        <label htmlFor="idRepuesto">Seleccionar repuesto:</label>
                        <select name="repuesto" id="idRepuesto">
                            {repuestos.map((repuesto) => (
                                <option key={repuesto.id} value={repuesto.id}>{"id: " + repuesto.id + " - nombre: " + repuesto.nombre + " - precio: $" + repuesto.precio}</option>
                            ))}
                        </select>
                    </div>
                    {/* DIAGNÓSTICO */}
                    <div className="">
                        <h3>Diagnóstico</h3>
                        <textarea value={diagnostico} onChange={(evento) => setDiagnostico(evento.target.value)} id="idDiag" cols="30" rows="5" /></div>
                    {/* GUARDAR */}
                    <button className="btnGuardar btnGuardarOrden" type="submit">Guardar orden</button>
                </form>
            </section>
        </>
    );
}

export default OrdenesForm;