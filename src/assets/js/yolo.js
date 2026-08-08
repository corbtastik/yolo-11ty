/**
 * Yolo Javascript - galleries, theme, sidebar, TOC, tabs, tables
 */
(function(window) {
    'use strict';

    // Wrap index for circular navigation
    function wrapIndex(index, total) {
        if (index >= total) return 0;
        if (index < 0) return total - 1;
        return index;
    }

    // ------------------------------------------------------------------------
    // ImageGrid - click to expand images in a grid
    // ------------------------------------------------------------------------
    function ImageGrid(name) {
        this.name = name;
        this.isOpen = false;
        this.currentIndex = 0;
        this.totalItems = 0;
    }

    ImageGrid.prototype = {
        getGrid: function() { return document.getElementById("ig-" + this.name); },
        getTarget: function() { return document.getElementById("ig-target-" + this.name); },
        getImages: function() { return this.getTarget().getElementsByTagName('img'); },
        getCaption: function(i) { return document.getElementById(this.name + "-caption-" + i); },

        open: function(index) {
            this.getGrid().style.display = "none";
            var target = this.getTarget();
            var images = this.getImages();
            this.totalItems = images.length;
            this.currentIndex = index;
            this._showOnly(index);
            target.classList.remove("no-display");
            target.style.display = "block";
            this.isOpen = true;
        },

        close: function() {
            var target = this.getTarget();
            this._showOnly(-1);
            target.style.display = "none";
            target.classList.add("no-display");
            this.getGrid().style.display = "block";
            this.isOpen = false;
        },

        next: function() { this.show(this.currentIndex + 1); },
        prev: function() { this.show(this.currentIndex - 1); },

        show: function(index) {
            this.currentIndex = wrapIndex(index, this.totalItems);
            this._showOnly(this.currentIndex);
        },

        _showOnly: function(index) {
            var images = this.getImages();
            for (var i = 0; i < images.length; i++) {
                var show = (i === index);
                images[i].style.display = show ? "block" : "none";
                var cap = this.getCaption(i);
                if (cap) cap.style.display = show ? "block" : "none";
            }
        }
    };

    // ------------------------------------------------------------------------
    // Lightbox - modal image viewer
    // ------------------------------------------------------------------------
    function Lightbox(name) {
        this.name = name;
        this.isOpen = false;
        this.currentIndex = 0;
        this.totalItems = 0;
        var slides = this.getSlides();
        this.totalItems = slides.length;
        if (this.totalItems > 0) this.show(0);
    }

    Lightbox.prototype = {
        getModal: function() { return document.getElementById("lb-modal-" + this.name); },
        getSlides: function() { return this.getModal().getElementsByClassName("lb-slides"); },
        getCaption: function() { return document.getElementById("lb-caption-" + this.name); },

        open: function(index) {
            this.getModal().style.display = "block";
            this.isOpen = true;
            this.show(index || 0);
        },

        close: function() {
            this.getModal().style.display = "none";
            this.isOpen = false;
        },

        next: function() { this.show(this.currentIndex + 1); },
        prev: function() { this.show(this.currentIndex - 1); },

        show: function(index) {
            this.currentIndex = wrapIndex(index, this.totalItems);
            var slides = this.getSlides();
            var caption = this.getCaption();
            for (var i = 0; i < slides.length; i++) {
                slides[i].style.display = (i === this.currentIndex) ? "block" : "none";
            }
            if (caption && slides[this.currentIndex] && slides[this.currentIndex].children[0]) {
                caption.innerHTML = slides[this.currentIndex].children[0].alt || '';
            }
        }
    };

    // ------------------------------------------------------------------------
    // Table of Contents
    // ------------------------------------------------------------------------
    function buildToc(maxDepth) {
        maxDepth = maxDepth || 5;
        var tags = ["h2", "h3", "h4", "h5", "h6"].slice(0, maxDepth);
        var elements = document.querySelectorAll(tags.join(","));
        var headers = [];

        elements.forEach(function(el) {
            if (!el.classList.contains("no-toc")) {
                var text = el.innerText;
                var id = text.toLowerCase().split(" ").join("-");
                el.setAttribute("id", id);
                headers.push({ id: id, text: text, level: tags.indexOf(el.tagName.toLowerCase()) });
            }
        });

        return buildTocTree(headers);
    }

    function buildTocTree(headers) {
        if (headers.length === 0) return "";
        var list = [], nextLevel = [], lastLevel = -1;

        headers.forEach(function(h) {
            if (lastLevel !== -1 && lastLevel < h.level) {
                nextLevel.push(h);
                return;
            }
            if (nextLevel.length > 0) list[list.length - 1] += buildTocTree(nextLevel);
            lastLevel = h.level;
            list.push('<a href="#' + h.id + '">' + h.text + '</a>');
            nextLevel = [];
        });
        if (nextLevel.length > 0) list[list.length - 1] += buildTocTree(nextLevel);

        return '<ul>' + list.map(function(i) { return '<li>' + i + '</li>'; }).join('') + '</ul>';
    }

    // ------------------------------------------------------------------------
    // Yolo main controller
    // ------------------------------------------------------------------------
    function Yolo() {
        this.galleries = {};
    }

    Yolo.prototype = {
        getGallery: function(type, name) {
            var key = type + ":" + name;
            if (!this.galleries[key]) {
                this.galleries[key] = (type === "ig") ? new ImageGrid(name) : new Lightbox(name);
            }
            return this.galleries[key];
        },

        init: function() {
            var self = this;

            // Gallery click delegation
            document.addEventListener('click', function(e) {
                var target = e.target.closest('[data-gallery]');
                if (!target) return;
                var d = target.dataset;
                if (!d.gallery || !d.action) return;
                var g = self.getGallery(d.galleryType, d.gallery);
                if (d.action === 'open') g.open(parseInt(d.index, 10) || 0);
                else if (d.action === 'close') g.close();
                else if (d.action === 'next') g.next();
                else if (d.action === 'prev') g.prev();
            });

            // Gallery keyboard navigation
            document.addEventListener('keydown', function(e) {
                for (var key in self.galleries) {
                    var g = self.galleries[key];
                    if (g.isOpen) {
                        if (e.key === "ArrowLeft") { g.prev(); e.preventDefault(); }
                        else if (e.key === "ArrowRight") { g.next(); e.preventDefault(); }
                        else if (e.key === "Escape") { g.close(); e.preventDefault(); }
                        break;
                    }
                }
            });

            // Theme toggle
            var toggle = document.getElementById('theme-toggle');
            if (toggle) {
                toggle.addEventListener('click', function(e) {
                    e.stopPropagation();
                    var root = document.documentElement;
                    var isLight = root.getAttribute('light') !== null;
                    var newMode = isLight ? 'dark' : 'light';
                    root.removeAttribute(isLight ? 'light' : 'dark');
                    root.setAttribute(newMode, '');
                    localStorage.setItem('theme', newMode);
                    toggle.textContent = newMode === 'dark' ? 'light_mode' : 'dark_mode';
                });
            }

            // Sidebar toggle
            var sidebar = document.getElementById('sidebar');
            var sidebarToggle = document.getElementById('sidebar-toggle');
            if (sidebar && sidebarToggle) {
                sidebarToggle.addEventListener('click', function(e) {
                    e.stopPropagation();
                    var hidden = document.body.classList.toggle("sidebar-hidden");
                    sidebarToggle.textContent = hidden ? "menu_open" : "menu";
                });
            }

            // Table of contents
            var toc = document.getElementById("toc");
            var tocSidebar = document.getElementById("toc-sidebar");
            if (toc) { toc.classList.add("nav-menu"); toc.innerHTML = buildToc(); }
            if (tocSidebar) { tocSidebar.classList.add("nav-menu"); tocSidebar.innerHTML = buildToc(3); }

            // Tabs
            document.querySelectorAll('.yolo-tab-button').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var tabEl = document.getElementById(btn.dataset.openTab);
                    if (!tabEl) return;
                    if (btn.classList.contains("active")) {
                        btn.classList.remove("active");
                        tabEl.style.display = "none";
                    } else {
                        document.querySelectorAll(".yolo-tab-content").forEach(function(el) { el.style.display = "none"; });
                        document.querySelectorAll(".yolo-tab-links").forEach(function(el) { el.classList.remove("active"); });
                        tabEl.style.display = "block";
                        btn.classList.add("active");
                    }
                });
            });

            // Sortable tables
            document.querySelectorAll('.yolo-themed table').forEach(function(table) {
                var headers = table.querySelectorAll('th');
                headers.forEach(function(header, colIndex) {
                    header.style.cursor = 'pointer';
                    header.addEventListener('click', function() {
                        var tbody = table.querySelector('tbody') || table;
                        var rows = Array.from(tbody.querySelectorAll('tr')).filter(function(r) { return r.querySelector('td'); });
                        var isAsc = header.dataset.sortDir !== 'asc';
                        header.dataset.sortDir = isAsc ? 'asc' : 'desc';
                        headers.forEach(function(h) { if (h !== header) h.dataset.sortDir = ''; });
                        rows.sort(function(a, b) {
                            var aVal = (a.querySelectorAll('td')[colIndex] || {}).textContent || '';
                            var bVal = (b.querySelectorAll('td')[colIndex] || {}).textContent || '';
                            var aNum = parseFloat(aVal), bNum = parseFloat(bVal);
                            if (!isNaN(aNum) && !isNaN(bNum)) return isAsc ? aNum - bNum : bNum - aNum;
                            return isAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
                        });
                        rows.forEach(function(row) { tbody.appendChild(row); });
                    });
                });
            });

            // Scalable images
            document.querySelectorAll('.image').forEach(function(img) {
                img.addEventListener('click', function() { img.classList.toggle('max'); });
            });
        }
    };

    var yolo = new Yolo();
    yolo.init();
    window.Yolo = yolo;

})(window);
