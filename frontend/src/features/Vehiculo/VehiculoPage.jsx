import { useState } from 'react'
import VehiculosForm from './components/VehiculosForm'
import VehiculosList from './components/VehiculosList'
import vehiculosIniciales from './data/vehiculos.json'
import './vehiculos.css'

function VehiculoPage() {
  const [vehiculos, setVehiculos] = useState(vehiculosIniciales)

  function agregarVehiculo(vehiculo) {
    setVehiculos((vehiculosActuales) => [
      ...vehiculosActuales,
      { id: crypto.randomUUID(), ...vehiculo },
    ])
  }

  return (
    <div className="gestion-page">
      <section className="contenedor">
        <h1 className="titContenedor">Nuevo vehículo</h1>
        <VehiculosForm onGuardar={agregarVehiculo} />
      </section>

      <VehiculosList vehiculos={vehiculos} />
    </div>
  )
}

export default VehiculoPage
