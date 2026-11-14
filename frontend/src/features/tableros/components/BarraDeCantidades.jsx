function BarraDeCantidades({ nombre, cantidad, cantidadTotal, color }) {
    const porcentaje = cantidadTotal > 0
        ? Math.round((cantidad / cantidadTotal) * 100)
        : 0;

    return (
        <div className="barra-cantidad">
            <div className="barra-cantidad-info">
                <span className="barra-cantidad-nombre">
                    <span
                        className="barra-cantidad-punto"
                        style={{ backgroundColor: color }}
                        aria-hidden="true"
                    />
                    {nombre}
                </span>
                <span className="barra-cantidad-cifras">
                    <strong>{cantidad}</strong>
                    <span className="barra-cantidad-porcentaje">({porcentaje}%)</span>
                </span>
            </div>

            <div className="barra-cantidad-fondo" role="progressbar" aria-valuenow={porcentaje} aria-valuemin={0} aria-valuemax={100}>
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
