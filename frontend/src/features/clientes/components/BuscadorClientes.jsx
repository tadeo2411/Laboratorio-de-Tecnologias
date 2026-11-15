import { useState, useRef, useEffect, useId } from 'react'
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
  const [abierto, setAbierto] = useState(false)
  const [indiceFoco, setIndiceFoco] = useState(-1)
  const contenedorRef = useRef(null)
  const idLista = useId()
  const idInput = useId()

  const texto = busqueda.toLowerCase().trim()

  const filtrados = texto
    ? clientes
        .filter((cliente) => {
          const yaEsDueno = excluirIds.includes(cliente.id)
          const coincideDocumento = cliente.documento?.toString().trim().includes(texto)
          const coincideNombre = cliente.nombre?.toLowerCase().trim().includes(texto)
          return !yaEsDueno && (coincideDocumento || coincideNombre)
        })
        .slice(0, 6)
    : []

  useEffect(() => {
    function clickAfuera(e) {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
        setAbierto(false)
      }
    }
    document.addEventListener('mousedown', clickAfuera)
    return () => document.removeEventListener('mousedown', clickAfuera)
  }, [])

  function elegir(cliente) {
    onSeleccionar(cliente)
    setBusqueda('')
    setAbierto(false)
    setIndiceFoco(-1)
  }

  function manejarTeclado(e) {
    if (!filtrados.length) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setAbierto(true)
      setIndiceFoco((prev) => (prev < filtrados.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIndiceFoco((prev) => (prev > 0 ? prev - 1 : filtrados.length - 1))
    } else if (e.key === 'Enter' && indiceFoco >= 0) {
      e.preventDefault()
      elegir(filtrados[indiceFoco])
    } else if (e.key === 'Escape') {
      setAbierto(false)
      setIndiceFoco(-1)
    }
  }

  return (
    <div ref={contenedorRef} className="position-relative">
      <label htmlFor={idInput} className="visually-hidden">
        {placeholder}
      </label>
      <input
        id={idInput}
        type="search"
        className="form-control"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={abierto && Boolean(texto)}
        aria-controls={idLista}
        value={busqueda}
        onChange={(e) => {
          setBusqueda(e.target.value)
          setAbierto(true)
          setIndiceFoco(-1)
        }}
        onFocus={() => {
          if (texto) setAbierto(true)
        }}
        onKeyDown={manejarTeclado}
        autoComplete="off"
        placeholder={placeholder}
      />

      {abierto && texto && (
        filtrados.length > 0 ? (
          <ul
            id={idLista}
            role="listbox"
            className="list-group position-absolute w-100 mt-1 shadow-sm buscador-cliente-lista"
          >
            {filtrados.map((cliente, idx) => (
              <li
                key={cliente.id}
                role="option"
                aria-selected={idx === indiceFoco}
                className="list-group-item list-group-item-action p-0"
              >
                <button
                  type="button"
                  className={`btn btn-link text-decoration-none text-dark w-100 text-start px-3 py-2 ${
                    idx === indiceFoco ? 'bg-light' : ''
                  }`}
                  style={{ minHeight: '44px' }}
                  onClick={() => elegir(cliente)}
                >
                  <strong>{cliente.nombre}</strong> ·{' '}
                  <span className="text-muted">Doc: {cliente.documento}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div
            role="status"
            aria-live="polite"
            className="position-absolute w-100 mt-1 p-3 bg-white border rounded shadow-sm text-muted buscador-cliente-vacio"
          >
            No se encontraron clientes con "{busqueda}".
          </div>
        )
      )}

      {onRegistrarNuevo && (
        <button
          type="button"
          className="btn btn-outline-success btn-sm mt-2 d-inline-flex align-items-center gap-1"
          style={{ minHeight: '38px' }}
          onClick={onRegistrarNuevo}
        >
          <span>+ Registrar nuevo cliente</span>
        </button>
      )}
    </div>
  )
}

export default BuscadorClientes
