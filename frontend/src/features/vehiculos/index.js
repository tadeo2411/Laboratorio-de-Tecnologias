export { default as VehiculosPage , obtenerDuenos} from './pages/VehiculosPage'
export { default as VehiculoForm } from './components/VehiculoForm'
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
