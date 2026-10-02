import Turnos from "../components/Turnos"
import TurnosModal from '../components/TurnosModal'
import TurnosForm from '../components/TurnosForm'
import { useCallback, useEffect, useState } from 'react';
import { obtenerTurnos, obtenerAutos } from '../services/turnosService';


function TurnosPage(){
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
    function handleEliminarTurno(idTurno){
        const confirmado = window.confirm('¿Desea eliminar el turno?')

        if (!confirmado) return
        setTurnos(anteriores =>
            anteriores.filter(turno => turno.id !== idTurno)
        )
    }

    function handleEditarTurno(turno){
        setTurnoAEditar(turno)
        setMostrarFormulario(true)
    }

    function handleModificarTurno(datosActualizados){
        setTurnos (
            anteriores => anteriores.map(
                turno =>
                turno.id === turnoAEditar.id
                ? {... datosActualizados, id:turno.id}
                : turno
            )
        )
        cerrarFormulario()
    }

    useEffect(()=>{
        let activo = true
        async function cargarTurnos(){
            try{
                const [listTurnos, listVehiculos] = await Promise.all([obtenerTurnos(), obtenerAutos()])
                
                if(activo){
                    setTurnos(listTurnos)
                    setVehiculos(listVehiculos)
                }
            }catch(err){
                if(activo)
                    setError(err instanceof Error ? err.message : 'No se pudieron cargar los turnos')
            }finally{
                if(activo)
                    setCargando(false)
            }

        }
        cargarTurnos()
        return () => activo = false

    }, [])



    return(// camino de esta page: muestra los turnos traidos por el json, al tocar el botón de nuevo turno, se abre el modal con el formulario
        <>
        {error && <p role="alert">{error}</p>}
        {cargando && <p role="status">Cargando turnos…</p>}
        {!cargando && !error && (
            <Turnos 
            turnos={turnos}

            onNuevoTurno={() => {setTurnoAEditar(null)
                setMostrarFormulario(true)}}
            onEliminarTurno={handleEliminarTurno}
            onEditarTurno={handleEditarTurno}
            />
        )}
        {mostrarFormulario && ( //cuando es true monta el modal y el formulario, cuando es false los elimina
            <TurnosModal onCerrar={cerrarFormulario}>
                {error && <p role="alert">{error}</p>}
                {cargando && <p role="status">Cargando vehículos…</p>}
                <TurnosForm
                    turnoInicial ={turnoAEditar}
                    onGuardar={turnoAEditar
                        ?  handleModificarTurno
                        :handleAgregarTurno}
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
