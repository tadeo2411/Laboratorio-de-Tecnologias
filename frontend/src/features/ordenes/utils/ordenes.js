export const DIAS_GARANTIA = 90;

export function numeroOrden(id){
    return `OT-${String(id).padStart(4, "0")}`;
}

export function formatearFecha(fecha){
    if (!fecha) return "-";
    return new Date(fecha).toLocaleDateString("es-AR");
}

export function formatearPrecio(valor){
    return `$${Number(valor || 0).toLocaleString("es-AR")}`;
}

export function buscarFicha(orden, tipo){
    return orden.fichas.find(ficha => ficha.tipo === tipo);
}

export function fechaIngreso(orden){
    return buscarFicha(orden, "INGRESO")?.fecha ?? orden.createdAt;
}

export function fechaEgreso(orden){
    return buscarFicha(orden, "EGRESO")?.fecha ?? null;
}

export function textoGarantia(orden){
    const egreso = fechaEgreso(orden);
    if (!egreso) return "Empieza cuando se entregue el vehículo";

    const vencimiento = new Date(egreso);
    vencimiento.setDate(vencimiento.getDate() + DIAS_GARANTIA);

    if (vencimiento < new Date()) return `Vencida el ${formatearFecha(vencimiento)}`;
    return `Vigente hasta el ${formatearFecha(vencimiento)}`;
}

export function describirVehiculo(vehiculos, patente){
    const vehiculo = vehiculos.find(v => v.patente === patente);
    if (!vehiculo) return "Vehículo no encontrado";
    return `${vehiculo.marca} ${vehiculo.modelo ?? ""}`;
}

export function repuestosDeLaOrden(orden){
    return orden.trabajos.flatMap(trabajo => trabajo.repuestos);
}

export function totalManoDeObra(orden){
    return orden.trabajos.reduce((total, trabajo) => total + trabajo.manoDeObra, 0);
}

export function totalRepuestos(orden){
    return repuestosDeLaOrden(orden).reduce((total, repuesto) => total + repuesto.cantidad * repuesto.precioUnitario, 0);
}
