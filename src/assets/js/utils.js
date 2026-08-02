/**
 * Yolo shared utilities
 */
(function() {
    'use strict';

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
        }
    };
})();
