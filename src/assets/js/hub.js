// ----------------------------------------------------------------------------
// Yolo Hub - Search and filter functionality
// ----------------------------------------------------------------------------
(function(window) {
  'use strict';

  class Hub {
    constructor() {
      this.searchInput = document.getElementById('hub-search');
      this.cards = document.querySelectorAll('.hub-card');
      this.noResults = document.getElementById('hub-no-results');

      this.init();
    }

    init() {
      // Search functionality
      if (this.searchInput) {
        this.searchInput.addEventListener('input', () => this.filterCards());
      }

      // Tag click filtering
      document.querySelectorAll('.hub-tag').forEach(tag => {
        tag.addEventListener('click', (e) => {
          e.preventDefault();
          const tagText = tag.textContent.replace('#', '');
          this.searchInput.value = tagText;
          this.filterCards();
        });
      });
    }

    filterCards() {
      const query = this.searchInput.value.toLowerCase().trim();
      let visibleCount = 0;

      this.cards.forEach(card => {
        const title = card.querySelector('.hub-card-title')?.textContent.toLowerCase() || '';
        const description = card.querySelector('.hub-card-description')?.textContent.toLowerCase() || '';
        const tags = Array.from(card.querySelectorAll('.hub-tag'))
          .map(t => t.textContent.toLowerCase())
          .join(' ');

        const matches = !query ||
          title.includes(query) ||
          description.includes(query) ||
          tags.includes(query);

        card.style.display = matches ? 'block' : 'none';
        if (matches) visibleCount++;
      });

      // Show/hide no results message
      if (this.noResults) {
        this.noResults.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }
  }

  // Initialize when DOM is ready
  YoloUtils.domReady(function() {
    window.YoloHub = new Hub();
  });

})(window);
