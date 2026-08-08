/**
 * Yolo Hub - Search, filter, and pagination with keyboard navigation
 */
(function() {
    'use strict';

    var allPosts = [];
    var filteredPosts = [];
    var postsPerPage = 25;
    var currentPage = 1;
    var selectedIndex = -1;
    var isSearching = false;

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
        selectedIndex = isSearching && filteredPosts.length > 0 ? 0 : -1;
        render();
    }

    function goToPage(page) {
        var info = YoloUtils.paginate(page, filteredPosts.length, postsPerPage);
        if (page >= 1 && page <= info.totalPages) {
            currentPage = page;
            selectedIndex = -1;
            render();
            postsContainer && postsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function updateSelection() {
        var cards = postsContainer.querySelectorAll('.hub-card');
        cards.forEach(function(card, i) {
            if (i === selectedIndex) {
                card.classList.add('selected');
                card.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else {
                card.classList.remove('selected');
            }
        });
    }

    function navigateToSelected() {
        var posts = getCurrentPosts();
        if (selectedIndex >= 0 && selectedIndex < posts.length) {
            window.location.href = posts[selectedIndex].url + '?from=hub';
        }
    }

    function handleKeydown(e) {
        if (!isSearching) return;

        var posts = getCurrentPosts();
        if (posts.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % posts.length;
            updateSelection();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = selectedIndex <= 0 ? posts.length - 1 : selectedIndex - 1;
            updateSelection();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            navigateToSelected();
        } else if (e.key === 'Escape') {
            searchInput.value = '';
            searchInput.blur();
            isSearching = false;
            selectedIndex = -1;
            filteredPosts = allPosts.slice();
            render();
        }
    }

    function renderCard(post, index) {
        var tags = (post.tags || []).map(function(tag) {
            return '<a href="#" class="yolo-pill hub-tag" data-tag="' + tag + '">#' + tag + '</a>';
        }).join('');

        var selectedClass = index === selectedIndex ? ' selected' : '';

        return '<article class="hub-card' + selectedClass + '" data-index="' + index + '">' +
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

        buttons.push('<button class="hub-page-btn" data-page="' + (currentPage - 1) + '"' +
            (info.hasPrev ? '' : ' disabled') + ' aria-label="Previous">&laquo;</button>');

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

        buttons.push('<button class="hub-page-btn" data-page="' + (currentPage + 1) + '"' +
            (info.hasNext ? '' : ' disabled') + ' aria-label="Next">&raquo;</button>');

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

    window.YoloHub = function(config) { init(config); };
})();
