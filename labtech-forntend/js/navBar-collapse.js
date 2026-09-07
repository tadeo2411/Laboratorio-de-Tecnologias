const btnMenu = document.getElementById('btnMenu');
const menuNavegacion = document.getElementById('menuNavegacion');

if (btnMenu && menuNavegacion) {
    const actualizarBoton = (estaAbierto) => {
        btnMenu.textContent = estaAbierto ? 'Cerrar' : 'Menú';
        btnMenu.setAttribute('aria-expanded', String(estaAbierto));
    };

    actualizarBoton(false);

    btnMenu.addEventListener('click', () => {
        actualizarBoton(menuNavegacion.classList.toggle('mostrar'));
    });

    menuNavegacion.querySelectorAll('a').forEach((enlace) => {
        enlace.addEventListener('click', () => {
            menuNavegacion.classList.remove('mostrar');
            actualizarBoton(false);
        });
    });
}
