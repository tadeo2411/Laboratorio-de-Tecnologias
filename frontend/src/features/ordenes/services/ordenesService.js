import { obtenerVehiculos, obtenerClientes } from '../../vehiculos'
import { obtenerTiposTrabajo } from '../../trabajos'
import { obtenerRepuestos } from '../../repuestos'
import { obtenerEmpleados } from '../../auth'
import { ESTADO_INICIAL, esEstadoFinal, puedeCambiarEstado, obtenerEstado, permiteModificarTrabajos } from '../utils/estados'
import { buscarFicha } from '../utils/ordenes'

const URL = '/backend/data'

let ordenes = null

async function cargarOrdenes(){
    if (ordenes === null){
        const respuesta = await fetch(`${URL}/ordenes.json`)

        if (!respuesta.ok){
            throw new Error("No se pudieron cargar las órdenes")
        }
        ordenes = await respuesta.json()
    }
    return ordenes
}

export async function obtenerOrdenes(){
    return cargarOrdenes()
}

export async function cargarPaginaOrdenes(){
    const [listaOrdenes, vehiculos, tiposTrabajo, repuestos, empleados, clientes] = await Promise.all([
        obtenerOrdenes(),
        obtenerVehiculos(),
        obtenerTiposTrabajo(),
        obtenerRepuestos(),
        obtenerEmpleados(),
        obtenerClientes()
    ])
    return { ordenes: listaOrdenes, vehiculos, tiposTrabajo, repuestos, empleados, clientes }
}

function buscarOrdenParaTrabajos(lista, idOrden){
    const orden = lista.find(ordenActual => ordenActual.id === idOrden)

    if (!orden){
        throw new Error("La orden no existe")
    }
    if (!permiteModificarTrabajos(orden.estado)){
        throw new Error(`En el estado "${obtenerEstado(orden.estado).texto}" no se pueden modificar los trabajos`)
    }
    return orden
}

export async function agregarTrabajo(idOrden, datosTrabajo){
    const lista = await cargarOrdenes()
    const ordenActual = buscarOrdenParaTrabajos(lista, idOrden)

    if (!datosTrabajo.tipoTrabajoId){
        throw new Error("Falta elegir el tipo de trabajo")
    }
    if (!(datosTrabajo.manoDeObra >= 0)){
        throw new Error("La mano de obra tiene que ser un número mayor o igual a 0")
    }

    const todosLosTrabajos = lista.flatMap(orden => orden.trabajos)
    const todosLosRepuestos = todosLosTrabajos.flatMap(trabajo => trabajo.repuestos)
    let ultimoIdRepuesto = Math.max(0, ...todosLosRepuestos.map(repuesto => repuesto.id))

    const nuevoTrabajo = {
        ...datosTrabajo,
        id: Math.max(0, ...todosLosTrabajos.map(trabajo => trabajo.id)) + 1,
        repuestos: datosTrabajo.repuestos.map(repuesto => {
            ultimoIdRepuesto = ultimoIdRepuesto + 1
            return { ...repuesto, id: ultimoIdRepuesto }
        })
    }

    const ordenActualizada = { ...ordenActual, trabajos: [...ordenActual.trabajos, nuevoTrabajo] }
    ordenes = lista.map(orden => orden.id === idOrden ? ordenActualizada : orden)
    return ordenActualizada
}

export async function quitarTrabajo(idOrden, idTrabajo){
    const lista = await cargarOrdenes()
    const ordenActual = buscarOrdenParaTrabajos(lista, idOrden)

    const ordenActualizada = {
        ...ordenActual,
        trabajos: ordenActual.trabajos.filter(trabajo => trabajo.id !== idTrabajo)
    }
    ordenes = lista.map(orden => orden.id === idOrden ? ordenActualizada : orden)
    return ordenActualizada
}

export async function crearOrden(datos){
    const lista = await cargarOrdenes()
    const ultimoId = Math.max(0, ...lista.map(orden => orden.id))

    const nuevaOrden = {
        ...datos,
        id: ultimoId + 1,
        turnoId: null,
        estado: ESTADO_INICIAL,
        createdAt: new Date().toISOString(),
        fichas: [],
        trabajos: []
    }

    ordenes = [...lista, nuevaOrden]
    return nuevaOrden
}

export async function actualizarOrden(id, datos){
    const lista = await cargarOrdenes()
    const ordenActual = lista.find(orden => orden.id === id)

    if (!ordenActual){
        throw new Error("La orden no existe")
    }
    if (esEstadoFinal(ordenActual.estado)){
        throw new Error("La orden ya está cerrada y no se puede modificar")
    }

    const estadoNuevo = datos.estado ?? ordenActual.estado
    if (!puedeCambiarEstado(ordenActual.estado, estadoNuevo)){
        throw new Error(`No se puede pasar de "${obtenerEstado(ordenActual.estado).texto}" a "${obtenerEstado(estadoNuevo).texto}"`)
    }
    if (estadoNuevo === "ENTREGADO" && !buscarFicha(ordenActual, "EGRESO")){
        throw new Error("Para entregar el vehículo primero hay que cargar la ficha de egreso")
    }

    const ordenActualizada = { ...ordenActual, ...datos }
    ordenes = lista.map(orden => orden.id === id ? ordenActualizada : orden)
    return ordenActualizada
}

export async function agregarFicha(idOrden, datosFicha){
    const lista = await cargarOrdenes()
    const ordenActual = lista.find(orden => orden.id === idOrden)

    if (!ordenActual){
        throw new Error("La orden no existe")
    }
    if (buscarFicha(ordenActual, datosFicha.tipo)){
        throw new Error("Esta orden ya tiene esa ficha cargada")
    }

    const todasLasFichas = lista.flatMap(orden => orden.fichas)
    const todosLosItems = todasLasFichas.flatMap(ficha => ficha.items)
    let ultimoIdItem = Math.max(0, ...todosLosItems.map(item => item.id))

    const nuevaFicha = {
        ...datosFicha,
        id: Math.max(0, ...todasLasFichas.map(ficha => ficha.id)) + 1,
        fecha: new Date().toISOString(),
        items: datosFicha.items.map(item => {
            ultimoIdItem = ultimoIdItem + 1
            return { ...item, id: ultimoIdItem }
        })
    }

    const ordenActualizada = { ...ordenActual, fichas: [...ordenActual.fichas, nuevaFicha] }
    ordenes = lista.map(orden => orden.id === idOrden ? ordenActualizada : orden)
    return ordenActualizada
}
