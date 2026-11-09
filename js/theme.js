// Gestionnaire de thème à 2 états (Sombre, Clair)
(function () {
    const modes = ['dark', 'light'];
    const icons = {
        'dark': 'fa-moon',
        'light': 'fa-sun'
    };
    const labels = {
        'dark': 'Sombre',
        'light': 'Clair'
    };

    // Mode 'dark' par défaut si aucun thème n'est encore enregistré
    let currentTheme = localStorage.getItem('app-theme') || 'dark';

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('app-theme', theme);

        const iconElem = document.getElementById('theme-icon');
        const labelElem = document.getElementById('theme-label');

        if (iconElem && labelElem) {
            iconElem.className = `fa-solid ${icons[theme]}`;
            labelElem.textContent = labels[theme];
        }
    }

    // Application immédiate pour éviter les flashs d'affichage
    applyTheme(currentTheme);

    window.addEventListener('DOMContentLoaded', () => {
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            applyTheme(currentTheme);
            toggleBtn.addEventListener('click', () => {
                // Bascule directe entre Sombre et Clair
                currentTheme = (currentTheme === 'dark') ? 'light' : 'dark';
                applyTheme(currentTheme);
            });
        }
    });
})();