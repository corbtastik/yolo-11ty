/**
 * Yolo shared utilities
 */
(function() {
    'use strict';

    var MONTH_NAMES = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    window.YoloUtils = {
        /**
         * Execute callback when DOM is ready
         */
        domReady: function(fn) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', fn);
            } else {
                fn();
            }
        },

        /**
         * Format a date string as "Month D, YYYY" using UTC
         */
        formatDate: function(dateStr) {
            var d = new Date(dateStr);
            return MONTH_NAMES[d.getUTCMonth()] + ' ' + d.getUTCDate() + ', ' + d.getUTCFullYear();
        }
    };
})();
