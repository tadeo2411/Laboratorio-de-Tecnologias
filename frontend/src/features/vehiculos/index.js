export { default as VehiculosPage} from './pages/VehiculosPage'
export { default as VehiculoForm } from './components/VehiculoForm'
export {default as BuscadorVehiculo} from '../ordenes/components/BuscadorVehiculo'
export {
  obtenerVehiculos,
  crearVehiculo,
  modificarVehiculo,
  eliminarVehiculo,
  buscarVehiculo,
  verHistorialService,
  obtenerDuenos,
  asociarDueno,
  desasociarDueno,
  sincronizarDuenos,
  normalizarPatente,
  obtenerClientes
} from './services/vehiculosService'
