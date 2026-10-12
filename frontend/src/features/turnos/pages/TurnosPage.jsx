import Turnos from "../components/Turnos"
import TurnosModal from '../../../shared/components/Modal'
import TurnosForm from '../components/TurnosForm'
import { useCallback, useEffect, useState } from 'react';
import { obtenerTurnos, obtenerAutos } from '../services/turnosService';
import Table from "../../../shared/components/Table";
import img_list from "../../../assets/icons/img_list.png"
import BotonNuevo from "../../../shared/components/BotonNuevo";
import BotonEditar from "../../../shared/components/BotonEditar";
import BotonEliminar from "../../../shared/components/BotonEliminar";
import "../turnos.css";

function TurnosPage() {
    const [turnos, setTurnos] = useState([])
    const [error, setError] = useState(null)
    const [vehiculos, setVehiculos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [turnoAEditar, setTurnoAEditar] = useState(null)
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const cerrarFormulario = useCallback(() => setMostrarFormulario(false), [])


    //abm
    function handleAgregarTurno(nuevoTurno) { //se llama handle para seguir con la convencion de nombres en props
        setTurnos(anteriores => [...anteriores,
        { id: crypto.randomUUID(), ...nuevoTurno }])
        cerrarFormulario()
    }
    function handleEliminarTurno(idTurno) {
        const confirmado = window.confirm('¿Desea eliminar el turno?')

        if (!confirmado) return
        setTurnos(anteriores =>
            anteriores.filter(turno => turno.id !== idTurno)
        )
    }

    function handleEditarTurno(turno) {
        setTurnoAEditar(turno)
        setMostrarFormulario(true)
    }

    function handleModificarTurno(datosActualizados) {
        setTurnos(
            anteriores => anteriores.map(
                turno =>
                    turno.id === turnoAEditar.id
                        ? { ...datosActualizados, id: turno.id }
                        : turno
            )
        )
        cerrarFormulario()
    }

    useEffect(() => {
        let activo = true
        async function cargarTurnos() {
            try {
                const [listTurnos, listVehiculos] = await Promise.all([obtenerTurnos(), obtenerAutos()])

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
        { key: "motivo", nombre: "Motivo" },
        { key: "estado", nombre: "Estado" },
        { key: "patente", nombre: "Patente" },
        { key: "acciones", nombre: "Acciones" }
    ];


    return (// camino de esta page: muestra los turnos traidos por el json, al tocar el botón de nuevo turno, se abre el modal con el formulario
        <>
            {error && <p role="alert">{error}</p>}
            {cargando && <p role="status">Cargando turnos…</p>}
            {!cargando && !error && (
                <div className="contenedor">
                    <div className="turnos-page">
                        <div className="img-container">
                            <img src={img_list} />
                        </div>

                        <div className="title-container">
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
                                    {turno.fechaHora}
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

                                <td className="turno-patente" data-label="Patente">
                                    {turno.patente}
                                </td>

                                <td className="turno-acciones" data-label="Acciones">
                                    <div className="acciones-container">

                                        <BotonEditar onClick={() => handleEditarTurno(turno)} />

                                        <BotonEliminar onClick={() => handleEliminarTurno(turno.id)} />

                                    </div>
                                </td>
                            </tr>
                        )
                        }
                    />
                </div>
            )}
            {mostrarFormulario && ( //cuando es true monta el modal y el formulario, cuando es false los elimina
                <TurnosModal onCerrar={cerrarFormulario}>
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
                </TurnosModal>
            )}

        </>
    )
}

export default TurnosPage
