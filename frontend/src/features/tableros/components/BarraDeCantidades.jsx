function BarraDeCantidades({ nombre, cantidad, cantidadTotal, color }) {
    const porcentaje = cantidadTotal > 0
        ? (cantidad / cantidadTotal) * 100
        : 0;

    return (
        <div className="barra-cantidad">
            <div className="barra-cantidad-info">
                <span>{nombre}</span>
                <span>{cantidad}</span>
            </div>

            <div className="barra-cantidad-fondo">
                <div
                    className="barra-cantidad-progreso"
                    style={{
                        width: `${porcentaje}%`,
                        backgroundColor: color
                    }}
                />
            </div>
        </div>
    );
}

export default BarraDeCantidades;