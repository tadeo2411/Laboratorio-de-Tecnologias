import { useState } from "react";
import { useLoaderData } from "react-router";
import img_cuenta from "../../../assets/icons/cuentaIcono.svg"
import img_empleado from "../../../assets/icons/clientesIcono.svg"
import Table from "../../../shared/components/Table";
import BotonNuevo from "../../../shared/components/BotonNuevo";
import BotonEditar from "../../../shared/components/BotonEditar";
import Modal from "../../../shared/components/Modal";
import ModalNotificacion from "../../../shared/components/ModalNotification";
import MiCuenta from "../components/MiCuenta";
import EmpleadoForm from "../components/EmpleadoForm";
import { textoRol } from "../../auth";
import { iniciales } from "../utils/cuenta";
import { cerrarSesion, crearEmpleado, actualizarEmpleado, cambiarActivoEmpleado } from "../../auth";
import { useNavigate } from "react-router";
import "../../estilos.css"
import "../cuenta.css"

const columnasEmpleados = [
    { key: "empleado", nombre: "Empleado" },
    { key: "rol", nombre: "Rol" },
    { key: "estado", nombre: "Estado" },
    { key: "acciones", nombre: "Acciones" },
];

function CuentaPage() {
    const datos = useLoaderData();
    const { miCuenta, esAdmin } = datos;
    const [empleados, setEmpleados] = useState(datos.empleados);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [errorFormulario, setErrorFormulario] = useState(null);
    const [confirmacion, setConfirmacion] = useState(null);
    const [mensajeError, setMensajeError] = useState("");
    const [empleadoEnEdicion, setEmpleadoEnEdicion] = useState(null);
    const navigate = useNavigate()

    function handleNuevoEmpleado() {
        setErrorFormulario(null);
        setEmpleadoEnEdicion(null);
        setMostrarFormulario(true);
    }

    function handleEditarEmpleado(empleado) {
        setErrorFormulario(null);
        setEmpleadoEnEdicion(empleado);
        setMostrarFormulario(true);
    }

    function reemplazarEmpleado(actualizado) {
        setEmpleados(anteriores => anteriores.map(empleado => empleado.id === actualizado.id ? actualizado : empleado));
    }

    async function handleGuardarEmpleado(datosEmpleado) {
        try {
            if (empleadoEnEdicion) {
                reemplazarEmpleado(await actualizarEmpleado(empleadoEnEdicion.id, datosEmpleado));
            } else {
                const creado = await crearEmpleado(datosEmpleado);
                setEmpleados(anteriores => [...anteriores, { ...creado, activo: true }]);
            }
            setMostrarFormulario(false);
        } catch (err) {
            setErrorFormulario(err.message);
        }
    }

    async function cambiarActivo(empleado) {
        try {
            reemplazarEmpleado(await cambiarActivoEmpleado(empleado.id, !empleado.activo));
        } catch (err) {
            setMensajeError(err.message);
        }
    }

    function handleCambiarActivo(empleado) {
        if (!empleado.activo) {
            cambiarActivo(empleado);
            return;
        }
        setConfirmacion({
            titulo: "Dar de baja",
            mensaje: `¿Seguro que querés dar de baja a ${empleado.nombre}? No va a poder ingresar al sistema.`,
            textoAceptar: "Sí, dar de baja",
            textoCancelar: "Volver",
            onAceptar: () => {
                setConfirmacion(null);
                cambiarActivo(empleado);
            }
        });
    }

    function handleCerrarSesion() {
        cerrarSesion()
        navigate('/login', { replace: true })
    }
    return (
        <>
            <div className="contenedor">
                <div className="page-header">
                    <div className="page-header-image">
                        <img src={img_cuenta} alt="Cuenta" />
                    </div>
                    <div className="page-header-title">
                        <h1>Mi cuenta</h1>
                        <p>Tus datos dentro del sistema del taller.</p>
                    </div>
                     <div className="usuario-info barra-gestor__sesion">
                        <span className="usuario-info__nombre">{miCuenta.nombre}</span>
                        <button type="button" className="btn-cerrar-sesion" onClick={handleCerrarSesion}>
                            Cerrar sesión
                        </button>
                    </div>
                </div>
                <MiCuenta cuenta={miCuenta} />
            </div>

            {esAdmin && (
                <div className="contenedor">
                    <div className="page-header">
                        <div className="page-header-image">
                            <img src={img_empleado} alt="Empleados" />
                        </div>
                        <div className="page-header-title">
                            <h1>Empleados</h1>
                            <p>Usuarios del taller y sus roles.</p>
                        </div>
                        <BotonNuevo onClick={handleNuevoEmpleado} componente="empleado" />
                    </div>
                    <Table
                        inputPlaceholder="Buscar por nombre o usuario..."
                        columnas={columnasEmpleados}
                        datos={empleados}
                        mensajeVacio="Todavía no hay empleados cargados."
                        renderFila={(empleado) => (
                            <tr key={empleado.id} className={empleado.activo ? "" : "empleado-inactivo"}>
                                <td data-label="Empleado">
                                    <div className="empleado-celda">
                                        <span className="cuenta-avatar">{iniciales(empleado.nombre)}</span>
                                        <div>
                                            <strong>{empleado.nombre}</strong>
                                            {empleado.id === miCuenta.id && <span className="cuenta-vos">Vos</span>}
                                            <div className="cuenta-usuario">@{empleado.usuario}</div>
                                        </div>
                                    </div>
                                </td>
                                <td data-label="Rol">
                                    <span className={`cuenta-badge cuenta-rol-${empleado.rol.toLowerCase()}`}>{textoRol(empleado.rol)}</span>
                                </td>
                                <td data-label="Estado">
                                    <span className={`cuenta-badge ${empleado.activo ? "cuenta-activo" : "cuenta-inactivo"}`}>
                                        {empleado.activo ? "Activo" : "Inactivo"}
                                    </span>
                                </td>
                                <td data-label="Acciones">
                                    <div className="acciones-container">
                                        <BotonEditar onClick={() => handleEditarEmpleado(empleado)} />
                                        {empleado.id !== miCuenta.id && (
                                            <button type="button" className={`btn btn-sm ${empleado.activo ? "btn-outline-danger" : "btn-outline-success"}`} onClick={() => handleCambiarActivo(empleado)}>
                                                {empleado.activo ? "Dar de baja" : "Reactivar"}
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )}
                    />
                </div>
            )}

            {mostrarFormulario && (
                <Modal titulo={empleadoEnEdicion ? `Editar a ${empleadoEnEdicion.nombre}` : "Nuevo empleado"} onCerrar={() => setMostrarFormulario(false)}>
                    <EmpleadoForm
                        empleado={empleadoEnEdicion}
                        onGuardar={handleGuardarEmpleado}
                        onCancelar={() => setMostrarFormulario(false)}
                        error={errorFormulario}
                    />
                </Modal>
            )}

            <ModalNotificacion
                tipo="error"
                mensaje={mensajeError}
                onCerrar={() => setMensajeError("")}
            />
            {confirmacion && (
                <ModalNotificacion
                    tipo="confirmacion"
                    {...confirmacion}
                    onCerrar={() => setConfirmacion(null)}
                />
            )}
        </>
    );
}

export default CuentaPage;
