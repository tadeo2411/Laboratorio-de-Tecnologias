import {obtenerEstado} from "../utils/estados";
function EtiquetaEstado({estado}) {
    const objetoEstado = obtenerEstado(estado);
    return <span className={`estado-badge ${objetoEstado.class}`}>{objetoEstado.texto}</span>
}
export default EtiquetaEstado;