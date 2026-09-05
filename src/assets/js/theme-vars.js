/**
 * Yolo theme variables.
 *
 * The single mapping from a theme's twelve source colors - as stored per theme
 * in _data/themes.json - to the full set of CSS custom properties the
 * stylesheets consume.
 *
 * Two consumers share this file:
 *   - the build, via .eleventy.js, which bakes the selected theme into
 *     brand.css
 *   - the browser, via assets/ext/js/theme-sampler.js, which previews any
 *     theme live on the demo pages
 *
 * They are deliberately not allowed to drift. Each used to carry its own copy
 * of this mapping: the build's was complete, the sampler's covered only 34 of
 * the 90 variables, so switching themes in the demo left most syntax
 * colors showing whichever theme had been compiled in.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();          // .eleventy.js
  } else {
    root.YoloThemeVars = factory();      // browser
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Identical for every theme, so not part of the per-theme color data.
  var FONT_FAMILIES = [
    ["font-family-primary", "Space Mono, Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, monospace"],
    ["font-family-secondary", "Montserrat, Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif"],
    ["font-family-monospace", "Source Code Pro, Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, monospace"]
  ];

  // [cssVariableName, sourceColorKey] in emission order. A {light,dark} object
  // instead of a key means a fixed color that differs only by mode.
  var THEME_VARS = [
    ["primary-color", "bg"],
    ["on-primary-color", "text"],
    ["primary-container-color", "surface"],
    ["on-primary-container-color", "heading"],
    ["secondary-color", "heading"],
    ["on-secondary-color", "bg"],
    ["secondary-container-color", "border"],
    ["on-secondary-container-color", "text"],
    ["tertiary-color", "primary"],
    ["on-tertiary-color", "bg"],
    ["link-color", "link"]
  ];

  var SYNTAX_VARS = [
    ["syntax-text", "text"],
    ["syntax-container-color", "surface"],
    ["syntax-highlight-line", "primary"],
    ["syntax-error", {"light":"#b71c1c","dark":"#ff5252"}],
    ["syntax-punctuation", "text"],
    ["syntax-text-whitespace", "text"],
    ["syntax-comment-hashbang", "shComment"],
    ["syntax-comment-multiline", "shComment"],
    ["syntax-comment-preproc", "shComment"],
    ["syntax-comment-preprocfile", "shComment"],
    ["syntax-comment-single", "shComment"],
    ["syntax-comment-special", "shComment"],
    ["syntax-comment", "shComment"],
    ["syntax-generic-deleted", {"light":"#b71c1c","dark":"#ff5252"}],
    ["syntax-generic-emph", "text"],
    ["syntax-generic-error", "text"],
    ["syntax-generic-heading", "text"],
    ["syntax-generic-inserted", "text"],
    ["syntax-generic-output", "text"],
    ["syntax-generic-prompt", "shKeyword"],
    ["syntax-generic-strong", "shKeyword"],
    ["syntax-generic-subheading", "text"],
    ["syntax-generic-traceback", "text"],
    ["syntax-keyword-constant", "shKeyword"],
    ["syntax-keyword-declaration", "shKeyword"],
    ["syntax-keyword-namespace", "shKeyword"],
    ["syntax-keyword-pseudo", "shKeyword"],
    ["syntax-keyword-reserved", "shKeyword"],
    ["syntax-keyword-type", "shKeyword"],
    ["syntax-keyword", "shKeyword"],
    ["syntax-literal-date", "text"],
    ["syntax-literal", "text"],
    ["syntax-name-attribute", "shFunction"],
    ["syntax-name-builtin-pseudo", "text"],
    ["syntax-name-builtin", "shVariable"],
    ["syntax-name-class", "shFunction"],
    ["syntax-name-constant", "text"],
    ["syntax-name-decorator", "text"],
    ["syntax-name-entity", "text"],
    ["syntax-name-exception", "text"],
    ["syntax-name-function-magic", "shFunction"],
    ["syntax-name-function", "shFunction"],
    ["syntax-name-label", "shFunction"],
    ["syntax-name-namespace", "text"],
    ["syntax-name-other", "text"],
    ["syntax-name-property", "shFunction"],
    ["syntax-name-tag", "shKeyword"],
    ["syntax-name-variable-class", "shVariable"],
    ["syntax-name-variable-global", "shVariable"],
    ["syntax-name-variable-instance", "shVariable"],
    ["syntax-name-variable-magic", "shVariable"],
    ["syntax-name-variable", "shVariable"],
    ["syntax-name", "text"],
    ["syntax-number-bin", "shString"],
    ["syntax-number-float", "shString"],
    ["syntax-number-hex", "shString"],
    ["syntax-number-integer-long", "shString"],
    ["syntax-number-integer", "shString"],
    ["syntax-number-oct", "shString"],
    ["syntax-number", "shString"],
    ["syntax-operator-word", "shFunction"],
    ["syntax-operator", "shFunction"],
    ["syntax-string-affix", "shString"],
    ["syntax-string-backtick", "shString"],
    ["syntax-string-char", "shString"],
    ["syntax-string-delimiter", "shString"],
    ["syntax-string-doc", "shString"],
    ["syntax-string-double", "shString"],
    ["syntax-string-escape", "shString"],
    ["syntax-string-heredoc", "shString"],
    ["syntax-string-interpol", "shString"],
    ["syntax-string-other", "shString"],
    ["syntax-string-regex", "shString"],
    ["syntax-string-single", "shString"],
    ["syntax-string-symbol", "shString"],
    ["syntax-string", "shString"]
  ];

  /**
   * Contrasting ink for a swatch background, matching the Sass original:
   * lightness > 50% takes black, anything darker takes white.
   * HSL lightness is (max + min) / 2, so comparing the 0-255 sum against 255
   * is the same test without floating point.
   */
  function onColor(hex) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    return (max + min) > 255 ? '#000' : '#fff';
  }

  function resolve(source, colors, mode) {
    return typeof source === 'string' ? colors[source] : source[mode];
  }

  /**
   * Build the ordered [name, value] pairs for one light/dark mode.
   *
   * themeColors and syntaxColors are the twelve-key objects for that mode.
   * They are separate arguments because settings.brand.theme and
   * settings.brand.syntax may name different themes.
   *
   * Every syntax variable is followed by its -on-color companion, which the
   * demo swatches use for legible labels.
   */
  function cssVars(themeColors, syntaxColors, mode) {
    var out = FONT_FAMILIES.slice();

    THEME_VARS.forEach(function (entry) {
      out.push([entry[0], resolve(entry[1], themeColors, mode)]);
    });

    SYNTAX_VARS.forEach(function (entry) {
      var value = resolve(entry[1], syntaxColors, mode);
      out.push([entry[0], value]);
      out.push([entry[0] + '-on-color', onColor(value)]);
    });

    return out;
  }

  /** Flatten themes.json's groups into { id: theme } for direct lookup. */
  function byId(themesJson) {
    var map = {};
    themesJson.groups.forEach(function (group) {
      group.themes.forEach(function (theme) { map[theme.id] = theme; });
    });
    return map;
  }

  return {
    cssVars: cssVars,
    onColor: onColor,
    byId: byId,
    FONT_FAMILIES: FONT_FAMILIES,
    THEME_VARS: THEME_VARS,
    SYNTAX_VARS: SYNTAX_VARS
  };
}));
