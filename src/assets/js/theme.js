/**
 * Theme initialization - runs early (in <head>) to prevent a flash of the
 * wrong theme. Sets the light/dark attribute on <html> before first paint.
 *
 * The toggle button does not exist yet at this point, so its icon is set by
 * yolo.js once the DOM is ready. Click handling also lives in yolo.js.
 */
(function() {
    'use strict';

    var theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute(theme, '');
})();
