import Modal from '../../../shared/components/Modal'

function AvisoService({ vehiculo, onCerrar, onConfirmar }) {
  return (
    <Modal titulo="Aviso de service pendiente" onCerrar={onCerrar}>
      <p>
        El vehículo <strong>{vehiculo.patente} · {vehiculo.marca} {vehiculo.modelo}</strong> tiene un service
        previsto para el <strong>{vehiculo.proximoService}</strong>.
      </p>
      <p>Seleccioná una acción para registrar qué se hizo con este aviso.</p>
      <div className="acciones-formulario">
        <button type="button" className="btnGuardar" onClick={() => onConfirmar('enviado')}>
          Marcar como enviado
        </button>
        <button type="button" className="btnCancelar" onClick={() => onConfirmar('descartado')}>
          Descartar aviso
        </button>
      </div>
    </Modal>
  )
}

export default AvisoService
