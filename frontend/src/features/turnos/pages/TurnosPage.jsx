
import TurnosForm from '../components/TurnosForm'
import { useCallback, useEffect, useState } from 'react';
import { obtenerTurnos, obtenerAutos, obtenerClientes, modificarTurno } from '../services/turnosService';
import Table from "../../../shared/components/Table";
import img_list from "../../../assets/icons/turnosIcono.svg"
import BotonNuevo from "../../../shared/components/BotonNuevo";
import BotonEditar from "../../../shared/components/BotonEditar";
import BotonEliminar from "../../../shared/components/BotonEliminar";
import "../turnos.css";
import "../../estilos.css"
import Modal from "../../../shared/components/Modal";
import ModalNotificacion from "../../../shared/components/ModalNotification";

function formatearFechaHora(fechaHora) {
    if (!fechaHora) return "-"
    const [fecha, hora] = fechaHora.split("T")
    const [anio, mes, dia] = fecha.split("-")
    return `${dia}/${mes}/${anio} ${hora.slice(0, 5)}`
}

function TurnosPage() {
    const [turnos, setTurnos] = useState([])
    const [error, setError] = useState(null)
    const [vehiculos, setVehiculos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [turnoAEditar, setTurnoAEditar] = useState(null)
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const cerrarFormulario = useCallback(() => setMostrarFormulario(false), [])
    const [clientes, setClientes] = useState([]);

    const [notificacion, setNotificacion] = useState(null);

    // ABM
    async function handleGuardarTurno() {
        try {
            setTurnos(await obtenerTurnos())
        } catch (error) {
            setNotificacion({
                tipo: "error",
                mensaje: error.message || "No se pudieron actualizar los turnos."
            });
        }
        cerrarFormulario()
    }

    function handleEliminarTurno(turno) {
        setNotificacion({
            tipo: "confirmacion",
            titulo: "Eliminar turno",
            mensaje: `¿Estás seguro de que deseas cancelar el turno? Esta acción no se puede deshacer.`,
            onAceptar: async () => {
                setNotificacion(null);

                try {
                    const { id, ...datosTurno } = turno;

                    await modificarTurno(id, {
                        ...datosTurno,
                        estado: 'CANCELADO'
                    });

                    setTurnos(prev =>
                        prev.map(t =>
                            t.id === id
                                ? { ...t, estado: 'CANCELADO' }
                                : t
                        )
                    );

                } catch (error) {
                    console.error('Error al cancelar el turno:', error);
                }
            }
        });
    }

    function handleEditarTurno(turno) {
        setTurnoAEditar(turno)
        setMostrarFormulario(true)
    }

    useEffect(() => {
        let activo = true

        async function cargarTurnos() {
            try {
                const listTurnos = await obtenerTurnos();
                const listVehiculos = await obtenerAutos();
                const listClientes = await obtenerClientes();

                if (activo) {
                    setTurnos(listTurnos);
                    setClientes(listClientes);
                }

                if (activo) {
                    setTurnos(listTurnos)
                    setVehiculos(listVehiculos)
                }
            } catch (err) {
                if (activo)
                    setError(err instanceof Error ? err.message : 'No se pudieron cargar los turnos')
            } finally {
                if (activo)
                    setCargando(false)
            }
        }

        cargarTurnos()
        return () => activo = false

    }, [])

    const columnasTurnos = [
        { key: "fechaHora", nombre: "Fecha y hora" },
        { key: "clienteNombre", nombre: "Cliente" },
        { key: "motivo", nombre: "Motivo" },
        { key: "estado", nombre: "Estado" },
        { key: "ordenId", nombre: "Orden asociada" },
        { key: "acciones", nombre: "Acciones" }
    ];

    return (
        <>
            {error && <p role="alert">{error}</p>}
            {cargando && <p role="status">Cargando turnos…</p>}

            {!cargando && !error && (
                <div className="contenedor">
                    <div className="page-header">
                        <div className="page-header-image">
                            <img src={img_list} alt="Listado" />
                        </div>

                        <div className="page-header-title">
                            <h1>Turnos</h1>
                            <p>Listado de turnos registrados en el sistema.</p>
                        </div>

                        <BotonNuevo
                            onClick={() => {
                                setTurnoAEditar(null);
                                setMostrarFormulario(true);
                            }}
                            componente={"turno"}
                        />
                    </div>

                    <Table
                        inputPlaceholder="Buscar por cliente, motivo u orden..."
                        columnas={columnasTurnos}
                        datos={turnos}
                        mensajeVacio="No hay turnos registrados"
                        renderFila={(turno) => (
                            <tr key={turno.id} className="turno-row">

                                <td className="turno-fecha" data-label="Fecha y hora">
                                    {formatearFechaHora(turno.fecha_hora)}
                                </td>

                                <td className="turno-cliente" data-label="Cliente">
                                    {turno.cliente_nombre ?? "-"}
                                </td>

                                <td className="turno-motivo" data-label="Motivo">
                                    {turno.motivo}
                                </td>

                                <td className="turno-estado" data-label="Estado">
                                    <span
                                        className={`estado-badge ${
                                            turno.estado === "CONFIRMADO"
                                            ? "estado-confirmado"
                                            : turno.estado === "CUMPLIDO"
                                                ? "estado-cumplido"
                                                : turno.estado === "CANCELADO"
                                                    ? "estado-cancelado"
                                                    : turno.estado === "AUSENTE"
                                                        ? "estado-ausente"
                                                        : "estado-pendiente"
                                        }`}
                                    >
                                        {turno.estado}
                                    </span>
                                </td>

                                <td className="turno-orden" data-label="Orden asociada">
                                    {turno.orden_id ? `#${turno.orden_id}` : "Sin orden"}
                                </td>

                                <td className="turno-acciones" data-label="Acciones">
                                    <div className="acciones-container">
                                        {!["CONFIRMADO", "CANCELADO", "AUSENTE"].includes(turno.estado) && (
                                            <BotonEditar onClick={() => handleEditarTurno(turno)} />
                                        )}

                                        {["CONFIRMADO"].includes(turno.estado) && (
                                            <BotonEliminar onClick={() => handleEliminarTurno(turno)} />
                                        )}
                                    </div>
                                </td>

                            </tr>
                        )}
                    />
                </div>
            )}

            {mostrarFormulario && (
                <Modal
                    titulo={turnoAEditar ? 'Modificar turno' : 'Registrar turno'}
                    onCerrar={cerrarFormulario}
                >
                    {error && <p role="alert">{error}</p>}
                    {cargando && <p role="status">Cargando vehículos…</p>}

                    <TurnosForm
                        turnoInicial={turnoAEditar}
                        onGuardar={handleGuardarTurno}
                        onCancelar={cerrarFormulario}
                        vehiculos={vehiculos}
                        cargando={cargando}
                        error={error}
                        clientes={clientes}
                        onClienteCreado={(nuevoCliente) =>
                            setClientes((actuales) => [...actuales, nuevoCliente])
                        }
                    />
                </Modal>
            )}

            {notificacion && (
                <ModalNotificacion
                    {...notificacion}
                    onCerrar={() => setNotificacion(null)}
                />
            )}
        </>
    )
}

export default TurnosPage