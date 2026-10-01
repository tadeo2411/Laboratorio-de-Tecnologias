import PresupuestosForm from '../components/PresupuestoForm'
import Presupuestos from '../components/Presupuestos'
import { useEffect, useState } from 'react';
import { obtenerPresupuestos } from '../services/presupuestosService';

function PresupuestosPage(){
    const [presupuestos, setPresupuestos] = useState([])
    const [error, setError] = useState ('')

    //cargo los presupuestos desde el servicio, utilizando las funciones asincronicas para esperar la lectura
    useEffect(() => {
        let activo = true
        async function cargarPresupuestos(){
            try {
                const anteriores = await obtenerPresupuestos()

                if(activo)
                    setPresupuestos(anteriores)


            } catch (error) {

                if(activo)
                    setError(error.message)
            }
        }
        cargarPresupuestos()

        return() =>{
            activo = false
        }
    }, [])
    
    function handleAgregarPresupuesto(nuevoPresupuesto) { //recordar 
        setPresupuestos(anteriores => [
            ...anteriores,
            nuevoPresupuesto
        ]);
    }

    return(
        <>
        {error && <p role="alert">{error}</p>}
        <PresupuestosForm onAgregar = {handleAgregarPresupuesto}/>
        <Presupuestos presupuestos = {presupuestos}/>
        </>
    )
}

export default PresupuestosPage