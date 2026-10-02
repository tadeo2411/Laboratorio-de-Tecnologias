function Tarjeta({nombre,cantidad,imagen, filtro}){
    return(
    <div className="Tarjeta">
        <img style={{ filter: filtro }} height={"50px"} src={imagen}></img>
        <span className="tarjetaTitulo">{nombre}</span>
        <span className="tarjetaCantidad">{cantidad}</span>
    </div>
    );
}

export default Tarjeta;