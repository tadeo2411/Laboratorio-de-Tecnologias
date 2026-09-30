import { useState } from 'react'
import RepuestosForm from './components/RepuestosForm'
import RepuestosList from './components/RepuestosList'
import repuestosIniciales from './data/repuestos.json'
import './repuestos.css'

function RepuestoPage() {
  const [repuestos, setRepuestos] = useState(repuestosIniciales)

  function agregarRepuesto(repuesto) {
    setRepuestos((repuestosActuales) => [
      ...repuestosActuales,
      { id: crypto.randomUUID(), ...repuesto },
    ])
  }

  return (
    <div className="gestion-page">
      <section className="contenedor">
        <h1 className="titContenedor">Nuevo repuesto</h1>
        <RepuestosForm onGuardar={agregarRepuesto} />
      </section>

      <RepuestosList repuestos={repuestos} />
    </div>
  )
}

export default RepuestoPage
