// ----------------------------------------------------------------------------
// Yolo Hub - Search, filter, and pagination functionality
// ----------------------------------------------------------------------------
(function(window) {
  'use strict';

  class Hub {
    constructor(config = {}) {
      this.allPosts = config.posts || [];
      this.postsPerPage = config.postsPerPage || 25;
      this.currentPage = 1;
      this.filteredPosts = [...this.allPosts];
      this.isSearching = false;

      this.searchInput = document.getElementById('hub-search');
      this.postsContainer = document.getElementById('hub-posts');
      this.noResults = document.getElementById('hub-no-results');
      this.paginationContainer = document.getElementById('hub-pagination');

      this.init();
    }

    init() {
      // Search functionality
      if (this.searchInput) {
        this.searchInput.addEventListener('input', () => this.handleSearch());
      }

      // Event delegation for tag clicks (avoids rebinding on every render)
      if (this.postsContainer) {
        this.postsContainer.addEventListener('click', (e) => {
          const tag = e.target.closest('.hub-tag');
          if (tag) {
            e.preventDefault();
            this.handleTagClick(tag.dataset.tag);
          }
        });
      }

      // Event delegation for pagination clicks (avoids rebinding on every render)
      if (this.paginationContainer) {
        this.paginationContainer.addEventListener('click', (e) => {
          const btn = e.target.closest('.hub-page-btn');
          if (btn && !btn.hasAttribute('disabled')) {
            const page = parseInt(btn.dataset.page, 10);
            this.goToPage(page);
          }
        });
      }

      // Initial render
      this.render();
    }

    handleSearch() {
      const query = this.searchInput.value.toLowerCase().trim();
      this.isSearching = query.length > 0;

      if (this.isSearching) {
        // Filter all posts based on search query
        this.filteredPosts = this.allPosts.filter(post => {
          const title = (post.title || '').toLowerCase();
          const description = (post.description || '').toLowerCase();
          const tags = (post.tags || []).join(' ').toLowerCase();

          return title.includes(query) ||
                 description.includes(query) ||
                 tags.includes(query);
        });
      } else {
        this.filteredPosts = [...this.allPosts];
      }

      this.currentPage = 1;
      this.render();
    }

    handleTagClick(tagText) {
      this.searchInput.value = tagText;
      this.handleSearch();
    }

    get totalPages() {
      return Math.ceil(this.filteredPosts.length / this.postsPerPage);
    }

    get currentPosts() {
      const start = (this.currentPage - 1) * this.postsPerPage;
      const end = start + this.postsPerPage;
      return this.filteredPosts.slice(start, end);
    }

    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.render();
        // Scroll to top of posts
        this.postsContainer?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    formatDate(dateStr) {
      const d = new Date(dateStr);
      const months = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
      return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
    }

    renderCard(post) {
      const tagsHtml = (post.tags || [])
        .map(tag => `<a href="#" class="hub-tag" data-tag="${tag}">#${tag}</a>`)
        .join('');

      return `
        <div class="hub-card">
          <div class="hub-card-header">
            <h2 class="hub-card-title">
              <a href="${post.url}">${post.title}</a>
            </h2>
            <span class="hub-card-date">${this.formatDate(post.date)}</span>
          </div>
          <p class="hub-card-description">${post.description}</p>
          <div class="hub-card-tags">${tagsHtml}</div>
        </div>
      `;
    }

    renderPagination() {
      if (this.totalPages <= 1) {
        return '';
      }

      let pagesHtml = '';

      // Previous button
      const prevDisabled = this.currentPage === 1 ? 'disabled' : '';
      pagesHtml += `<button class="hub-page-btn hub-page-prev" ${prevDisabled} data-page="${this.currentPage - 1}">&laquo; Prev</button>`;

      // Page numbers
      const maxVisible = 5;
      let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
      let endPage = Math.min(this.totalPages, startPage + maxVisible - 1);

      if (endPage - startPage + 1 < maxVisible) {
        startPage = Math.max(1, endPage - maxVisible + 1);
      }

      if (startPage > 1) {
        pagesHtml += `<button class="hub-page-btn" data-page="1">1</button>`;
        if (startPage > 2) {
          pagesHtml += `<span class="hub-page-ellipsis">...</span>`;
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        const active = i === this.currentPage ? 'active' : '';
        pagesHtml += `<button class="hub-page-btn ${active}" data-page="${i}">${i}</button>`;
      }

      if (endPage < this.totalPages) {
        if (endPage < this.totalPages - 1) {
          pagesHtml += `<span class="hub-page-ellipsis">...</span>`;
        }
        pagesHtml += `<button class="hub-page-btn" data-page="${this.totalPages}">${this.totalPages}</button>`;
      }

      // Next button
      const nextDisabled = this.currentPage === this.totalPages ? 'disabled' : '';
      pagesHtml += `<button class="hub-page-btn hub-page-next" ${nextDisabled} data-page="${this.currentPage + 1}">Next &raquo;</button>`;

      // Page info
      const start = (this.currentPage - 1) * this.postsPerPage + 1;
      const end = Math.min(this.currentPage * this.postsPerPage, this.filteredPosts.length);
      const total = this.filteredPosts.length;
      const infoHtml = `<div class="hub-page-info">Showing ${start}-${end} of ${total}</div>`;

      return `<div class="hub-pagination-controls">${pagesHtml}</div>${infoHtml}`;
    }

    render() {
      // Render posts
      if (this.postsContainer) {
        if (this.currentPosts.length === 0) {
          this.postsContainer.innerHTML = '';
          if (this.noResults) {
            this.noResults.style.display = 'block';
          }
        } else {
          this.postsContainer.innerHTML = this.currentPosts.map(post => this.renderCard(post)).join('');
          if (this.noResults) {
            this.noResults.style.display = 'none';
          }
        }
      }

      // Render pagination
      if (this.paginationContainer) {
        this.paginationContainer.innerHTML = this.renderPagination();
      }
    }
  }

  // Export for initialization
  window.YoloHub = Hub;

})(window);
