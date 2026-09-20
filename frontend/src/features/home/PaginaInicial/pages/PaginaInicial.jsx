import { useOutlet } from "react-router";
import Faq from '../components/FAQ/Faq'
import Inicio from '../components/Inicio/Inicio'
import ServiceSection from '../components/ServiceCards/ServiceSection'

function PaginaInicial(){
    return(
        <>
        <Inicio />
        <ServiceSection />
        <Faq />
        </>
    )
}
export default PaginaInicial