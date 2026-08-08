/**
 * Yolo Hub - Search, filter, and pagination functionality
 * @module YoloHub
 */
(function() {
    'use strict';

    // Configuration
    var DEBOUNCE_DELAY = 150;
    var MAX_VISIBLE_PAGES = 5;

    // State
    var allPosts = [];
    var filteredPosts = [];
    var postsPerPage = 25;
    var currentPage = 1;

    // DOM elements
    var searchInput;
    var postsContainer;
    var noResults;
    var paginationContainer;

    /**
     * Calculate total number of pages
     * @returns {number} Total pages
     */
    function getTotalPages() {
        return Math.ceil(filteredPosts.length / postsPerPage);
    }

    /**
     * Get posts for the current page
     * @returns {Array} Array of post objects
     */
    function getCurrentPosts() {
        var start = (currentPage - 1) * postsPerPage;
        var end = start + postsPerPage;
        return filteredPosts.slice(start, end);
    }

    /**
     * Handle search input and filter posts
     */
    function handleSearch() {
        var query = searchInput.value.toLowerCase().trim();
        YoloUtils.log('Search query: "' + query + '"');

        if (query.length > 0) {
            filteredPosts = allPosts.filter(function(post) {
                var title = (post.title || '').toLowerCase();
                var description = (post.description || '').toLowerCase();
                var tags = (post.tags || []).join(' ').toLowerCase();

                return title.indexOf(query) !== -1 ||
                       description.indexOf(query) !== -1 ||
                       tags.indexOf(query) !== -1;
            });
            YoloUtils.log('Found ' + filteredPosts.length + ' matching posts');
        } else {
            filteredPosts = allPosts.slice();
        }

        currentPage = 1;
        render();
    }

    /**
     * Handle tag click to filter by tag
     * @param {string} tagText - Tag text to filter by
     */
    function handleTagClick(tagText) {
        searchInput.value = tagText;
        handleSearch();
    }

    /**
     * Navigate to a specific page
     * @param {number} page - Page number (1-indexed)
     */
    function goToPage(page) {
        var total = getTotalPages();
        if (page >= 1 && page <= total) {
            YoloUtils.log('Navigating to page ' + page + ' of ' + total);
            currentPage = page;
            render();
            if (postsContainer) {
                postsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    /**
     * Render a single post card
     * @param {Object} post - Post object with title, url, date, description, tags
     * @returns {string} HTML string for the card
     */
    function renderCard(post) {
        var tagsHtml = (post.tags || [])
            .map(function(tag) {
                return '<a href="#" class="yolo-pill hub-tag" data-tag="' + tag + '">#' + tag + '</a>';
            })
            .join('');

        return '<article class="hub-card">' +
            '<div class="hub-card-header">' +
                '<h2 class="hub-card-title">' +
                    '<a href="' + post.url + '">' + post.title + '</a>' +
                '</h2>' +
                '<span class="hub-card-date">' + YoloUtils.formatDate(post.date) + '</span>' +
            '</div>' +
            '<p class="hub-card-description">' + post.description + '</p>' +
            '<div class="hub-card-tags" role="list">' + tagsHtml + '</div>' +
        '</article>';
    }

    /**
     * Render pagination controls with ARIA labels
     * @returns {string} HTML string for pagination
     */
    function renderPagination() {
        var total = getTotalPages();
        if (total <= 1) {
            return '';
        }

        var html = '';

        // Previous button
        var prevDisabled = currentPage === 1 ? 'disabled aria-disabled="true"' : '';
        html += '<button class="hub-page-btn hub-page-prev" ' + prevDisabled +
                ' data-page="' + (currentPage - 1) + '"' +
                ' aria-label="Go to previous page">&laquo; Prev</button>';

        // Page numbers
        var startPage = Math.max(1, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
        var endPage = Math.min(total, startPage + MAX_VISIBLE_PAGES - 1);

        if (endPage - startPage + 1 < MAX_VISIBLE_PAGES) {
            startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
        }

        if (startPage > 1) {
            html += '<button class="hub-page-btn" data-page="1" aria-label="Go to page 1">1</button>';
            if (startPage > 2) {
                html += '<span class="hub-page-ellipsis" aria-hidden="true">...</span>';
            }
        }

        for (var i = startPage; i <= endPage; i++) {
            var active = i === currentPage ? 'active" aria-current="page' : '';
            html += '<button class="hub-page-btn ' + active + '" data-page="' + i +
                    '" aria-label="Go to page ' + i + '">' + i + '</button>';
        }

        if (endPage < total) {
            if (endPage < total - 1) {
                html += '<span class="hub-page-ellipsis" aria-hidden="true">...</span>';
            }
            html += '<button class="hub-page-btn" data-page="' + total +
                    '" aria-label="Go to page ' + total + '">' + total + '</button>';
        }

        // Next button
        var nextDisabled = currentPage === total ? 'disabled aria-disabled="true"' : '';
        html += '<button class="hub-page-btn hub-page-next" ' + nextDisabled +
                ' data-page="' + (currentPage + 1) + '"' +
                ' aria-label="Go to next page">Next &raquo;</button>';

        // Page info
        var start = (currentPage - 1) * postsPerPage + 1;
        var end = Math.min(currentPage * postsPerPage, filteredPosts.length);
        var infoHtml = '<div class="hub-page-info" aria-live="polite">Showing ' +
                       start + '-' + end + ' of ' + filteredPosts.length + '</div>';

        return '<nav class="hub-pagination-controls" role="navigation" aria-label="Pagination">' +
               html + '</nav>' + infoHtml;
    }

    /**
     * Render posts and pagination to the DOM
     */
    function render() {
        var posts = getCurrentPosts();
        YoloUtils.log('Rendering ' + posts.length + ' posts for page ' + currentPage);

        // Render posts
        if (postsContainer) {
            if (posts.length === 0) {
                postsContainer.innerHTML = '';
                if (noResults) {
                    noResults.style.display = 'block';
                }
            } else {
                postsContainer.innerHTML = posts.map(renderCard).join('');
                if (noResults) {
                    noResults.style.display = 'none';
                }
            }
        }

        // Render pagination
        if (paginationContainer) {
            paginationContainer.innerHTML = renderPagination();
        }
    }

    /**
     * Handle keyboard navigation for pagination
     * @param {KeyboardEvent} e - Keyboard event
     */
    function handleKeydown(e) {
        // Only handle when focus is in pagination area
        if (!paginationContainer || !paginationContainer.contains(document.activeElement)) {
            return;
        }

        var total = getTotalPages();

        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            if (currentPage > 1) {
                goToPage(currentPage - 1);
                focusPageButton(currentPage);
            }
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            if (currentPage < total) {
                goToPage(currentPage + 1);
                focusPageButton(currentPage);
            }
        } else if (e.key === 'Home') {
            e.preventDefault();
            goToPage(1);
            focusPageButton(1);
        } else if (e.key === 'End') {
            e.preventDefault();
            goToPage(total);
            focusPageButton(total);
        }
    }

    /**
     * Focus the button for a specific page number
     * @param {number} page - Page number
     */
    function focusPageButton(page) {
        var btn = paginationContainer.querySelector('[data-page="' + page + '"]');
        if (btn) {
            btn.focus();
        }
    }

    /**
     * Initialize the Hub with configuration
     * @param {Object} config - Configuration object
     * @param {Array} config.posts - Array of post objects
     * @param {number} [config.postsPerPage=25] - Posts per page
     */
    function init(config) {
        config = config || {};
        allPosts = config.posts || [];
        postsPerPage = config.postsPerPage || 25;
        filteredPosts = allPosts.slice();
        currentPage = 1;

        YoloUtils.log('Initializing Hub with ' + allPosts.length + ' posts, ' + postsPerPage + ' per page');

        searchInput = document.getElementById('hub-search');
        postsContainer = document.getElementById('hub-posts');
        noResults = document.getElementById('hub-no-results');
        paginationContainer = document.getElementById('hub-pagination');

        // Early return if required elements are missing
        if (!postsContainer) {
            YoloUtils.error('Hub container element not found');
            return;
        }

        // Search functionality with debouncing
        if (searchInput) {
            searchInput.addEventListener('input', YoloUtils.debounce(handleSearch, DEBOUNCE_DELAY));
            searchInput.setAttribute('aria-label', 'Search posts');
        }

        // Event delegation for tag clicks
        postsContainer.addEventListener('click', function(e) {
            var tag = e.target.closest('.hub-tag');
            if (tag) {
                e.preventDefault();
                handleTagClick(tag.dataset.tag);
            }
        });

        // Event delegation for pagination clicks
        if (paginationContainer) {
            paginationContainer.addEventListener('click', function(e) {
                var btn = e.target.closest('.hub-page-btn');
                if (btn && !btn.hasAttribute('disabled')) {
                    var page = parseInt(btn.dataset.page, 10);
                    goToPage(page);
                }
            });

            // Keyboard navigation for pagination
            paginationContainer.addEventListener('keydown', handleKeydown);
        }

        // Initial render
        render();
    }

    /**
     * YoloHub constructor
     * @param {Object} config - Configuration object
     */
    window.YoloHub = function(config) {
        init(config);
    };

})();
