import Turnos from "../components/Turnos"
import TurnosModal from '../../../shared/components/Modal'
import TurnosForm from '../components/TurnosForm'
import { useCallback, useEffect, useState } from 'react';
import { obtenerTurnos, obtenerAutos, eliminarTurno } from '../services/turnosService';
import Table from "../../../shared/components/Table";
import img_list from "../../../assets/icons/turnosIcono.svg"
import BotonNuevo from "../../../shared/components/BotonNuevo";
import BotonEditar from "../../../shared/components/BotonEditar";
import BotonEliminar from "../../../shared/components/BotonEliminar";
import "../turnos.css";
import "../../estilos.css"
import Modal from "../../../shared/components/Modal";
import ModalNotificacion from "../../../shared/components/ModalNotification";

function TurnosPage() {
    const [turnos, setTurnos] = useState([])
    const [error, setError] = useState(null)
    const [vehiculos, setVehiculos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [turnoAEditar, setTurnoAEditar] = useState(null)
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const cerrarFormulario = useCallback(() => setMostrarFormulario(false), [])

    const [notificacion, setNotificacion] = useState(null);

    //abm
    function handleAgregarTurno() { //se llama handle para seguir con la convencion de nombres en props
        cerrarFormulario()
    }
    function handleEliminarTurno(idTurno) {

        setNotificacion({
            tipo: "confirmacion",
            titulo: "Eliminar turno",
            mensaje: `¿Estás seguro de que deseas eliminar el turno? Esta acción no se puede deshacer.`,
            onAceptar: async () => {
                setNotificacion(null);

                try {
                    await eliminarTurno(idTurno);
                    window.location.reload();

                } catch (error) {
                    setNotificacion({
                        tipo: "error",
                        mensaje: error.message || "No se pudo eliminar el turno."
                    });
                }
            }
        });
    }

    function handleEditarTurno(turno) {
        setTurnoAEditar(turno)
        setMostrarFormulario(true)
    }

    function handleModificarTurno() {
        cerrarFormulario()
    }

    useEffect(() => {
        let activo = true
        async function cargarTurnos() {
            try {
                const listTurnos = await obtenerTurnos();
                const listVehiculos = await obtenerAutos();

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


    // El turno guarda el id del vehículo; la patente se busca para mostrarla.
    function patenteDeVehiculo(vehiculoId) {
        return vehiculos.find(vehiculo => vehiculo.id === vehiculoId)?.patente ?? '—'
    }

    const columnasTurnos = [
        { key: "fechaHora", nombre: "Fecha y hora" },
        { key: "clienteDocumento", nombre: "DNI del dueño" },
        { key: "vehiculoPatente", nombre: "Patente" },
        { key: "motivo", nombre: "Motivo" },
        { key: "estado", nombre: "Estado" },
        { key: "ordenId", nombre: "Orden asociada" },
        { key: "acciones", nombre: "Acciones" }
    ];


    return (// camino de esta page: muestra los turnos traidos por el json, al tocar el botón de nuevo turno, se abre el modal con el formulario
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
                            onClick={() => { setTurnoAEditar(null); setMostrarFormulario(true) }}
                            componente={"turno"}
                        />
                    </div>
                    <Table
                        inputPlaceholder="Buscar por descripción, orden, trabajo..."
                        columnas={columnasTurnos}
                        datos={turnos}
                        mensajeVacio="No hay turnos registrados"
                        renderFila={(turno) => (
                            <tr key={turno.id} className="turno-row">

                                <td className="turno-fecha" data-label="Fecha y hora">
                                    {turno.fecha_hora}
                                </td>

                                <td className="turno-cliente" data-label="DNI del cliente">
                                    {turno.cliente_documento}
                                </td>

                                <td className="turno-patente" data-label="Patente">
                                    {turno.vehiculo_patente}
                                </td>

                                <td className="turno-motivo" data-label="Motivo">
                                    {turno.motivo}
                                </td>

                                <td className="turno-estado" data-label="Estado">
                                    <span
                                        className={`estado-badge ${turno.estado === "SOLICITADO"
                                            ? "estado-solicitado"
                                            : turno.estado === "CONFIRMADO"
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
                                        <BotonEditar onClick={() => handleEditarTurno(turno)} />

                                        <BotonEliminar onClick={() => handleEliminarTurno(turno.id)} />
                                    </div>
                                </td>

                            </tr>
                        )}
                    />
                </div>
            )}
            {mostrarFormulario && ( //cuando es true monta el modal y el formulario, cuando es false los elimina
                <Modal
                    titulo={turnoAEditar ? 'Modificar turno' : 'Registrar turno'}
                    onCerrar={cerrarFormulario}
                >
                    {error && <p role="alert">{error}</p>}
                    {cargando && <p role="status">Cargando vehículos…</p>}
                    <TurnosForm
                        turnoInicial={turnoAEditar}
                        onGuardar={turnoAEditar
                            ? handleModificarTurno
                            : handleAgregarTurno}
                        vehiculos={vehiculos}
                        cargando={cargando}
                        error={error}
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
