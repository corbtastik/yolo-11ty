// Typeahead Search - Replaces page content with filtered results
(function() {
    'use strict';

    var sections = [];
    var searchInput;
    var searchResultsContainer;
    var pageContent;
    var currentMatches = [];
    var selectedIndex = -1;

    // Build searchable section index from H2 elements
    function buildSectionIndex() {
        var h2Elements = document.querySelectorAll('#page-content h2');
        sections = [];

        h2Elements.forEach(function(h2) {
            var id = h2.id || h2.textContent.toLowerCase().replace(/\s+/g, '-');
            var title = h2.textContent.trim();

            // Get content preview (next few elements until next h2 or hr)
            var preview = '';
            var sibling = h2.nextElementSibling;
            var wordCount = 0;
            var maxWords = 50;

            while (sibling && sibling.tagName !== 'H2' && sibling.tagName !== 'HR' && wordCount < maxWords) {
                if (sibling.textContent) {
                    var text = sibling.textContent.trim();
                    var words = text.split(/\s+/);
                    preview += ' ' + words.slice(0, maxWords - wordCount).join(' ');
                    wordCount += words.length;
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

    // Filter sections based on query
    function filterSections(query) {
        if (!query || query.length < 1) {
            return [];
        }

        var lowerQuery = query.toLowerCase();
        var terms = lowerQuery.split(/\s+/).filter(function(t) { return t.length > 0; });

        return sections.filter(function(section) {
            return terms.every(function(term) {
                return section.searchText.includes(term);
            });
        });
    }

    // Highlight matching text
    function highlightMatch(text, query) {
        if (!query) return text;

        var terms = query.toLowerCase().split(/\s+/).filter(function(t) { return t.length > 0; });
        var result = text;

        terms.forEach(function(term) {
            var regex = new RegExp('(' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
            result = result.replace(regex, '<mark>$1</mark>');
        });

        return result;
    }

    // Update visual selection
    function updateSelection() {
        var items = searchResultsContainer.querySelectorAll('.search-result-item');
        items.forEach(function(item, index) {
            if (index === selectedIndex) {
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else {
                item.classList.remove('selected');
            }
        });
    }

    // Show search results, hide page content
    function showResults(matches, query) {
        currentMatches = matches;
        selectedIndex = matches.length > 0 ? 0 : -1;

        if (matches.length === 0 && query && query.length > 0) {
            searchResultsContainer.innerHTML = '<div class="search-no-results">No matching sections</div>';
            searchResultsContainer.classList.add('visible');
            pageContent.style.display = 'none';
            return;
        }

        if (matches.length === 0) {
            hideResults();
            return;
        }

        var html = matches.map(function(section, index) {
            var highlightedTitle = highlightMatch(section.title, query);
            var previewText = section.preview.length > 120
                ? section.preview.substring(0, 120) + '...'
                : section.preview;
            var highlightedPreview = highlightMatch(previewText, query);
            var selectedClass = index === 0 ? ' selected' : '';

            return '<div class="search-result-item' + selectedClass + '" data-section-id="' + section.id + '" data-index="' + index + '">' +
                '<div class="search-result-title">' + highlightedTitle + '</div>' +
                '<div class="search-result-preview">' + highlightedPreview + '</div>' +
                '</div>';
        }).join('');

        searchResultsContainer.innerHTML = html;
        searchResultsContainer.classList.add('visible');
        pageContent.style.display = 'none';
    }

    // Hide results, show page content
    function hideResults() {
        searchResultsContainer.innerHTML = '';
        searchResultsContainer.classList.remove('visible');
        pageContent.style.display = '';
        currentMatches = [];
        selectedIndex = -1;
    }

    // Navigate to a section
    function navigateToSection(sectionId) {
        searchInput.value = '';
        hideResults();

        setTimeout(function() {
            var element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 50);
    }

    // Handle input changes
    function handleInput(e) {
        var query = e.target.value.trim();

        if (query.length === 0) {
            hideResults();
            return;
        }

        var matches = filterSections(query);
        showResults(matches, query);
    }

    // Handle result click
    function handleResultClick(e) {
        var item = e.target.closest('.search-result-item');
        if (item) {
            var sectionId = item.dataset.sectionId;
            navigateToSection(sectionId);
        }
    }

    // Handle keyboard navigation
    function handleKeydown(e) {
        if (e.key === 'Escape') {
            searchInput.value = '';
            searchInput.blur();
            hideResults();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (currentMatches.length > 0) {
                selectedIndex = (selectedIndex + 1) % currentMatches.length;
                updateSelection();
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (currentMatches.length > 0) {
                selectedIndex = selectedIndex <= 0 ? currentMatches.length - 1 : selectedIndex - 1;
                updateSelection();
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (currentMatches.length > 0 && selectedIndex >= 0) {
                navigateToSection(currentMatches[selectedIndex].id);
            }
        }
    }

    // Initialize search
    function init() {
        searchInput = document.getElementById('search-input');
        searchResultsContainer = document.getElementById('search-results-container');
        pageContent = document.getElementById('page-content');

        if (!searchInput || !searchResultsContainer || !pageContent) return;

        buildSectionIndex();

        searchInput.addEventListener('input', handleInput);
        searchInput.addEventListener('keydown', handleKeydown);
        searchResultsContainer.addEventListener('click', handleResultClick);
    }

    YoloUtils.domReady(init);
})();
