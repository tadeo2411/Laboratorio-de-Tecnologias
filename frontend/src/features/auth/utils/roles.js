export const ROLES = {
    ADMINISTRADOR: "Administrador",
    MECANICO: "Mecánico"
};

export function textoRol(clave){
    return ROLES[clave] ?? clave;
}

export function esAdministrador(sesion){
    return sesion?.rol === "ADMINISTRADOR";
}
