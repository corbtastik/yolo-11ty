// Theme Sampler - Dynamic theme switching for Yolo demo
(function() {
    'use strict';

    var themes = null;
    var themesLoaded = false;

    // CSS variable mapping - maps theme color keys to CSS custom properties
    var cssVarMap = {
        // Site theme variables
        'bg': '--primary-color',
        'text': '--on-primary-color',
        'heading': '--secondary-color',
        'surface': '--primary-container-color',
        'border': '--secondary-container-color',
        'primary': '--tertiary-color',
        'link': '--link-color'
    };

    // Derived mappings (use same source color)
    var derivedVarMap = {
        '--on-secondary-color': 'bg',
        '--on-tertiary-color': 'bg',
        '--on-primary-container-color': 'heading',
        '--on-secondary-container-color': 'text'
    };

    // Syntax theme variable mapping
    var syntaxVarMap = {
        'surface': '--syntax-container-color',
        'text': '--syntax-text',
        'shKeyword': '--syntax-keyword',
        'shString': '--syntax-string',
        'shFunction': '--syntax-name-function',
        'shVariable': '--syntax-name-variable',
        'shComment': '--syntax-comment'
    };

    // Extended syntax mappings (same source)
    var syntaxExtendedMap = {
        '--syntax-keyword-constant': 'shKeyword',
        '--syntax-keyword-declaration': 'shKeyword',
        '--syntax-keyword-namespace': 'shKeyword',
        '--syntax-keyword-pseudo': 'shKeyword',
        '--syntax-keyword-reserved': 'shKeyword',
        '--syntax-keyword-type': 'shKeyword',
        '--syntax-name-tag': 'shKeyword',
        '--syntax-string-single': 'shString',
        '--syntax-string-double': 'shString',
        '--syntax-string-backtick': 'shString',
        '--syntax-string-other': 'shString',
        '--syntax-name-class': 'shFunction',
        '--syntax-name-attribute': 'shFunction',
        '--syntax-name-builtin': 'shVariable',
        '--syntax-comment-single': 'shComment',
        '--syntax-comment-multiline': 'shComment'
    };

    // Detect current mode (light/dark)
    function getCurrentMode() {
        var stored = localStorage.getItem('theme');
        return stored === 'dark' ? 'dark' : 'light';
    }

    // Get current sampler theme
    function getCurrentSamplerTheme() {
        return localStorage.getItem('yolo-sampler-theme');
    }

    // Apply theme colors to CSS variables using loop-based approach
    function applyTheme(themeName) {
        if (!themes || !themes[themeName]) {
            console.error('Theme not found:', themeName);
            return;
        }

        var theme = themes[themeName];
        var mode = getCurrentMode();
        var colors = theme[mode];
        var root = document.documentElement;

        // Apply primary CSS variables
        Object.keys(cssVarMap).forEach(function(colorKey) {
            root.style.setProperty(cssVarMap[colorKey], colors[colorKey]);
        });

        // Apply derived variables
        Object.keys(derivedVarMap).forEach(function(cssVar) {
            root.style.setProperty(cssVar, colors[derivedVarMap[cssVar]]);
        });

        // Apply syntax variables
        Object.keys(syntaxVarMap).forEach(function(colorKey) {
            root.style.setProperty(syntaxVarMap[colorKey], colors[colorKey]);
        });

        // Apply extended syntax variables
        Object.keys(syntaxExtendedMap).forEach(function(cssVar) {
            root.style.setProperty(cssVar, colors[syntaxExtendedMap[cssVar]]);
        });

        // Update active pill styling
        document.querySelectorAll('.theme-pill').forEach(function(pill) {
            pill.classList.remove('active');
            if (pill.dataset.theme === themeName) {
                pill.classList.add('active');
            }
        });

        // Store the selected theme
        localStorage.setItem('yolo-sampler-theme', themeName);
    }

    // Load themes from JSON
    function loadThemes(callback) {
        if (themesLoaded) {
            callback();
            return;
        }

        fetch('/themes.json')
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Failed to load themes');
                }
                return response.json();
            })
            .then(function(data) {
                // Convert grouped format to flat object
                themes = {};
                data.groups.forEach(function(group) {
                    group.themes.forEach(function(theme) {
                        themes[theme.id] = {
                            dark: theme.dark,
                            light: theme.light
                        };
                    });
                });
                themesLoaded = true;
                callback();
            })
            .catch(function(error) {
                console.error('Error loading themes:', error);
            });
    }

    // Initialize theme sampler
    function init() {
        loadThemes(function() {
            // Add click listeners to theme pills
            document.querySelectorAll('.theme-pill').forEach(function(pill) {
                pill.addEventListener('click', function() {
                    var themeName = this.dataset.theme;
                    applyTheme(themeName);
                });
            });

            // Listen for light/dark toggle clicks to re-apply sampler theme
            var themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                themeToggle.addEventListener('click', function() {
                    // Small delay to let theme.js update localStorage first
                    setTimeout(function() {
                        var samplerTheme = getCurrentSamplerTheme();
                        if (samplerTheme && themes[samplerTheme]) {
                            applyTheme(samplerTheme);
                        }
                    }, 50);
                });
            }

            // Apply saved theme if exists
            var savedTheme = localStorage.getItem('yolo-sampler-theme');
            if (savedTheme && themes[savedTheme]) {
                applyTheme(savedTheme);
            }
        });
    }

    YoloUtils.domReady(init);
})();
