import { useEffect, useState } from 'react'
import Modal from '../../../shared/components/Modal/Modal'
import RepuestoForm from '../components/RepuestoForm'
import RepuestosList from '../components/RepuestosList'
import BotonNuevo from '../../../shared/components/BotonNuevo'
import img_list from "../../../assets/icons/img_list.png"

import {
  actualizarRepuesto,
  crearRepuesto,
  eliminarRepuesto,
  obtenerRepuestos,
} from '../services/repuestosService'
import './RepuestosPage.css'
import Table from '../../../shared/components/table/Table'

const columnasRepuestos = [
  { key: "codigo", nombre: "Código" },
  { key: "nombre", nombre: "Nombre" },
  { key: "precioVenta", nombre: "Precio de venta" },
  { key: "stock", nombre: "Stock" },
  { key: "acciones", nombre: "Acciones" }
];

function RepuestosPage() {
  const [repuestos, setRepuestos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [repuestoEnEdicion, setRepuestoEnEdicion] = useState(null)


  // Carga los repuestos desde el servicio al entrar a la página.
  // "activo" evita actualizar el estado si la página se cerró antes de recibir los datos.
  useEffect(() => {
    let activo = true

    async function cargarRepuestos() {
      try {
        const repuestosGuardados = await obtenerRepuestos()
        if (activo) setRepuestos(repuestosGuardados)
      } catch (errorCarga) {
        if (activo) setError(errorCarga.message)
      } finally {
        if (activo) setCargando(false)
      }
    }

    cargarRepuestos()

    return () => {
      activo = false
    }
  }, [])

  function mostrarMensaje(texto) {
    setError('')
    setMensaje(texto)
  }

  function mostrarError(texto) {
    setMensaje('')
    setError(texto)
  }

  // repuesto = null abre el formulario para registrar uno nuevo.
  function abrirFormulario(repuesto = null) {
    setRepuestoEnEdicion(repuesto)
    setFormularioAbierto(true)
  }

  function cerrarFormulario() {
    setFormularioAbierto(false)
    setRepuestoEnEdicion(null)
  }

  // No captura errores: si el servicio rechaza los datos, el formulario
  // muestra el motivo y queda abierto para corregirlos.
  async function guardarRepuesto(datos) {
    if (repuestoEnEdicion) {
      const repuestoActualizado = await actualizarRepuesto(repuestoEnEdicion.id, datos)
      setRepuestos((repuestosActuales) =>
        repuestosActuales.map((repuesto) =>
          repuesto.id === repuestoActualizado.id ? repuestoActualizado : repuesto,
        ),
      )
      mostrarMensaje('Repuesto actualizado correctamente.')
    } else {
      const repuestoCreado = await crearRepuesto(datos)
      setRepuestos((repuestosActuales) => [...repuestosActuales, repuestoCreado])
      mostrarMensaje('Repuesto agregado correctamente.')
    }
    cerrarFormulario()
  }

  async function confirmarEliminacion(repuesto) {
    if (!window.confirm(`¿Eliminar el repuesto ${repuesto.codigo} · ${repuesto.nombre}? Esta acción no se puede deshacer.`)) return

    try {
      await eliminarRepuesto(repuesto.id)
      setRepuestos((repuestosActuales) => repuestosActuales.filter(({ id }) => id !== repuesto.id))
      mostrarMensaje('Repuesto eliminado correctamente.')
    } catch (errorEliminacion) {
      mostrarError(errorEliminacion.message)
    }
  }

  return (

    <div className="contenedor">
      <div className="repuestos-page">
        <div className="img-container">
          <img src={img_list} />
        </div>

        <div className="title-container">
          <h1>Repuestos</h1>
          <p>Listado de repuestos registrados en el sistema.</p>
        </div>

        <BotonNuevo
          onClick={() => setFormularioAbierto(true)}
          componente={"repuesto"}
        />
      </div>

      {mensaje && (
        <div className="alert alert-success alert-dismissible" role="status">
          {mensaje}
          <button type="button" className="btn-close" aria-label="Cerrar mensaje" onClick={() => setMensaje('')} />
        </div>
      )}

      {error && (
        <div className="alert alert-danger alert-dismissible" role="alert">
          {error}
          <button type="button" className="btn-close" aria-label="Cerrar error" onClick={() => setError('')} />
        </div>
      )}

      {cargando ? (
        <p className="sinDatos">Cargando repuestos...</p>
      ) : (

        <Table
          inputPlaceholder="Buscar por código, nombre..."
          columnas={columnasRepuestos}
          datos={repuestos}
          mensajeVacio="Todavía no hay repuestos cargados."
          renderFila={(repuesto) => (
            <tr key={repuesto.id} className="repuesto-row">

              <td
                className="repuesto-codigo"
                data-label="Código"
              >
                {repuesto.codigo}
              </td>

              <td
                className="repuesto-nombre"
                data-label="Nombre"
              >
                {repuesto.nombre}
              </td>

              <td
                className="repuesto-precio"
                data-label="Precio de venta"
              >
                ${repuesto.precioVenta.toLocaleString("es-AR")}
              </td>

              <td
                className="repuesto-stock"
                data-label="Stock"
              >
                {repuesto.stock}
              </td>

              <td
                className="repuesto-acciones"
                data-label="Acciones"
              >
                <div className="acciones-container">

                  <button
                    className="accion-button accion-info"
                    title="Más información"
                    onClick={() => {
                      setRepuestoSeleccionado(repuesto);
                      setModalMasInfoAbierto(true);
                    }}
                  >
                    ⓘ
                  </button>

                  <button
                    className="accion-button accion-modificar"
                    title="Modificar"
                  >
                    ✎
                  </button>

                  <button
                    className="accion-button accion-eliminar"
                    title="Eliminar"
                  >
                    🗑
                  </button>

                </div>
              </td>

            </tr>
          )}
        />
      )}

      {formularioAbierto && (
        <Modal
          titulo={repuestoEnEdicion ? 'Editar repuesto' : 'Registrar repuesto'}
          onCerrar={cerrarFormulario}
          cerrarAlTocarFondo={false}
        >
          <RepuestoForm repuesto={repuestoEnEdicion} onCancelar={cerrarFormulario} onGuardar={guardarRepuesto} />
        </Modal>
      )}
    </div>
  )
}

export default RepuestosPage
