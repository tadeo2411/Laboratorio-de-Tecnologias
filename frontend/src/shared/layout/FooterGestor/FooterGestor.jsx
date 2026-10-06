
import { NavLink } from 'react-router';
import { useState } from 'react';

function FooterGestor() {
    return (
        
            <div className="footer-gestor">
                <ul className='barra-inf-gestor'>
                        <li><NavLink  to="" className="hoverNavBar" >Tableros</NavLink></li>
                        <li><NavLink to="ordenes" className="hoverNavBar" >Ordenes</NavLink></li>
                        <li ><NavLink to="turnos" className="hoverNavBar" >Turnos</NavLink></li>
                        <li ><NavLink to="presupuestos" className="hoverNavBar" >Presupuestos</NavLink></li>
                        <li ><NavLink to="clientes" className="hoverNavBar" >Clientes</NavLink></li>
                        <li ><NavLink to="vehiculos" className="hoverNavBar" >Vehículos</NavLink></li>
                        <li ><NavLink to="repuestos" className="hoverNavBar" >Repuestos</NavLink></li>

                </ul>    
            </div>
        
    );
}

export default FooterGestor;