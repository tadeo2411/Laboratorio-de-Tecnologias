// Solo presentación: cómo se muestran los presupuestos en pantalla.
// Las reglas y cálculos (precios derivados, vencimiento, estados) son del
// backend; mientras tanto los resuelve services/presupuestosService.js.

export const ESTADOS_PRESUPUESTO = {
    BORRADOR: { texto: "Borrador", clase: "presupuesto-borrador" },
    ENVIADO: { texto: "Enviado", clase: "presupuesto-enviado" },
    APROBADO: { texto: "Aprobado", clase: "presupuesto-aprobado" },
    CANCELADO: { texto: "Cancelado", clase: "presupuesto-cancelado" },
    VENCIDO: { texto: "Vencido", clase: "presupuesto-vencido" },
};

export const TIPOS_ITEM = {
    MANO_DE_OBRA: "Mano de obra",
    REPUESTO: "Repuesto",
    OTRO: "Otro",
    DESCUENTO: "Descuento",
};

export const formatearPrecio = (valor) => `$${Number(valor || 0).toLocaleString("es-AR")}`;

// El total de un renglón viene positivo; si es un descuento se muestra con signo menos.
export const formatearTotalDelRenglon = (renglon) =>
    renglon.tipo === "DESCUENTO" ? `−${formatearPrecio(renglon.precioTotal)}` : formatearPrecio(renglon.precioTotal);

// Las fechas vienen como "AAAA-MM-DD"; se arman a mano para no correr el día por zona horaria.
export const formatearFecha = (fecha) => {
    if (!fecha) return "-";
    const [anio, mes, dia] = fecha.split("-");
    return `${dia}/${mes}/${anio}`;
};
