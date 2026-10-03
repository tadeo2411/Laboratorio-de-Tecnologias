import { useState } from 'react'
import BotonEliminar from '../../../shared/components/BotonEliminar'

function Clientes({ clientes, onNuevoCliente, onEliminarCliente, onEditarCliente }) {
    const [busqueda, setBusqueda] = useState('')
    const documentoBuscado = busqueda.replace(/[.\s-]/g, '')
    const clientesFiltrados = clientes.filter(cliente =>
        cliente.id.replace(/[.\s-]/g, '').includes(documentoBuscado)
    )
    return(
        <>
            <div className="d-flex justify-content-end mb-3">
                <button type="button" onClick={onNuevoCliente} className="btn btn-success">
                    Nuevo cliente
                </button>
            </div>
            <section className="contenedor clientes-page__contenedor">
            <h2 className="titContenedor">Clientes</h2>
            <label htmlFor="buscarCliente" className="visually-hidden">Buscar por DNI / CUIT</label>
            <input
                id="buscarCliente"
                type="search"
                className="input-busqueda form-control mb-3"
                placeholder="Buscar por DNI / CUIT"
                value={busqueda}
                onChange={evento => setBusqueda(evento.target.value)}
            />
            <div className="formatoTabla table-responsive">
                <table className="datosTabla table align-middle">
                    <thead>
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Apellido</th>
                            <th scope="col">Teléfono</th>
                            <th scope="col">DNI / CUIT</th>
                            <th scope="col">Tipo</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientesFiltrados.length === 0?(
                        <tr>
                            <td colSpan={6} className="sinDatos text-center">
                                {clientes.length === 0
                                    ? 'Todavía no hay clientes cargados.'
                                    : 'No se encontraron clientes con ese DNI / CUIT.'}
                            </td>
                        </tr>
                        ):
                        clientesFiltrados.map( cliente => (
                        <tr key = {cliente.id}>
                            <td>{cliente.nombre}</td>
                            <td>{cliente.apellido}</td>
                            <td>{cliente.telefono}</td>
                            <td>{cliente.id}</td>
                            <td>{cliente.tipo}</td>
                            <td>
                                <div className="d-flex gap-2">
                                    <BotonEliminar
                                    onClick={()=> onEliminarCliente(cliente.id)}
                                    aria-label={`Eliminar cliente ${cliente.nombre} ${cliente.apellido}`}
                                    />
                                    

                                    <button type ='button'
                                    className="btn btn-primary btn-sm"
                                    onClick = {() => onEditarCliente(cliente)}
                                    aria-label={`Editar cliente ${cliente.nombre}`}
                                    >
                                    
                                </button>
                                </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
        </>
    );
}
export default Clientes;
