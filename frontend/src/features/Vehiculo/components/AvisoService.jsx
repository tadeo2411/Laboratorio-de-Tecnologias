function AvisoService({ vehiculo, onCerrar, onConfirmar }) {
  return (
    <div className="modal-fondo" role="presentation" onMouseDown={onCerrar}>
      <section className="modal-contenido" role="dialog" aria-modal="true" aria-labelledby="aviso-titulo" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-cabecera">
          <h2 id="aviso-titulo">Aviso de service pendiente</h2>
          <button type="button" className="btnCerrar" onClick={onCerrar} aria-label="Cerrar aviso">×</button>
        </div>
        <p>El vehículo <strong>{vehiculo.patente} · {vehiculo.marca} {vehiculo.modelo}</strong> tiene un service previsto para el <strong>{vehiculo.proximoService}</strong>.</p>
        <p>Seleccioná una acción para registrar qué se hizo con este aviso.</p>
        <div className="acciones-formulario">
          <button type="button" className="btnGuardar" onClick={() => onConfirmar('enviado')}>Marcar como enviado</button>
          <button type="button" className="btnRojo" onClick={() => onConfirmar('descartado')}>Descartar aviso</button>
        </div>
      </section>
    </div>
  )
}

export default AvisoService
