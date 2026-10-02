import Faq from '../components/FAQ/Faq'
import Inicio from '../components/Inicio/Inicio'
import ServiceSection from '../components/ServiceCards/ServiceSection'
import Mapa from "../components/Mapa/Mapa";
import './PaginaInicial.css'

function PaginaInicial(){
    return(
        <>
        <Inicio />
        <ServiceSection />
        <Faq />
        <Mapa />
        </>
    )
}
export default PaginaInicial