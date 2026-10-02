import { useState } from 'react'

const valoresIniciales = {
  dueno: '',
  patente: '',
  marca: '',
  modelo: '',
  anio: '',
  kilometraje: '',
  observaciones: '',
}

function VehiculosForm({ onGuardar }) {
  const [formulario, setFormulario] = useState(valoresIniciales)

  function actualizarCampo(event) {
    const { name, value } = event.target
    setFormulario((valoresActuales) => ({
      ...valoresActuales, [name]: value }))
  }

  function manejarEnvio(event) {
    event.preventDefault()
    onGuardar({ ...formulario, patente: formulario.patente.toUpperCase() })
    setFormulario(valoresIniciales)
  }

  return (
    <form onSubmit={manejarEnvio}>
      <div className="formulario anchoComp">
        <label htmlFor="dueno">Dueño</label>
        <select id="dueno" name="dueno" value={formulario.dueno} onChange={actualizarCampo}>
          <option value="">--- Elegir ---</option>
          <option value="Sin asignar">Sin asignar</option>
        </select>
      </div>

      <div className="grilla">
        <div className="formulario">
          <label htmlFor="patente">Patente</label>
          <input id="patente" name="patente" type="text" placeholder="AA000AA" value={formulario.patente} onChange={actualizarCampo} required />
        </div>
        <div className="formulario">
          <label htmlFor="marca">Marca</label>
          <input id="marca" name="marca" type="text" value={formulario.marca} onChange={actualizarCampo} required />
        </div>
        <div className="formulario">
          <label htmlFor="modelo">Modelo</label>
          <input id="modelo" name="modelo" type="text" value={formulario.modelo} onChange={actualizarCampo} required />
        </div>
        <div className="formulario">
          <label htmlFor="anio">Año</label>
          <input id="anio" name="anio" type="number" min="1900" max="2100" value={formulario.anio} onChange={actualizarCampo} />
        </div>
        <div className="formulario">
          <label htmlFor="kilometraje">Kilometraje</label>
          <input id="kilometraje" name="kilometraje" type="number" min="0" value={formulario.kilometraje} onChange={actualizarCampo} />
        </div>
      </div>

      <div className="formulario anchoComp">
        <label htmlFor="observaciones">Observaciones</label>
        <textarea id="observaciones" name="observaciones" rows="3" value={formulario.observaciones} onChange={actualizarCampo} />
      </div>

      <button type="submit" className="btnGuardar">Guardar</button>
    </form>
  )
}

export default VehiculosForm
