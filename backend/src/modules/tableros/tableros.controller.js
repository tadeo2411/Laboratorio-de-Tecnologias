import tablerosService from './tableros.service.js'

async function obtenerOrdenes(req, res) {
    const ordenesVivas = await tablerosService.obtenerOrdenes()
    return res.json(ordenesVivas)
}

async function obtenerOrdenesUltimosMeses(req, res){
    const resumen = await tablerosService.obtenerOrdenesUltimosMeses(req.params.meses)
    return res.json(resumen)
}

async function obtenerProximosTurnos(req, res) {
    const turnos = await tablerosService.obtenerProximosTurnos()
    return res.json(turnos)
}

async function obtenerInfoFinanciera(req, res) {
    const info = await tablerosService.obtenerInfoFinanciera()
    return res.json(info)
}

export default {
    obtenerInfoFinanciera,
    obtenerProximosTurnos,
    obtenerOrdenesUltimosMeses,
    obtenerOrdenes
}
