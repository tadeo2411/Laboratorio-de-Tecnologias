export const ESTADOS_ORDEN = {
    RECIBIDO: {texto: 'Recibido', class: 'estado-recibido'},
    DIAGNOSTICANDO: {texto: 'Diagnosticando', class: 'estado-diagnosticando'},
    ESPERANDO_APROBACION_PRESUPUESTO: {texto: 'Esperando aprobacion.', class: "estado-aprobacion"},
    ESPERANDO_REPUESTO: {texto: 'Esperando repuesto', class: 'estado-repuesto'},
    EN_REPARACION: {texto: 'En reparación', class: 'estado-reparacion'},
    TERMINADO: {texto: 'Terminado', class: 'estado-terminado'},
    ENTREGADO: {texto: 'Entregado', class: 'estado-entregado'},
    CANCELADO: {texto: 'Cancelado', class: 'estado-cancelado'}
};

export const ESTADO_INICIAL = "RECIBIDO";

const TRANSICIONES = {
    RECIBIDO: ["DIAGNOSTICANDO", "CANCELADO"],
    DIAGNOSTICANDO: ["ESPERANDO_APROBACION_PRESUPUESTO", "CANCELADO"],
    ESPERANDO_APROBACION_PRESUPUESTO: ["ESPERANDO_REPUESTO", "EN_REPARACION", "CANCELADO"],
    ESPERANDO_REPUESTO: ["EN_REPARACION", "CANCELADO"],
    EN_REPARACION: ["TERMINADO", "ESPERANDO_REPUESTO", "CANCELADO"],
    TERMINADO: ["ENTREGADO"],
    ENTREGADO: [],
    CANCELADO: []
};

export function obtenerEstado(clave){
    return ESTADOS_ORDEN[clave] ?? {texto: clave, class: ""};
}

export function siguienteEstado(clave){
    return TRANSICIONES[clave] ?? [];
}

export function esEstadoFinal(clave){
    return siguienteEstado(clave).length === 0;
}

const ESTADOS_CON_TRABAJOS = ["DIAGNOSTICANDO", "ESPERANDO_REPUESTO", "EN_REPARACION"];

export function permiteModificarTrabajos(clave){
    return ESTADOS_CON_TRABAJOS.includes(clave);
}

export function puedeCambiarEstado(estadoActual, estadoNuevo){
    return estadoActual === estadoNuevo || siguienteEstado(estadoActual).includes(estadoNuevo);
}