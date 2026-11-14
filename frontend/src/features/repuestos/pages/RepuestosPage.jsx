import { useEffect, useState } from 'react'
import Modal from '../../../shared/components/Modal'
import RepuestoForm from '../components/RepuestoForm'
import BotonNuevo from '../../../shared/components/BotonNuevo'
import BotonEditar from '../../../shared/components/BotonEditar'
import BotonEliminar from '../../../shared/components/BotonEliminar'
import img_list from "../../../assets/icons/repuestosIcono.svg"
import '../RepuestosPage.css'
import '../../estilos.css'

import {
  obtenerRepuestos,
  crearRepuesto,
  eliminarRepuesto,
  modificarRepuesto
} from '../services/repuestosService'
import '../RepuestosPage.css'
import "../../estilos.css"
import Table from '../../../shared/components/Table'
import ModalNotificacion from '../../../shared/components/ModalNotification'

const columnasRepuestos = [
  { key: "id", nombre: "Código" },
  { key: "nombre", nombre: "Nombre" },
  { key: "precio_estandar", nombre: "Precio de venta" },
  { key: "acciones", nombre: "Acciones" }
];

function RepuestosPage() {
  const [repuestos, setRepuestos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [repuestoEnEdicion, setRepuestoEnEdicion] = useState(null)

  const [notificacion, setNotificacion] = useState(null);


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
    try {
      if (repuestoEnEdicion) {
        const modificado = await modificarRepuesto(repuestoEnEdicion.id, datos);
        setRepuestos(anteriores => anteriores.map(r => r.id === modificado.id ? modificado : r));

        setNotificacion({
          tipo: "exito",
          mensaje: "Repuesto actualizado correctamente."
        });

      } else {
        const creado = await crearRepuesto(datos);
        setRepuestos(anteriores => [...anteriores, creado]);

        setNotificacion({
          tipo: "exito",
          mensaje: "Repuesto agregado correctamente."
        });
      }

      cerrarFormulario();

    } catch (error) {
      setNotificacion({
        tipo: "error",
        mensaje: error.message || "No se pudo guardar el repuesto."
      });
    }
  }

  async function confirmarEliminacion(repuesto) {
    setNotificacion({
      tipo: "confirmacion",
      titulo: "Eliminar repuesto",
      mensaje: `¿Estás seguro de que deseas eliminar el repuesto #${repuesto.id} · ${repuesto.nombre}? Esta acción no se puede deshacer.`,
      onAceptar: async () => {
        setNotificacion(null);

        try {
          await eliminarRepuesto(repuesto.id);
          setRepuestos(anteriores => anteriores.filter(r => r.id !== repuesto.id));

          setNotificacion({
            tipo: "exito",
            mensaje: "Repuesto eliminado correctamente."
          });

        } catch (error) {
          setNotificacion({
            tipo: "error",
            mensaje: error.message || "No se pudo eliminar el repuesto."
          });
        }
      }
    });
  }

  return (

    <div className="contenedor">
      <div className="page-header">

        <div className="page-header-image">

          <img src={img_list} alt="Listado" />
        </div>
        <div className="page-header-title">
          <h1>Repuestos</h1>
          <p>Listado de repuestos registrados en el sistema.</p>
        </div>

        <BotonNuevo
          onClick={() => abrirFormulario()}
          componente={"repuesto"}
        />
      </div>

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
                {repuesto.id}
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
                ${Number(repuesto.precio_estandar).toLocaleString("es-AR")}
              </td>

              <td
                className="repuesto-acciones"
                data-label="Acciones"
              >
                <div className="acciones-container">

                  <BotonEditar onClick={() => abrirFormulario(repuesto)} />

                  <BotonEliminar onClick={() => confirmarEliminacion(repuesto)} />

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
          cerrarAlTocarFondo={true}
        >
          <RepuestoForm repuesto={repuestoEnEdicion} onCancelar={cerrarFormulario} onGuardar={guardarRepuesto} />
        </Modal>
      )}
      {notificacion && (
        <ModalNotificacion
          {...notificacion}
          onCerrar={() => {
            if (notificacion.onCerrar) {
              notificacion.onCerrar();
            } else {
              setNotificacion(null);
            }
          }}
        />
      )}
    </div>
  )
}

export default RepuestosPage
