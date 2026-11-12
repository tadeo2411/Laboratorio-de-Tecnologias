import { urlWhatsApp, DIRECCION, HORARIO } from '../../../../shared/constantes/contacto'

const preguntas = [
    {
        pregunta: '¿Cómo pido un turno?',
        respuesta: 'Escribinos por WhatsApp desde el botón «Pedir turno por WhatsApp» y coordinamos el día y el horario.'
    },
    {
        pregunta: '¿Qué días y en qué horario atienden?',
        respuesta: `${HORARIO}.`
    },
    {
        pregunta: '¿Dónde queda el taller?',
        respuesta: `En ${DIRECCION}. Más abajo tenés el mapa y el botón «Cómo llegar».`
    },
    {
        pregunta: '¿Pueden revisar mi auto si no sé qué falla tiene?',
        respuesta: 'Sí. Hacemos diagnóstico computarizado para encontrar la falla y determinar qué reparaciones necesita el vehículo.'
    },
    {
        pregunta: '¿Qué servicios realizan?',
        respuesta: 'Diagnóstico computarizado, electricidad y batería, aceite y filtros, frenos, dirección y suspensión, aire acondicionado, transmisión y cajas automáticas, mecánica diésel con diagnóstico y reparación de sistemas DPF/EGR, y potenciación con chip tuning e inyecciones programables.'
    }
]

function Faq(){
    return(
    <section className='faq' id='faq' aria-labelledby='faq-titulo'>
        <div className='row faq__contenido'>
            <div className='col-12 col-lg-5'>
                <span className='textosFaq'>ANTES DE TRAER TU AUTO:<br /></span>
                <h2 id='faq-titulo' className='faq__titulo'>Preguntas Frecuentes</h2>
                <span className='faq__texto'>Si no encontrás lo que buscás, contactanos. Podemos asesorarte, orientándote según el modelo y la falla que tenga tu auto. <br /></span>
                <a href={urlWhatsApp('Hola, quisiera hacer una consulta')} className='textosFaq faq__enlace' target='_blank' rel='noopener noreferrer'>
                    Hacer una consulta ↗<span className='visually-hidden'> (abre WhatsApp)</span>
                </a>
            </div>
            <div className='col-12 col-lg-7 mt-4 mt-lg-0'>
                <div className='accordion accordion-flush' id='faqPreguntas'>
                    {preguntas.map((item, indice) => (
                        <div className='accordion-item' key={item.pregunta}>
                            <h3 className='accordion-header'>
                                <button
                                    className='accordion-button collapsed'
                                    type='button'
                                    data-bs-toggle='collapse'
                                    data-bs-target={`#faq-respuesta-${indice}`}
                                    aria-expanded='false'
                                    aria-controls={`faq-respuesta-${indice}`}
                                >
                                    {item.pregunta}
                                </button>
                            </h3>
                            <div id={`faq-respuesta-${indice}`} className='accordion-collapse collapse' data-bs-parent='#faqPreguntas'>
                                <div className='accordion-body'>{item.respuesta}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
    )
}

export default Faq
