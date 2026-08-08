/**
 * Yolo Hub - Search, filter, and pagination
 */
(function() {
    'use strict';

    var allPosts = [];
    var filteredPosts = [];
    var postsPerPage = 25;
    var currentPage = 1;

    var searchInput, postsContainer, noResults, paginationContainer;

    function handleSearch() {
        var query = searchInput.value;
        filteredPosts = YoloUtils.filterByQuery(allPosts, query, ['title', 'description', 'tags']);
        currentPage = 1;
        render();
    }

    function goToPage(page) {
        var info = YoloUtils.paginate(page, filteredPosts.length, postsPerPage);
        if (page >= 1 && page <= info.totalPages) {
            currentPage = page;
            render();
            postsContainer && postsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function renderCard(post) {
        var tags = (post.tags || []).map(function(tag) {
            return '<a href="#" class="yolo-pill hub-tag" data-tag="' + tag + '">#' + tag + '</a>';
        }).join('');

        return '<article class="hub-card">' +
            '<div class="hub-card-header">' +
                '<h2 class="hub-card-title"><a href="' + post.url + '">' + post.title + '</a></h2>' +
                '<span class="hub-card-date">' + YoloUtils.formatDate(post.date) + '</span>' +
            '</div>' +
            '<p class="hub-card-description">' + post.description + '</p>' +
            '<div class="hub-card-tags">' + tags + '</div>' +
        '</article>';
    }

    function renderPagination() {
        var info = YoloUtils.paginate(currentPage, filteredPosts.length, postsPerPage);
        if (info.totalPages <= 1) return '';

        var buttons = [];

        // Prev
        buttons.push('<button class="hub-page-btn" data-page="' + (currentPage - 1) + '"' +
            (info.hasPrev ? '' : ' disabled') + ' aria-label="Previous">&laquo;</button>');

        // Page numbers (simplified: show first, current±1, last)
        var pages = [1];
        for (var i = currentPage - 1; i <= currentPage + 1; i++) {
            if (i > 1 && i < info.totalPages) pages.push(i);
        }
        if (info.totalPages > 1) pages.push(info.totalPages);

        // Remove duplicates and sort
        pages = pages.filter(function(v, i, a) { return a.indexOf(v) === i; }).sort(function(a,b) { return a-b; });

        var lastPage = 0;
        pages.forEach(function(p) {
            if (p - lastPage > 1) buttons.push('<span class="hub-page-ellipsis">...</span>');
            var active = p === currentPage ? ' active" aria-current="page' : '';
            buttons.push('<button class="hub-page-btn' + active + '" data-page="' + p + '">' + p + '</button>');
            lastPage = p;
        });

        // Next
        buttons.push('<button class="hub-page-btn" data-page="' + (currentPage + 1) + '"' +
            (info.hasNext ? '' : ' disabled') + ' aria-label="Next">&raquo;</button>');

        return '<nav class="hub-pagination-controls" aria-label="Pagination">' + buttons.join('') + '</nav>' +
            '<div class="hub-page-info">Showing ' + info.showing.from + '-' + info.showing.to +
            ' of ' + info.showing.total + '</div>';
    }

    function render() {
        var info = YoloUtils.paginate(currentPage, filteredPosts.length, postsPerPage);
        var posts = filteredPosts.slice(info.start, info.end);

        if (postsContainer) {
            postsContainer.innerHTML = posts.map(renderCard).join('');
            noResults && (noResults.style.display = posts.length ? 'none' : 'block');
        }
        if (paginationContainer) {
            paginationContainer.innerHTML = renderPagination();
        }
    }

    function init(config) {
        allPosts = (config && config.posts) || [];
        postsPerPage = (config && config.postsPerPage) || 25;
        filteredPosts = allPosts.slice();

        searchInput = document.getElementById('hub-search');
        postsContainer = document.getElementById('hub-posts');
        noResults = document.getElementById('hub-no-results');
        paginationContainer = document.getElementById('hub-pagination');

        if (!postsContainer) return;

        if (searchInput) {
            searchInput.addEventListener('input', YoloUtils.debounce(handleSearch, 150));
        }

        postsContainer.addEventListener('click', function(e) {
            var tag = e.target.closest('.hub-tag');
            if (tag) {
                e.preventDefault();
                searchInput.value = tag.dataset.tag;
                handleSearch();
            }
        });

        if (paginationContainer) {
            paginationContainer.addEventListener('click', function(e) {
                var btn = e.target.closest('.hub-page-btn');
                if (btn && !btn.disabled) goToPage(parseInt(btn.dataset.page, 10));
            });
        }

        render();
    }

    window.YoloHub = init;
})();
