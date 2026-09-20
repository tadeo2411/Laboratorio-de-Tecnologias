

function ServiceCard({ servicio, onSelect }) {
    const { icono, titulo } = servicio

    return (
        <button
            type="button"
            className="service-card"
            onClick={() => onSelect(servicio)}
            aria-label={`Ver detalle del servicio ${titulo}`}
        >
            <div className="service-icon">{icono}</div>
            <h3 className="service-title">{titulo}</h3>
            <span className="ver-mas-txt">Ver detalle +</span>
        </button>
    )
}

export default ServiceCard;
