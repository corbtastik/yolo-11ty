/**
 * Theme Sampler - live theme switching for the Yolo demo pages.
 *
 * Applies a theme from themes.json by setting CSS custom properties on <html>,
 * which override the theme compiled into brand.css. The variable set comes
 * from YoloThemeVars (assets/js/theme-vars.js) - the same mapping the build
 * uses - so a preview is a complete swap rather than an approximation.
 */
(function() {
    'use strict';

    var STORAGE_KEY = 'yolo-sampler-theme';

    var themes = null;
    var applied = [];   // variables we have set, so they can be cleared

    /** The light/dark mode currently rendered, per the attribute theme.js sets. */
    function currentMode() {
        return document.documentElement.getAttribute('dark') !== null ? 'dark' : 'light';
    }

    function applyTheme(id) {
        var theme = themes && themes[id];
        if (!theme) {
            YoloUtils.error('Unknown theme: ' + id);
            return;
        }

        var mode = currentMode();
        var root = document.documentElement;

        // A theme supplies both the site colors and the syntax colors here;
        // the build keeps them separate so a site can mix two themes.
        var vars = YoloThemeVars.cssVars(theme[mode], theme[mode], mode);

        applied = vars.map(function(pair) {
            root.style.setProperty('--' + pair[0], pair[1]);
            return pair[0];
        });

        document.querySelectorAll('.theme-pill').forEach(function(pill) {
            pill.classList.toggle('active', pill.dataset.theme === id);
        });

        localStorage.setItem(STORAGE_KEY, id);
        YoloUtils.log('sampler applied ' + id + ' (' + mode + ', ' + vars.length + ' variables)');
    }

    /** Drop the overrides, revealing the theme compiled into brand.css. */
    function clearTheme() {
        var root = document.documentElement;
        applied.forEach(function(name) { root.style.removeProperty('--' + name); });
        applied = [];
        document.querySelectorAll('.theme-pill').forEach(function(pill) {
            pill.classList.remove('active');
        });
        localStorage.removeItem(STORAGE_KEY);
    }

    function loadThemes() {
        return fetch('/themes.json')
            .then(function(response) {
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return response.json();
            })
            .then(function(data) {
                themes = YoloThemeVars.byId(data);
            });
    }

    function init() {
        if (!document.querySelector('.theme-pill')) return;

        loadThemes().then(function() {
            document.addEventListener('click', function(e) {
                var pill = e.target.closest('.theme-pill');
                if (!pill) return;
                // Clicking the active pill returns to the site's own theme.
                if (pill.classList.contains('active')) clearTheme();
                else applyTheme(pill.dataset.theme);
            });

            // Light/dark is a separate axis - re-apply in the new mode.
            document.addEventListener('yolo:themechange', function() {
                var saved = localStorage.getItem(STORAGE_KEY);
                if (saved) applyTheme(saved);
            });

            var saved = localStorage.getItem(STORAGE_KEY);
            if (saved && themes[saved]) applyTheme(saved);
        }).catch(function(error) {
            YoloUtils.error('Could not load themes.json: ' + error.message);
        });
    }

    YoloUtils.domReady(init);
})();
