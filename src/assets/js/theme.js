/**
 * Theme toggle - switch between light and dark mode
 */
(function() {
    'use strict';

    function setTheme(mode) {
        var isDark = mode === 'dark';
        var themeToggle = document.getElementById('theme-toggle');

        localStorage.setItem('theme', mode);
        document.documentElement.removeAttribute(isDark ? 'light' : 'dark');
        document.documentElement.setAttribute(mode, '');

        if (themeToggle) {
            themeToggle.innerText = isDark ? 'light_mode' : 'dark_mode';
        }
    }

    function toggleTheme() {
        var current = localStorage.getItem('theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
    }

    function init() {
        var themeToggle = document.getElementById('theme-toggle');
        var activeTheme = localStorage.getItem('theme') || 'light';

        setTheme(activeTheme);

        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
    }

    YoloUtils.domReady(init);
})();
