    const btnMenu = document.getElementById('btnMenu');
    const menuNavegacion = document.getElementById('menuNavegacion');
    btnMenu.textContent = '↓ Menú';
    // Cuando el usuario haga clic en el botón, alternamos la clase "mostrar"
    btnMenu.addEventListener('click', function() {
        const estaAbierto = menuNavegacion.classList.toggle('mostrar');

        if (estaAbierto) {
            btnMenu.textContent = '↑ Cerrar';
        } else {
            btnMenu.textContent = '↓ Menú';
        }
    });

    
 

    
