import { useState } from 'react'

function VehiculosForm({ vehiculoEnEdicion, onCancelar, onGuardar }) {
  const crearEstadoInicial = (vehiculo = null) => ({
    dueno: vehiculo?.dueno || '',
    patente: vehiculo?.patente || '',
    marca: vehiculo?.marca || '',
    modelo: vehiculo?.modelo || '',
    anio: vehiculo?.anio || '',
    kilometraje: vehiculo?.kilometraje || '',
    observaciones: vehiculo?.observaciones || '',
  })

  const [formData, setFormData] = useState(() => crearEstadoInicial(vehiculoEnEdicion))

  const formKey = vehiculoEnEdicion?.id ?? vehiculoEnEdicion?.patente ?? 'new'

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onGuardar(formData)
  }

  const esEdicion = vehiculoEnEdicion && !vehiculoEnEdicion.isNew

  return (
    <form key={formKey} onSubmit={handleSubmit}>
      <div className="formulario">
        <label htmlFor="dueno">Dueño</label>
        <select
          id="dueno"
          name="dueno"
          value={formData.dueno}
          onChange={handleChange}
          required
        >
          <option value="">--- Elegir dueño ---</option>
          <option value="Juan Perez">Juan Pérez</option>
          <option value="Maria Gomez">María Gómez</option>
          <option value="Carlos Lopez">Carlos López</option>
        </select>
      </div>

      <div className="grilla">
        <div className="formulario">
          <label htmlFor="patente">Patente</label>
          <input
            id="patente"
            name="patente"
            type="text"
            placeholder="AA000AA"
            value={formData.patente}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formulario">
          <label htmlFor="marca">Marca</label>
          <input
            id="marca"
            name="marca"
            type="text"
            value={formData.marca}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formulario">
          <label htmlFor="modelo">Modelo</label>
          <input
            id="modelo"
            name="modelo"
            type="text"
            value={formData.modelo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formulario">
          <label htmlFor="anio">Año</label>
          <input
            id="anio"
            name="anio"
            type="number"
            value={formData.anio}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formulario">
          <label htmlFor="kilometraje">Kilometraje</label>
          <input
            id="kilometraje"
            name="kilometraje"
            type="number"
            value={formData.kilometraje}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="formulario">
        <label htmlFor="observaciones">Observaciones</label>
        <textarea
          id="observaciones"
          name="observaciones"
          rows="3"
          value={formData.observaciones}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="acciones-formulario">
        <button type="submit" className="btnGuardar">
          {esEdicion ? 'Guardar Cambios' : 'Crear Vehículo'}
        </button>
        <button type="button" className="btnCancelar" onClick={onCancelar}>
          Salir
        </button>
      </div>
    </form>
  )
}

export default VehiculosForm