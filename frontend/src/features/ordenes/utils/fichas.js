import { buscarFicha } from "./ordenes";
import { esEstadoFinal, siguienteEstado } from "./estados";

export const CONCEPTOS_FICHA = [
    { id: 1, nombre: "Nivel de combustible", opciones: ["Reserva", "1/4", "1/2", "3/4", "Lleno"] },
    { id: 2, nombre: "Rayones", opciones: null, ayuda: "Ej.: No / Puerta trasera izquierda" },
    { id: 3, nombre: "Rueda de auxilio", opciones: ["Sí", "No"] },
];

export const TEXTO_TIPO_FICHA = {
    INGRESO: "Ficha de ingreso",
    EGRESO: "Ficha de egreso",
};

export function fichaVacia(){
    return { kilometraje: "", conformidad: false, valores: {} };
}

export function puedeCargarIngreso(orden){
    return !buscarFicha(orden, "INGRESO") && !esEstadoFinal(orden.estado);
}

export function puedeCargarEgreso(orden){
    const puedeTerminar = orden.estado === "TERMINADO" || siguienteEstado(orden.estado).includes("TERMINADO");
    return !buscarFicha(orden, "EGRESO") && puedeTerminar;
}

export function validarFicha(ficha, kilometrajeIngreso = null){
    const kilometraje = Number(ficha.kilometraje);

    if (ficha.kilometraje === "" || !Number.isInteger(kilometraje) || kilometraje < 0){
        return "El kilometraje tiene que ser un número entero, sin decimales y mayor o igual a 0.";
    }
    if (kilometrajeIngreso !== null && kilometraje < kilometrajeIngreso){
        return `El kilometraje de egreso no puede ser menor al de ingreso (${kilometrajeIngreso} km).`;
    }

    const faltaAlguno = CONCEPTOS_FICHA.some(concepto => !ficha.valores[concepto.nombre]?.trim());
    if (faltaAlguno){
        return "Completá todos los datos de la ficha.";
    }
    return "";
}

export function armarFicha(tipo, ficha){
    return {
        tipo,
        kilometraje: Number(ficha.kilometraje),
        conformidad: ficha.conformidad ? "APROBADA" : "PENDIENTE",
        items: CONCEPTOS_FICHA.map(concepto => ({
            concepto: concepto.nombre,
            valor: ficha.valores[concepto.nombre].trim()
        }))
    };
}
