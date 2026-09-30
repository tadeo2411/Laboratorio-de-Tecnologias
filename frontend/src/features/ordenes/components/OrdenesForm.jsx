

function OrdenesForm(){

    function envioForm(evento){
        evento.preventDefault()
        const nuevaOrden = {
            id: 10,
            numero:'presup-Prueba',
            fecha: '2026-05-18',
            estado: 'PENDIENTE',
            total: 20000,
            observaciones:obs
        }
    onAgregar(nuevoPresupuesto)
    }

    return(
        <>
         <section className = "contenedor">
            <h2 className="titContenedor">Nueva orden</h2>
            <form className="grilla grilla-presupuesto" id = "formularioOrden"
                    onSubmit={envioForm}>
                    <div className = "formulario">
                        <label htmlFor = "idOrden">Seleccione un vehículo:</label>
                        <select name = "Orden de trabajo" id = "idOrden">
                            <option>Elegir</option>
                        </select>
                    </div>
                    <div className="textos">
                        <label htmlFor="idObs">Observaciones</label>
                    </div>
                    <button type="submit" className="btnGuardar"
                        >Guardar orden</button>
                </form>
         </section>
        </>
    );
}

export default OrdenesForm;