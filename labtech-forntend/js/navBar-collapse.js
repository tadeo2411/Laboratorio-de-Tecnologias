    const btnMenu = document.getElementById('btnMenu');
    const menuNavegacion = document.getElementById('menuNavegacion');

    // Cuando el usuario haga clic en el botón, alternamos la clase "mostrar"
    btnMenu.addEventListener('click', function() {
        menuNavegacion.classList.toggle('mostrar');
    });
