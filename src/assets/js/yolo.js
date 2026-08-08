// ============================================================================
// Yolo Javascript functions
// https://github.com/corbtastik/yolo
// MIT License
// ============================================================================
(function (window) {
    'use strict';

    // ------------------------------------------------------------------------
    // Console wrapper for debugging
    // ------------------------------------------------------------------------
    class Console {
        static enabled = true;

        static log(text) {
            if (Console.enabled) {
                console.log("YOLO LOG " + new Date().toUTCString() + ": " + text);
            }
        }

        static error(text) {
            if (Console.enabled) {
                console.log("YOLO ERR " + new Date().toUTCString() + ": " + text);
            }
        }
    }

    // ------------------------------------------------------------------------
    // Gallery base class - shared logic for ImageGrid and Lightbox
    // ------------------------------------------------------------------------
    class Gallery {
        constructor(name) {
            this.name = name;
            this.isOpen = false;
            this.currentIndex = 0;
            this.totalItems = 0;
        }

        next() {
            this.showItem(this.currentIndex + 1);
        }

        prev() {
            this.showItem(this.currentIndex - 1);
        }

        wrapIndex(index) {
            if (index >= this.totalItems) return 0;
            if (index < 0) return this.totalItems - 1;
            return index;
        }

        // Abstract methods - subclasses must implement
        open(index) { throw new Error('Subclass must implement open()'); }
        close() { throw new Error('Subclass must implement close()'); }
        showItem(index) { throw new Error('Subclass must implement showItem()'); }
    }

    // ------------------------------------------------------------------------
    // ImageGrid class
    // ------------------------------------------------------------------------
    class ImageGrid extends Gallery {
        constructor(name) {
            super(name);
        }

        static create(name) {
            Console.log("ImageGrid.create for name=" + name);
            return new ImageGrid(name);
        }

        getGridElement() {
            return document.getElementById("ig-" + this.name);
        }

        getTargetElement() {
            return document.getElementById("ig-target-" + this.name);
        }

        getImages() {
            return this.getTargetElement().getElementsByTagName('img');
        }

        getCaption(index) {
            return document.getElementById(this.name + "-caption-" + index);
        }

        open(index) {
            Console.log("ImageGrid.open: " + this.name + " index=" + index);
            this.getGridElement().style.display = "none";

            const target = this.getTargetElement();
            const images = this.getImages();
            this.totalItems = images.length;
            this.currentIndex = index;

            for (let i = 0; i < images.length; i++) {
                const caption = this.getCaption(i);
                const show = (i === index);
                images[i].style.display = show ? "block" : "none";
                if (caption) caption.style.display = show ? "block" : "none";
            }

            target.classList.remove("no-display");
            target.style.display = "block";
            this.isOpen = true;
        }

        close() {
            Console.log("ImageGrid.close: " + this.name);
            const target = this.getTargetElement();
            const images = this.getImages();

            for (let i = 0; i < images.length; i++) {
                const caption = this.getCaption(i);
                images[i].style.display = "none";
                if (caption) caption.style.display = "none";
            }

            target.style.display = "none";
            target.classList.add("no-display");
            this.getGridElement().style.display = "block";
            this.isOpen = false;
        }

        showItem(index) {
            index = this.wrapIndex(index);
            this.currentIndex = index;
            Console.log("ImageGrid.showItem: " + this.name + " index=" + index);

            const images = this.getImages();
            for (let i = 0; i < images.length; i++) {
                const caption = this.getCaption(i);
                const show = (i === index);
                images[i].style.display = show ? "block" : "none";
                if (caption) caption.style.display = show ? "block" : "none";
            }
        }

        // Legacy method names for backwards compatibility
        openImage(imageId) {
            const images = this.getImages();
            for (let i = 0; i < images.length; i++) {
                if (images[i].id === imageId) {
                    this.open(i);
                    return;
                }
            }
        }

        closeImage() { this.close(); }
        nextImage() { this.next(); }
        prevImage() { this.prev(); }
    }

    // ------------------------------------------------------------------------
    // Lightbox class
    // ------------------------------------------------------------------------
    class Lightbox extends Gallery {
        constructor(name) {
            super(name);
            this.initSlides();
        }

        static create(name) {
            Console.log("Lightbox.create for name=" + name);
            return new Lightbox(name);
        }

        getModalElement() {
            return document.getElementById("lb-modal-" + this.name);
        }

        getSlides() {
            return this.getModalElement().getElementsByClassName("lb-slides");
        }

        getCaptionElement() {
            return document.getElementById("lb-caption-" + this.name);
        }

        initSlides() {
            const slides = this.getSlides();
            this.totalItems = slides.length;
            if (this.totalItems > 0) {
                this.showItem(0);
            }
        }

        open(index = 0) {
            Console.log("Lightbox.open: " + this.name);
            this.getModalElement().style.display = "block";
            this.isOpen = true;
            this.showItem(index);
        }

        close() {
            Console.log("Lightbox.close: " + this.name);
            this.getModalElement().style.display = "none";
            this.isOpen = false;
        }

        showItem(index) {
            index = this.wrapIndex(index);
            this.currentIndex = index;
            Console.log("Lightbox.showItem: " + this.name + " index=" + index);

            const slides = this.getSlides();
            const caption = this.getCaptionElement();

            for (let i = 0; i < slides.length; i++) {
                slides[i].style.display = (i === index) ? "block" : "none";
            }

            if (caption && slides[index] && slides[index].children[0]) {
                caption.innerHTML = slides[index].children[0].alt || '';
            }
        }

        // Legacy method names for backwards compatibility
        openModal() { this.open(); }
        closeModal() { this.close(); }
        currentSlide(n) { this.showItem(n); }
        plusSlides(n) { this.showItem(this.currentIndex + n); }
        showSlides(n) { this.showItem(n); }
    }

    // ------------------------------------------------------------------------
    // Table of Contents
    // ------------------------------------------------------------------------
    class Toc {
        static create() {
            const toc = document.getElementById("toc");
            const tocSidebar = document.getElementById("toc-sidebar");

            if (toc) {
                toc.classList.add("nav-menu");
                toc.innerHTML = Toc.buildTree(Toc.getHeaders());
            }
            if (tocSidebar) {
                tocSidebar.classList.add("nav-menu");
                tocSidebar.innerHTML = Toc.buildTree(Toc.getHeaders(3));
            }
        }

        static getHeaders(maxDepth = 5) {
            const hTags = ["h2", "h3", "h4", "h5", "h6"].slice(0, maxDepth);
            const elements = document.querySelectorAll(hTags.join(","));
            const headers = [];

            elements.forEach(element => {
                if (!element.classList.contains("no-toc")) {
                    const text = element.innerText;
                    const id = text.toLowerCase().split(" ").join("-");
                    element.setAttribute("id", id);
                    headers.push({ id, text, level: hTags.indexOf(element.tagName.toLowerCase()) });
                }
            });

            return headers;
        }

        static buildTree(headers) {
            if (headers.length === 0) return "";

            const list = [];
            let nextLevelHeaders = [];
            let lastLevel = -1;

            const buildSubTree = () => {
                if (nextLevelHeaders.length > 0) {
                    list[list.length - 1] += Toc.buildTree(nextLevelHeaders);
                }
            };

            headers.forEach(h => {
                if (lastLevel !== -1 && lastLevel < h.level) {
                    nextLevelHeaders.push(h);
                    return;
                }
                buildSubTree();
                lastLevel = h.level;
                list.push(`<a href="#${h.id}">${h.text}</a>`);
                nextLevelHeaders = [];
            });

            buildSubTree();
            return `<ul>${list.map(i => `<li>${i}</li>`).join("")}</ul>`;
        }
    }

    // ------------------------------------------------------------------------
    // Yolo main class
    // ------------------------------------------------------------------------
    class Yolo {
        constructor() {
            this.galleries = new Map();
        }

        static create() {
            const yolo = new Yolo();
            yolo.initEventDelegation();
            yolo.initKeyboardNavigation();
            yolo.initThemeToggle();
            yolo.initSidebar();
            yolo.initToc();
            yolo.initTabs();
            yolo.initSortableTables();
            yolo.initScalableImages();
            return yolo;
        }

        // --------------------------------------------------------------------
        // Gallery management
        // --------------------------------------------------------------------
        getGallery(type, name) {
            const key = type + ":" + name;
            if (this.galleries.has(key)) {
                return this.galleries.get(key);
            }
            if (this.galleries.size > 40) {
                throw new Error("Gallery limit reached");
            }

            let gallery;
            if (type === "ig") {
                gallery = ImageGrid.create(name);
            } else if (type === "lb") {
                gallery = Lightbox.create(name);
            }

            this.galleries.set(key, gallery);
            return gallery;
        }

        imageGrid(name) { return this.getGallery("ig", name); }
        lightbox(name) { return this.getGallery("lb", name); }

        // --------------------------------------------------------------------
        // Event delegation - single listener handles all gallery interactions
        // --------------------------------------------------------------------
        initEventDelegation() {
            document.addEventListener('click', (e) => {
                const target = e.target.closest('[data-gallery]');
                if (!target) return;

                const { gallery, galleryType, action, index } = target.dataset;
                if (!gallery || !action) return;

                const instance = this.getGallery(galleryType, gallery);

                switch (action) {
                    case 'open':
                        instance.open(parseInt(index, 10) || 0);
                        break;
                    case 'close':
                        instance.close();
                        break;
                    case 'next':
                        instance.next();
                        break;
                    case 'prev':
                        instance.prev();
                        break;
                }
            });
        }

        // --------------------------------------------------------------------
        // Keyboard navigation - single listener for all galleries
        // --------------------------------------------------------------------
        initKeyboardNavigation() {
            document.addEventListener('keydown', (e) => {
                // Find any open gallery
                for (const gallery of this.galleries.values()) {
                    if (gallery.isOpen) {
                        if (e.key === "ArrowLeft" || (e.key === "<" && e.shiftKey)) {
                            gallery.prev();
                            e.preventDefault();
                        } else if (e.key === "ArrowRight" || (e.key === ">" && e.shiftKey)) {
                            gallery.next();
                            e.preventDefault();
                        } else if (e.key === "Escape") {
                            gallery.close();
                            e.preventDefault();
                        }
                        break;
                    }
                }
            });
        }

        // --------------------------------------------------------------------
        // Theme toggle
        // --------------------------------------------------------------------
        initThemeToggle() {
            const toggle = document.getElementById('theme-toggle');
            if (toggle) {
                Console.log("Theme toggle enabled");
                toggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const root = document.documentElement;
                    const isLight = root.getAttribute('light') !== null;
                    const newMode = isLight ? 'dark' : 'light';

                    root.removeAttribute(isLight ? 'light' : 'dark');
                    root.setAttribute(newMode, '');
                    localStorage.setItem('theme', newMode);
                    toggle.textContent = newMode === 'dark' ? 'light_mode' : 'dark_mode';
                });
            }
        }

        // --------------------------------------------------------------------
        // Sidebar toggle
        // --------------------------------------------------------------------
        initSidebar() {
            const sidebar = document.getElementById('sidebar');
            const toggle = document.getElementById('sidebar-toggle');

            if (sidebar && toggle) {
                Console.log("Sidebar enabled");
                toggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const hidden = document.body.classList.toggle("sidebar-hidden");
                    toggle.textContent = hidden ? "menu_open" : "menu";
                });
            }
        }

        // --------------------------------------------------------------------
        // Table of contents
        // --------------------------------------------------------------------
        initToc() {
            Toc.create();
        }

        // --------------------------------------------------------------------
        // Tabs
        // --------------------------------------------------------------------
        initTabs() {
            document.querySelectorAll('.yolo-tab-button').forEach(button => {
                button.addEventListener('click', () => this.openTab(button));
            });
        }

        openTab(button) {
            const tabId = button.dataset.openTab;
            const tabElement = document.getElementById(tabId);

            if (!tabElement) {
                Console.error("Tab not found: " + tabId);
                return;
            }

            if (button.classList.contains("active")) {
                button.classList.remove("active");
                tabElement.style.display = "none";
                return;
            }

            document.querySelectorAll(".yolo-tab-content").forEach(el => el.style.display = "none");
            document.querySelectorAll(".yolo-tab-links").forEach(el => el.classList.remove("active"));

            tabElement.style.display = "block";
            button.classList.add("active");
        }

        // --------------------------------------------------------------------
        // Sortable tables
        // --------------------------------------------------------------------
        initSortableTables() {
            document.querySelectorAll('.yolo-themed table').forEach(table => {
                const headers = table.querySelectorAll('th');

                headers.forEach((header, colIndex) => {
                    header.style.cursor = 'pointer';
                    header.addEventListener('click', () => {
                        const tbody = table.querySelector('tbody') || table;
                        const rows = Array.from(tbody.querySelectorAll('tr'))
                            .filter(row => row.querySelector('td'));

                        const isAsc = header.dataset.sortDir !== 'asc';
                        header.dataset.sortDir = isAsc ? 'asc' : 'desc';
                        headers.forEach(h => { if (h !== header) h.dataset.sortDir = ''; });

                        rows.sort((a, b) => {
                            const aVal = a.querySelectorAll('td')[colIndex]?.textContent.trim() || '';
                            const bVal = b.querySelectorAll('td')[colIndex]?.textContent.trim() || '';
                            const aNum = parseFloat(aVal), bNum = parseFloat(bVal);

                            if (!isNaN(aNum) && !isNaN(bNum)) {
                                return isAsc ? aNum - bNum : bNum - aNum;
                            }
                            return isAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
                        });

                        rows.forEach(row => tbody.appendChild(row));
                    });
                });
            });
        }

        // --------------------------------------------------------------------
        // Scalable images
        // --------------------------------------------------------------------
        initScalableImages() {
            document.querySelectorAll('.image').forEach(image => {
                image.addEventListener('click', () => image.classList.toggle('max'));
            });
        }
    }

    // ------------------------------------------------------------------------
    // Initialize and expose
    // ------------------------------------------------------------------------
    window.Yolo = Yolo.create();

})(window);
