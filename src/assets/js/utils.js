/**
 * Yolo shared utilities
 * @namespace YoloUtils
 */
(function() {
    'use strict';

    var MONTH_NAMES = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    var MONTH_ABBREV = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    window.YoloUtils = {
        /**
         * Execute callback when DOM is ready
         * @param {Function} fn - Callback to execute
         */
        domReady: function(fn) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', fn);
            } else {
                fn();
            }
        },

        /**
         * Format a date string using UTC to avoid timezone issues
         * @param {string|Date} dateStr - Date string or Date object
         * @param {string} [format='MMMM D, YYYY'] - Format string
         *   Supported tokens: YYYY, MMMM, MMM, MM, D, DD
         * @returns {string} Formatted date string
         */
        formatDate: function(dateStr, format) {
            var d = new Date(dateStr);
            format = format || 'MMMM D, YYYY';

            var year = d.getUTCFullYear();
            var month = d.getUTCMonth();
            var day = d.getUTCDate();

            return format
                .replace(/YYYY/g, year)
                .replace(/MMMM/g, MONTH_NAMES[month])
                .replace(/MMM/g, MONTH_ABBREV[month])
                .replace(/MM/g, ('0' + (month + 1)).slice(-2))
                .replace(/DD/g, ('0' + day).slice(-2))
                .replace(/D/g, day);
        },

        /**
         * Create a debounced version of a function
         * @param {Function} fn - Function to debounce
         * @param {number} delay - Delay in milliseconds
         * @returns {Function} Debounced function
         */
        debounce: function(fn, delay) {
            var timeout;
            return function() {
                var context = this;
                var args = arguments;
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    fn.apply(context, args);
                }, delay);
            };
        },

        /**
         * Log a debug message (only when debug mode is enabled)
         * @param {string} message - Message to log
         */
        log: function(message) {
            if (window.YOLO_DEBUG) {
                console.log('[Yolo] ' + message);
            }
        },

        /**
         * Log an error message
         * @param {string} message - Error message to log
         */
        error: function(message) {
            console.error('[Yolo] ' + message);
        }
    };
})();
