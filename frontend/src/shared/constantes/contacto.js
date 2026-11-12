export const TELEFONO = '+54 9 2664 34-4135'
export const WHATSAPP = '5492664344135'
export const MAIL = 'leoaromataris@gmail.com'
export const DIRECCION = 'Tobar García 1155, San Luis'

export function urlWhatsApp(texto) {
    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`
}
