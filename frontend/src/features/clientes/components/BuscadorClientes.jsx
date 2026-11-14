import { useState } from 'react'
import '../clientes.css'

function BuscadorClientes({
  id,
  clientes = [],
  onSeleccionar,
  excluirIds = [],
  placeholder = 'Buscar por nombre o DNI/CUIT...',
  onRegistrarNuevo,
}) {
  const [busqueda, setBusqueda] = useState('')
  const texto = busqueda.toLowerCase().trim()

  const filtrados = texto
    ? clientes
        .filter((cliente) => {
          const yaEsDueno = excluirIds.includes(cliente.id)
          const coincideDocumento = cliente.documento?.trim().includes(texto)
          const coincideNombre = cliente.nombre?.toLowerCase().trim().includes(texto)
          return !yaEsDueno && (coincideDocumento || coincideNombre)
        })
        .slice(0, 6)
    : []

  function elegir(cliente) {
    onSeleccionar(cliente)
    setBusqueda('')
  }

  return (
    <div className="position-relative">
      <input
        id={id}
        type="search"
        className="form-control"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && busqueda) {
            e.stopPropagation()
            setBusqueda('')
          }
        }}
        autoComplete="off"
        placeholder={placeholder}
      />

      {texto && (
        filtrados.length > 0 ? (
          <ul className="list-group position-absolute w-100 mt-1 shadow buscador-cliente-lista">
            {filtrados.map((cliente) => (
              <li key={cliente.id} className="list-group-item list-group-item-action p-0">
                <button
                  type="button"
                  className="btn btn-link text-decoration-none text-dark w-100 text-start px-3 py-2"
                  onClick={() => elegir(cliente)}
                >
                  <strong>{cliente.nombre}</strong> · <span className="text-muted">Doc: {cliente.documento}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="position-absolute w-100 mt-1 p-2 bg-white border rounded shadow-sm text-muted buscador-cliente-vacio">
            No se encontraron clientes con "{busqueda}".
          </div>
        )
      )}

      {onRegistrarNuevo && (
        <button
          type="button"
          className="btn btn-outline-success btn-sm mt-2"
          onClick={onRegistrarNuevo}
        >
          + Registrar nuevo cliente
        </button>
      )}
    </div>
  )
}

export default BuscadorClientes
