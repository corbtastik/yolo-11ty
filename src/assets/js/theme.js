/**
 * Theme initialization - runs early to prevent flash of wrong theme
 * Click handler is in yolo.js
 */
(function() {
    'use strict';

    var theme = localStorage.getItem('theme') || 'light';
    var toggle = document.getElementById('theme-toggle');

    document.documentElement.setAttribute(theme, '');
    if (toggle) {
        toggle.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
    }
})();
