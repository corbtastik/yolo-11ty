// ----------------------------------------------------------------------------
// Yolo Hub - Search, filter, and pagination functionality
// ----------------------------------------------------------------------------
(function() {
    'use strict';

    var allPosts = [];
    var filteredPosts = [];
    var postsPerPage = 25;
    var currentPage = 1;

    var searchInput;
    var postsContainer;
    var noResults;
    var paginationContainer;

    function getTotalPages() {
        return Math.ceil(filteredPosts.length / postsPerPage);
    }

    function getCurrentPosts() {
        var start = (currentPage - 1) * postsPerPage;
        var end = start + postsPerPage;
        return filteredPosts.slice(start, end);
    }

    function handleSearch() {
        var query = searchInput.value.toLowerCase().trim();

        if (query.length > 0) {
            filteredPosts = allPosts.filter(function(post) {
                var title = (post.title || '').toLowerCase();
                var description = (post.description || '').toLowerCase();
                var tags = (post.tags || []).join(' ').toLowerCase();

                return title.indexOf(query) !== -1 ||
                       description.indexOf(query) !== -1 ||
                       tags.indexOf(query) !== -1;
            });
        } else {
            filteredPosts = allPosts.slice();
        }

        currentPage = 1;
        render();
    }

    function handleTagClick(tagText) {
        searchInput.value = tagText;
        handleSearch();
    }

    function goToPage(page) {
        var total = getTotalPages();
        if (page >= 1 && page <= total) {
            currentPage = page;
            render();
            if (postsContainer) {
                postsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    function renderCard(post) {
        var tagsHtml = (post.tags || [])
            .map(function(tag) {
                return '<a href="#" class="yolo-pill hub-tag" data-tag="' + tag + '">#' + tag + '</a>';
            })
            .join('');

        return '<div class="hub-card">' +
            '<div class="hub-card-header">' +
                '<h2 class="hub-card-title">' +
                    '<a href="' + post.url + '">' + post.title + '</a>' +
                '</h2>' +
                '<span class="hub-card-date">' + YoloUtils.formatDate(post.date) + '</span>' +
            '</div>' +
            '<p class="hub-card-description">' + post.description + '</p>' +
            '<div class="hub-card-tags">' + tagsHtml + '</div>' +
        '</div>';
    }

    function renderPagination() {
        var total = getTotalPages();
        if (total <= 1) {
            return '';
        }

        var html = '';
        var maxVisible = 5;

        // Previous button
        var prevDisabled = currentPage === 1 ? 'disabled' : '';
        html += '<button class="hub-page-btn hub-page-prev" ' + prevDisabled + ' data-page="' + (currentPage - 1) + '">&laquo; Prev</button>';

        // Page numbers
        var startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        var endPage = Math.min(total, startPage + maxVisible - 1);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        if (startPage > 1) {
            html += '<button class="hub-page-btn" data-page="1">1</button>';
            if (startPage > 2) {
                html += '<span class="hub-page-ellipsis">...</span>';
            }
        }

        for (var i = startPage; i <= endPage; i++) {
            var active = i === currentPage ? 'active' : '';
            html += '<button class="hub-page-btn ' + active + '" data-page="' + i + '">' + i + '</button>';
        }

        if (endPage < total) {
            if (endPage < total - 1) {
                html += '<span class="hub-page-ellipsis">...</span>';
            }
            html += '<button class="hub-page-btn" data-page="' + total + '">' + total + '</button>';
        }

        // Next button
        var nextDisabled = currentPage === total ? 'disabled' : '';
        html += '<button class="hub-page-btn hub-page-next" ' + nextDisabled + ' data-page="' + (currentPage + 1) + '">Next &raquo;</button>';

        // Page info
        var start = (currentPage - 1) * postsPerPage + 1;
        var end = Math.min(currentPage * postsPerPage, filteredPosts.length);
        var infoHtml = '<div class="hub-page-info">Showing ' + start + '-' + end + ' of ' + filteredPosts.length + '</div>';

        return '<div class="hub-pagination-controls">' + html + '</div>' + infoHtml;
    }

    function render() {
        var posts = getCurrentPosts();

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

    function init(config) {
        config = config || {};
        allPosts = config.posts || [];
        postsPerPage = config.postsPerPage || 25;
        filteredPosts = allPosts.slice();
        currentPage = 1;

        searchInput = document.getElementById('hub-search');
        postsContainer = document.getElementById('hub-posts');
        noResults = document.getElementById('hub-no-results');
        paginationContainer = document.getElementById('hub-pagination');

        // Early return if required elements are missing
        if (!postsContainer) {
            return;
        }

        // Search functionality
        if (searchInput) {
            searchInput.addEventListener('input', handleSearch);
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
        }

        // Initial render
        render();
    }

    // Export Hub constructor for backwards compatibility
    window.YoloHub = function(config) {
        init(config);
    };

})();
