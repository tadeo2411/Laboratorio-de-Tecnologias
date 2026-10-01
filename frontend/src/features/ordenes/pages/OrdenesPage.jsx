import { useState, useEffect } from 'react';
import OrdenesForm from "../components/OrdenesForm.jsx";
import Ordenes from '../components/Ordenes.jsx';
import { obtenerOrdenes } from "../services/ordenesService";

function OrdenesPage() {
    const [ordenes,setOrdenes] = useState([]);

    useEffect(() => {
            async function pedirOrdenes() {
                const ordenes = await obtenerOrdenes();
                setOrdenes(ordenes);
            }
            pedirOrdenes();
        }, []);

    function handleAgregarOrden(nuevoOrden) { //recordar 
        setOrdenes(anteriores => [
            ...anteriores,
            nuevoOrden
        ]);
    }

    return(
        <>
        <OrdenesForm onAgregar={handleAgregarOrden}/>
        <Ordenes ordenes = {ordenes}/>
        </>
    );
}

export default OrdenesPage;