import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import logo from "/images/logo-303mei.jpg"

function NoEncontradaPage() {
  const error = useRouteError()

  const esErrorInesperado =
    Boolean(error) &&
    !(isRouteErrorResponse(error) && error.status === 404)

  return (
    <div className="py-5 px-3 text-center">
      <p className="display-1 fw-bold text-success">
        {esErrorInesperado ? 'Ups' : '404'}
      </p>

      <h1 className="h3 mb-3">
        {esErrorInesperado
          ? 'Algo salió mal'
          : 'Página no encontrada'}
      </h1>

      <p className="text-body-secondary mb-4">
        {esErrorInesperado
          ? 'Ocurrió un error inesperado. Probá volver al inicio.'
          : 'La dirección que buscás no existe o fue movida.'}
      </p>

      <Link to="/" className="btn btn-success px-4">
        Volver al inicio
      </Link>

      <img
        src={logo}
        alt="Logo"
        className="d-block mx-auto mt-4"
        style={{ width: '80px', height: 'auto' }}
      />
    </div>
  )
}

export default NoEncontradaPage
