import { useState } from 'react'
import BotonEliminar from '../../../shared/components/BotonEliminar'
import BotonNuevo from '../../../shared/components/BotonNuevo'
import BotonEditar from '../../../shared/components/BotonEditar'

function Clientes({ clientes, onNuevoCliente, onEliminarCliente, onEditarCliente }) {
    const [busqueda, setBusqueda] = useState('')
    const documentoBuscado = busqueda.replace(/[.\s-]/g, '')
    const clientesFiltrados = clientes.filter(cliente =>
        cliente.id.replace(/[.\s-]/g, '').includes(documentoBuscado)
    )
    return(
        <>
            <div className="d-flex justify-content-end mb-3">
                <BotonNuevo
                componente = "Cliente"
                onClick={onNuevoCliente}/>

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
                            <td data-label= "Nombre">{cliente.nombre}</td>
                            
                            <td data-label= "Teléfono">{cliente.telefono}</td>
                            <td data-label= "DNI / CUIT">{cliente.id}</td>
                            <td data-label= "Tipo">{cliente.tipo}</td>
                            <td data-label = "Acciones">
                                <div className="d-flex gap-2">
                                    <BotonEliminar
                                    onClick={()=> onEliminarCliente(cliente.id)}
                                    aria-label={`Eliminar cliente ${cliente.nombre} `}
                                    />
                                    
                                    <BotonEditar onClick = {() => onEditarCliente(cliente)}
                                     componente = "Cliente"
                                     aria-label={`Editar cliente ${cliente.nombre} y documento ${cliente.id}`}/>
                                    
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
