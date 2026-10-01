import Turnos from "../components/Turnos"
import { useEffect, useState } from 'react';
import { obtenerTurnos } from '../services/turnosService';


function TurnosPage(){
    const [turnos, setTurnos] = useState([])
    const [error, setError] = useState(null)

    useEffect(()=>{
        let activo = true
        async function cargarTurnos(){
            try{
                const listTurnos = await obtenerTurnos()
                if(activo)
                    setTurnos(listTurnos)
            }catch(error){
                if(activo)
                    setError(error.message)
            }

        }
    }

    )
    return(
        <>

        <Turnos />

        </>
    )
}

export default TurnosPage