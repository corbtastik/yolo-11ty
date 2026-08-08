/**
 * Typeahead Search - Filter page sections by query
 */
(function() {
    'use strict';

    var sections = [];
    var searchInput, resultsContainer, pageContent;
    var currentMatches = [];
    var selectedIndex = -1;

    function buildIndex() {
        var h2s = document.querySelectorAll('#page-content h2');
        sections = [];
        h2s.forEach(function(h2) {
            var id = h2.id || h2.textContent.toLowerCase().replace(/\s+/g, '-');
            var title = h2.textContent.trim();
            var preview = '';
            var sibling = h2.nextElementSibling;
            var words = 0;
            while (sibling && sibling.tagName !== 'H2' && sibling.tagName !== 'HR' && words < 50) {
                if (sibling.textContent) {
                    var text = sibling.textContent.trim().split(/\s+/);
                    preview += ' ' + text.slice(0, 50 - words).join(' ');
                    words += text.length;
                }
                sibling = sibling.nextElementSibling;
            }
            sections.push({
                id: id,
                title: title,
                preview: preview.trim(),
                searchText: (title + ' ' + preview).toLowerCase()
            });
        });
    }

    function filter(query) {
        if (!query) return [];
        var terms = query.toLowerCase().split(/\s+/).filter(function(t) { return t; });
        return sections.filter(function(s) {
            return terms.every(function(t) { return s.searchText.indexOf(t) !== -1; });
        });
    }

    function showResults(matches, query) {
        currentMatches = matches;
        selectedIndex = matches.length > 0 ? 0 : -1;

        if (matches.length === 0 && query) {
            resultsContainer.innerHTML = '<div class="search-no-results">No matching sections</div>';
            resultsContainer.classList.add('visible');
            pageContent.style.display = 'none';
            return;
        }
        if (matches.length === 0) { hideResults(); return; }

        var html = matches.map(function(s, i) {
            var title = YoloUtils.highlightText(s.title, query);
            var preview = s.preview.length > 120 ? s.preview.substring(0, 120) + '...' : s.preview;
            preview = YoloUtils.highlightText(preview, query);
            return '<div class="search-result-item' + (i === 0 ? ' selected' : '') + '" data-id="' + s.id + '">' +
                '<div class="search-result-title">' + title + '</div>' +
                '<div class="search-result-preview">' + preview + '</div></div>';
        }).join('');

        resultsContainer.innerHTML = html;
        resultsContainer.classList.add('visible');
        pageContent.style.display = 'none';
    }

    function hideResults() {
        resultsContainer.innerHTML = '';
        resultsContainer.classList.remove('visible');
        pageContent.style.display = '';
        currentMatches = [];
        selectedIndex = -1;
    }

    function navigate(id) {
        searchInput.value = '';
        hideResults();
        setTimeout(function() {
            var el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }

    function updateSelection() {
        var items = resultsContainer.querySelectorAll('.search-result-item');
        items.forEach(function(item, i) {
            item.classList.toggle('selected', i === selectedIndex);
            if (i === selectedIndex) item.scrollIntoView({ block: 'nearest' });
        });
    }

    function init() {
        searchInput = document.getElementById('search-input');
        resultsContainer = document.getElementById('search-results-container');
        pageContent = document.getElementById('page-content');
        if (!searchInput || !resultsContainer || !pageContent) return;

        buildIndex();

        searchInput.addEventListener('input', function(e) {
            var q = e.target.value.trim();
            if (!q) { hideResults(); return; }
            showResults(filter(q), q);
        });

        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') { searchInput.value = ''; searchInput.blur(); hideResults(); }
            else if (e.key === 'ArrowDown' && currentMatches.length) {
                e.preventDefault();
                selectedIndex = (selectedIndex + 1) % currentMatches.length;
                updateSelection();
            }
            else if (e.key === 'ArrowUp' && currentMatches.length) {
                e.preventDefault();
                selectedIndex = selectedIndex <= 0 ? currentMatches.length - 1 : selectedIndex - 1;
                updateSelection();
            }
            else if (e.key === 'Enter' && currentMatches.length && selectedIndex >= 0) {
                e.preventDefault();
                navigate(currentMatches[selectedIndex].id);
            }
        });

        resultsContainer.addEventListener('click', function(e) {
            var item = e.target.closest('.search-result-item');
            if (item) navigate(item.dataset.id);
        });
    }

    YoloUtils.domReady(init);
})();
