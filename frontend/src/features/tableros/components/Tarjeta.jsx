function Tarjeta({ titulo, valor, subtitulo, variante = 'primario', icono }) {
    return (
        <article className={`tablero-kpi tablero-kpi--${variante}`}>
            <div className="tablero-kpi__cabecera">
                <span className="tablero-kpi__titulo">{titulo}</span>
                {icono && (
                    <span className="tablero-kpi__icono" aria-hidden="true">
                        {icono}
                    </span>
                )}
            </div>
            <strong className="tablero-kpi__valor">{valor}</strong>
            {subtitulo && (
                <span className="tablero-kpi__subtitulo">{subtitulo}</span>
            )}
        </article>
    );
}

export default Tarjeta;