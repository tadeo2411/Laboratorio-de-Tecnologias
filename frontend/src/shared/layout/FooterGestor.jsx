import { NavLink } from 'react-router';
// Los íconos se importan con "?react" (plugin vite-plugin-svgr, ver vite.config.js)
// para recibirlos como componentes de React y no como una URL de imagen.
// Justificación: los SVG usan fill="currentColor", así que al estar incrustados
// en el DOM heredan el color del <a> y cambian con la clase itemActivo.
// Con <img src> o <use href> el color no se puede cambiar desde el CSS
// (y <use> además necesita un id y falla con SVG inlineados como data: URI).
import Inicio from '../../assets/icons/dashboardIcono.svg?react'
import Turnos from '../../assets/icons/turnosIcono.svg?react'
import Ordenes from '../../assets/icons/ordenesIcono.svg?react'
import Vehiculos from '../../assets/icons/vehiculosIcono.svg?react'
import Trabajos from '../../assets/icons/trabajosIcono.svg?react'
import Repuestos from '../../assets/icons/repuestosIcono.svg?react'
import Clientes from '../../assets/icons/clientesIcono.svg?react'
import Presupuestos from '../../assets/icons/presupuestosIcono.svg?react'

// Clase activa según el estado de la ruta que entrega NavLink.
const claseItem = ({ isActive }) => isActive ? 'itemActivo' : '';

function FooterGestor() {
    return (
        <ul className='barraInfGestor'>
            {/* "end" evita que Tableros (ruta raíz) figure activo en todas las subrutas */}
            <li><NavLink to="" end className={claseItem}><Inicio />Tableros</NavLink></li>
            <li><NavLink to="ordenes" className={claseItem}><Ordenes />Ordenes</NavLink></li>
            <li><NavLink to="turnos" className={claseItem}><Turnos />Turnos</NavLink></li>
            <li><NavLink to="trabajos" className={claseItem}><Trabajos />Trabajos</NavLink></li>
            <li><NavLink to="clientes" className={claseItem}><Clientes />Clientes</NavLink></li>
            <li><NavLink to="vehiculos" className={claseItem}><Vehiculos />Vehículos</NavLink></li>
            <li><NavLink to="repuestos" className={claseItem}><Repuestos />Repuestos</NavLink></li>
        </ul>
    );
}

export default FooterGestor;
