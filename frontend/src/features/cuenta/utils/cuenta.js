export function iniciales(nombre){
    return nombre.split(" ").filter(Boolean).slice(0, 2).map(palabra => palabra[0].toUpperCase()).join("");
}

export function formatearFecha(fecha){
    return fecha ? new Date(fecha).toLocaleDateString("es-AR") : "-";
}
