import { useEffect, useState } from 'react'
import Modal from '../../../shared/components/Modal'
import Spinner from '../../../shared/components/Spinner'
import { obtenerDuenos, gestionarAviso } from '../services/vehiculosService'

function formatearFecha(fecha) {
  const [anio, mes, dia] = fecha.split('-')
  return `${dia}/${mes}/${anio}`
}

function telefonoParaWhatsApp(telefono) {
  const digitos = String(telefono ?? '').replace(/\D/g, '').replace(/^0+/, '')
  if (digitos.length < 8) return ''
  if (digitos.startsWith('549')) return digitos
  if (digitos.startsWith('54')) return `549${digitos.slice(2)}`
  return `549${digitos}`
}

function AvisoService({ vehiculo, onCerrar, onGestionado }) {
  const [dueno, setDueno] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    let activo = true

    async function cargarDueno() {
      try {
        const duenos = await obtenerDuenos(vehiculo.id)
        if (activo) setDueno(duenos[0] ?? null)
      } catch (errorCarga) {
        if (activo) setError(errorCarga.message)
      } finally {
        if (activo) setCargando(false)
      }
    }
    cargarDueno()

    return () => {
      activo = false
    }
  }, [vehiculo.id])

  const fecha = formatearFecha(vehiculo.proximoService)
  const telefono = telefonoParaWhatsApp(dueno?.telefono)
  const mensaje = `Hola ${dueno?.nombre ?? ''}, te escribimos del Taller 303. Tu ${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.patente}) tiene previsto su próximo service el ${fecha}. ¿Querés que te agendemos un turno?`
  const enlaceWhatsApp = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`

  async function gestionar(estado) {
    setError('')
    setGuardando(true)
    try {
      await gestionarAviso(vehiculo.id, estado)
      onGestionado(vehiculo.id, estado)
    } catch (errorGestion) {
      setError(errorGestion.message)
      setGuardando(false)
    }
  }

  function enviarPorWhatsApp(evento) {
    if (guardando) {
      evento.preventDefault()
      return
    }
    gestionar('ENVIADO')
  }

  return (
    <Modal titulo="Aviso de service pendiente" onCerrar={onCerrar}>
      <p>
        El vehículo <strong>{vehiculo.patente} · {vehiculo.marca} {vehiculo.modelo}</strong> tiene un service
        previsto para el <strong>{fecha}</strong>.
      </p>

      {cargando && <Spinner />}

      {error && <p className="alert alert-danger" role="alert">{error}</p>}

      {!cargando && dueno && (
        <p>
          Cliente: <strong>{dueno.nombre}</strong>
          {dueno.telefono && <> · {dueno.telefono}</>}
        </p>
      )}

      {!cargando && !dueno && !error && (
        <p className="text-secondary">Este vehículo no tiene un dueño cargado.</p>
      )}

      {!cargando && dueno && !telefono && (
        <p className="text-secondary">
          El cliente no tiene un teléfono válido. Si ya lo avisaste por otro medio, marcalo como enviado.
        </p>
      )}

      {telefono && (
        <p className="text-secondary">
          Se abre WhatsApp con el mensaje armado y el aviso queda registrado como enviado.
        </p>
      )}

      <div className="d-flex flex-wrap justify-content-end gap-2">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => gestionar('DESCARTADO')}
          disabled={guardando}
        >
          Descartar aviso
        </button>

        {telefono ? (
          <a
            className="btn btn-success"
            href={enlaceWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            onClick={enviarPorWhatsApp}
          >
            Enviar por WhatsApp
          </a>
        ) : (
          <button
            type="button"
            className="btn btn-success"
            onClick={() => gestionar('ENVIADO')}
            disabled={guardando || cargando}
          >
            Marcar como enviado
          </button>
        )}
      </div>
    </Modal>
  )
}

export default AvisoService
