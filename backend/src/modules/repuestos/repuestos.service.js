// aca va la logica de negocio. Genera id y llama a repository
import  repository  from "./repuestos.repository.js";

function listar() {
    const objetoRepuestos = repository.listar();
    return objetoRepuestos;
}

function cargar() {
    const objetoRepuestos = repository.cargar();

    return objetoRepuestos;
}

function eliminar() {
    const objetoRepuestos = repository.eliminar();

    return objetoRepuestos;
}

function modificar() {
    const objetoRepuestos = repository.modificar();

    return objetoRepuestos;
}

export default { listar, cargar, eliminar, modificar };