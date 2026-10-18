import { useLoaderData } from "react-router";
import img_cuenta from "../../../assets/icons/cuentaIcono.svg"
import img_empleado from "../../../assets/icons/clientesIcono.svg"
import Table from "../../../shared/components/Table";
import BotonNuevo from "../../../shared/components/BotonNuevo";
import BotonEditar from "../../../shared/components/BotonEditar";
import MiCuenta from "../components/MiCuenta";
import { textoRol } from "../../auth";
import { iniciales, formatearFecha } from "../utils/cuenta";
import "../../estilos.css"
import "../cuenta.css"

const columnasEmpleados = [
    { key: "empleado", nombre: "Empleado" },
    { key: "rol", nombre: "Rol" },
    { key: "alta", nombre: "Alta" },
    { key: "estado", nombre: "Estado" },
    { key: "acciones", nombre: "Acciones" },
];

function CuentaPage() {
    const { miCuenta, empleados, esAdmin } = useLoaderData();

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
                        <BotonNuevo componente="empleado" />
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
                                <td data-label="Alta">{formatearFecha(empleado.createdAt)}</td>
                                <td data-label="Estado">
                                    <span className={`cuenta-badge ${empleado.activo ? "cuenta-activo" : "cuenta-inactivo"}`}>
                                        {empleado.activo ? "Activo" : "Inactivo"}
                                    </span>
                                </td>
                                <td data-label="Acciones">
                                    <div className="acciones-container">
                                        <BotonEditar />
                                        {empleado.id !== miCuenta.id && (
                                            <button type="button" className={`btn btn-sm ${empleado.activo ? "btn-outline-danger" : "btn-outline-success"}`}>
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
        </>
    );
}

export default CuentaPage;
