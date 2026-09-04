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

    var DATE_TOKENS = /YYYY|MMMM|MMM|MM|DD|D/g;

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
         * @returns {string} Formatted date string
         */
        formatDate: function(dateStr, format) {
            var d = new Date(dateStr);
            format = format || 'MMMM D, YYYY';

            var month = d.getUTCMonth();
            var day = d.getUTCDate();
            var values = {
                YYYY: d.getUTCFullYear(),
                MMMM: MONTH_NAMES[month],
                MMM: MONTH_ABBREV[month],
                MM: ('0' + (month + 1)).slice(-2),
                DD: ('0' + day).slice(-2),
                D: day
            };

            // Single pass - chained replaces corrupt month names that contain a
            // format character, e.g. MMMM -> "December" then /D/g -> "15ecember".
            return format.replace(DATE_TOKENS, function(token) { return values[token]; });
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
         * Filter items by search query matching multiple fields
         * @param {Array} items - Array of objects to filter
         * @param {string} query - Search query
         * @param {Array} fields - Field names to search in
         * @returns {Array} Filtered items
         */
        filterByQuery: function(items, query, fields) {
            if (!query || !query.trim()) return items.slice();

            var lowerQuery = query.toLowerCase().trim();
            return items.filter(function(item) {
                return fields.some(function(field) {
                    var value = item[field];
                    if (Array.isArray(value)) value = value.join(' ');
                    return (value || '').toLowerCase().indexOf(lowerQuery) !== -1;
                });
            });
        },

        /**
         * Highlight matching text with <mark> tags
         * @param {string} text - Text to highlight
         * @param {string} query - Search query
         * @returns {string} Text with highlights
         */
        highlightText: function(text, query) {
            if (!query || !text) return text;
            var terms = query.toLowerCase().split(/\s+/).filter(function(t) { return t.length > 0; });
            var result = text;
            terms.forEach(function(term) {
                var regex = new RegExp('(' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
                result = result.replace(regex, '<mark>$1</mark>');
            });
            return result;
        },

        /**
         * Generate pagination info
         * @param {number} currentPage - Current page (1-indexed)
         * @param {number} totalItems - Total number of items
         * @param {number} perPage - Items per page
         * @returns {Object} Pagination info
         */
        paginate: function(currentPage, totalItems, perPage) {
            var totalPages = Math.ceil(totalItems / perPage);
            var start = (currentPage - 1) * perPage;
            return {
                totalPages: totalPages,
                start: start,
                end: Math.min(start + perPage, totalItems),
                hasPrev: currentPage > 1,
                hasNext: currentPage < totalPages,
                showing: {
                    from: totalItems > 0 ? start + 1 : 0,
                    to: Math.min(start + perPage, totalItems),
                    total: totalItems
                }
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
