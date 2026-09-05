/**
 * Yolo Hub - Search, filter, and pagination with keyboard navigation
 */
(function() {
    'use strict';

    var allPosts = [];
    var filteredPosts = [];
    var postsPerPage = 25;
    var currentPage = 1;
    var isSearching = false;
    var selection;

    var searchInput, postsContainer, noResults, paginationContainer;

    function getCurrentPosts() {
        var info = YoloUtils.paginate(currentPage, filteredPosts.length, postsPerPage);
        return filteredPosts.slice(info.start, info.end);
    }

    function handleSearch() {
        var query = searchInput.value.trim();
        isSearching = query.length > 0;
        filteredPosts = YoloUtils.filterByQuery(allPosts, query, ['title', 'description', 'tags']);
        currentPage = 1;
        render();
        selection.select(isSearching && filteredPosts.length > 0 ? 0 : -1);
    }

    function goToPage(page) {
        var info = YoloUtils.paginate(page, filteredPosts.length, postsPerPage);
        if (page >= 1 && page <= info.totalPages) {
            currentPage = page;
            render();
            selection.reset();
        }
    }

    function navigateToSelected() {
        var posts = getCurrentPosts();
        var index = selection.get();
        if (index >= 0 && index < posts.length) {
            window.location.href = posts[index].url + '?from=hub';
        }
    }

    function handleKeydown(e) {
        if (!isSearching) return;
        if (selection.handleKey(e)) return;

        if (e.key === 'Enter') {
            e.preventDefault();
            navigateToSelected();
        } else if (e.key === 'Escape') {
            searchInput.value = '';
            searchInput.blur();
            isSearching = false;
            filteredPosts = allPosts.slice();
            selection.reset();
            render();
        }
    }

    function renderCard(post, index) {
        var tags = (post.tags || []).map(function(tag) {
            return '<a href="#" class="yolo-pill hub-tag" data-tag="' + tag + '">#' + tag + '</a>';
        }).join('');

        return '<article class="hub-card" data-index="' + index + '">' +
            '<div class="hub-card-header">' +
                '<h2 class="hub-card-title"><a href="' + post.url + '?from=hub">' + post.title + '</a></h2>' +
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

        buttons.push('<button class="hub-page-btn hub-page-nav" data-page="1"' +
            (currentPage > 1 ? '' : ' disabled') + ' aria-label="First page"><span class="material-icons">keyboard_double_arrow_left</span></button>');

        var pages = [1];
        for (var i = currentPage - 1; i <= currentPage + 1; i++) {
            if (i > 1 && i < info.totalPages) pages.push(i);
        }
        if (info.totalPages > 1) pages.push(info.totalPages);
        pages = pages.filter(function(v, i, a) { return a.indexOf(v) === i; }).sort(function(a,b) { return a-b; });

        var lastPage = 0;
        pages.forEach(function(p) {
            if (p - lastPage > 1) buttons.push('<span class="hub-page-ellipsis">...</span>');
            var active = p === currentPage ? ' active" aria-current="page' : '';
            buttons.push('<button class="hub-page-btn' + active + '" data-page="' + p + '">' + p + '</button>');
            lastPage = p;
        });

        buttons.push('<button class="hub-page-btn hub-page-nav" data-page="' + info.totalPages + '"' +
            (currentPage < info.totalPages ? '' : ' disabled') + ' aria-label="Last page"><span class="material-icons">keyboard_double_arrow_right</span></button>');

        return '<nav class="hub-pagination-controls" aria-label="Pagination">' + buttons.join('') + '</nav>' +
            '<div class="hub-page-info">Showing ' + info.showing.from + '-' + info.showing.to +
            ' of ' + info.showing.total + '</div>';
    }

    function render() {
        var posts = getCurrentPosts();

        if (postsContainer) {
            postsContainer.innerHTML = posts.map(function(post, i) {
                return renderCard(post, i);
            }).join('');
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
            searchInput.addEventListener('keydown', handleKeydown);
        }

        selection = YoloUtils.selectionList(function() {
            return postsContainer.querySelectorAll('.hub-card');
        }, { smooth: true });

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

    window.YoloHub = { init: init };
})();
