# Yolo

Loveable single pages - Eleventy edition.

Yolo builds beautiful single-page sites. It works for writers, developers, and photographers.

**Demo:** https://yolo-11ty.web.app

## Quick Start

### Create a New Site

The fastest way to start is to generate a new site from the template:

```bash
# Clone yolo-11ty
git clone https://github.com/corbtastik/yolo-11ty.git
cd yolo-11ty
npm install

# Create your new site (interactive prompts)
npm run create
```

This creates a new site directory at the same level as yolo-11ty with your chosen settings.

### Run the Demo

To run the Yolo demo site:

```bash
git clone https://github.com/corbtastik/yolo-11ty.git
cd yolo-11ty
npm install
npm run serve
```

Open http://localhost:8080 to view your site.

## Features

### Themes

Yolo includes **67 themes** with matching syntax highlighting. Switch themes instantly using the theme sampler on the demo page.

**Configure your theme** in `src/_data/settings.yml`:

```yaml
brand:
  theme: matrix-blue
  syntax: matrix-blue
```

Theme categories:
- **Material** - Google Material Design colors
- **Matrix** - Terminal/hacker aesthetics
- **Chroma** - Vibrant single-color themes
- **Corbs** - Custom artistic themes

### Light/Dark Mode

Click the sun/moon icon (top right) to toggle between light and dark modes. Your preference is saved in localStorage.

### Sidebar

Optional sidebar navigation. Configure in `src/_data/settings.yml`:

```yaml
sidebar:
  position: left  # or 'right'
  logo: assets/images/logo.png
```

### Yolo Hub

The Hub is a card-based index page that displays all your posts with search, filtering, and pagination.

**Features:**
- **Card layout** - Each post displays as a card with title, description, date, and tags
- **Live search** - Filter posts by title, description, or tags as you type
- **Keyboard navigation** - Use Arrow keys to navigate results, Enter to open, Escape to clear
- **Tag filtering** - Click any tag to filter posts by that tag
- **Pagination** - Configurable posts per page with full navigation controls
- **Seamless transitions** - Posts open with collapsed sidebar matching hub width

**Configure** in `src/_data/settings.yml`:

```yaml
hub:
  postsPerPage: 10
```

The hub automatically collects all posts from `src/posts/` and displays them sorted by date.

### Search

Type-ahead search that filters page sections. Press:
- **Arrow keys** - Navigate results
- **Enter** - Jump to section
- **Escape** - Close search

### Sortable Tables

Click any column header to sort. Click again to reverse. Numbers sort numerically, text sorts alphabetically.

### Shortcodes

#### Code Header
Adds a header with copy button above code blocks:

```nunjucks
{% code "JavaScript" %}
```javascript
console.log("Hello!");
```
```

#### Table of Contents
Auto-generates TOC from H2 headings:

```nunjucks
{% toc %}
```

#### Images
Display images with optional captions:

```nunjucks
{% image { src: "path/to/image.jpg", classes: "is-256", description: "Caption" } %}
```

Size classes: `thumbnail`, `is-16` to `is-640`, `is-circle-16` to `is-circle-640`

#### Image Grid
Displays images in a grid with click-to-expand:

```nunjucks
{% imageGrid "ig-images", 4 %}
```

Data file: `src/_data/ig-images.yml`

#### Lightbox
Modal image gallery with navigation:

```nunjucks
{% lightbox "lb-images" %}
```

Data file: `src/_data/lb-images.yml`

#### Presentations
Embed Google Slides:

```nunjucks
{% prezo "presentation-title", "prezos", "is-16-by-9" %}
```

Data file: `src/_data/prezos.yml`

#### Videos
Embed videos:

```nunjucks
{% video %}
```

Data file: `src/_data/videos.yml`

### Custom CSS/JS

Add custom styles and scripts via front matter:

```yaml
---
ext_css:
  - custom
  - fancy-list
ext_js:
  - custom
  - theme-sampler
---
```

Files load from:
- CSS: `src/assets/ext/css/{name}.css`
- JS: `src/assets/ext/js/{name}.js`

---

## Developer Guide

### Project Structure

```
yolo-11ty/
├── .eleventy.js          # Eleventy config, filters, shortcodes
├── scripts/
│   ├── build-scss.js     # SCSS compilation
│   └── generate-themes.js # Generate theme SCSS from JSON
├── src/
│   ├── _data/            # Global data files (YAML/JSON)
│   │   ├── settings.yml  # Site configuration
│   │   └── themes.json   # Theme color definitions
│   ├── _includes/
│   │   ├── components/   # Reusable Nunjucks partials
│   │   └── layouts/      # Page layouts
│   ├── _sass/
│   │   └── yolo/
│   │       ├── base/     # Reset, variables
│   │       ├── brand/    # Theme & syntax SCSS
│   │       ├── components/ # UI components
│   │       ├── core/     # Layout, typography
│   │       └── utilities/ # Helpers
│   ├── assets/
│   │   ├── js/           # Core JavaScript
│   │   └── ext/          # Extension CSS/JS
│   ├── css/
│   │   └── hub.scss.njk  # Hub-specific styles
│   └── index.njk         # Hub index page
└── _site/                # Built output
```

### NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run create` | Create a new site from template |
| `npm run build` | Build site + compile SCSS |
| `npm run serve` | Build and serve with hot reload |
| `npm run clean` | Remove `_site` directory |
| `npm run generate:themes` | Regenerate theme SCSS from JSON |

### Build Process

1. **Eleventy** processes templates → `_site/`
2. **SCSS compiler** processes `_site/css/*.scss` → CSS

### Adding a Theme

1. Edit `src/_data/themes.json` - add your theme to a group:

```json
{
  "id": "my-theme",
  "name": "My Theme",
  "dark": {
    "bg": "#1a1a2e",
    "text": "#eaeaea",
    "heading": "#00ff88",
    "link": "#00ccff",
    "primary": "#00ff88",
    "surface": "#16213e",
    "border": "#0f3460",
    "shKeyword": "#00ff88",
    "shString": "#00ccff",
    "shFunction": "#ff6b6b",
    "shVariable": "#ffd93d",
    "shComment": "#6c757d"
  },
  "light": { ... }
}
```

2. Generate SCSS files:

```bash
npm run generate:themes
```

3. Set in `settings.yml`:

```yaml
brand:
  theme: my-theme
  syntax: my-theme
```

### Key Files

| File | Purpose |
|------|---------|
| `.eleventy.js` | Filters, shortcodes, markdown config |
| `src/_data/settings.yml` | Site name, theme, sidebar, hub config |
| `src/_data/themes.json` | All theme color definitions |
| `src/assets/js/utils.js` | Shared JS utilities (search, pagination, formatting) |
| `src/assets/js/hub.js` | Hub: search, filter, pagination, keyboard nav |
| `src/assets/js/theme.js` | Light/dark mode toggle |
| `src/assets/js/yolo.js` | Core: lightbox, image grid, TOC, sidebar |
| `src/assets/ext/js/theme-sampler.js` | Live theme switching |
| `src/css/hub.scss.njk` | Hub card and pagination styles |

### Styling

- **SCSS variables** - Defined in theme files, compiled to CSS custom properties
- **CSS custom properties** - Used at runtime for theming
- **BEM-ish naming** - `.yolo-{component}`, `.yolo-{component}-{element}`

Key CSS custom properties:

```css
--primary-color          /* Page background */
--on-primary-color       /* Text on primary */
--secondary-color        /* Headings */
--tertiary-color         /* Accents */
--link-color             /* Links */
--syntax-keyword         /* Code: keywords */
--syntax-string          /* Code: strings */
--syntax-function        /* Code: functions */
```

### JavaScript Architecture

- **IIFE pattern** - Each file is self-contained
- **YoloUtils** - Shared utilities (domReady)
- **No build step** - Plain ES5 for browser compatibility

### Adding a Shortcode

In `.eleventy.js`:

```javascript
eleventyConfig.addShortcode("myShortcode", function(param) {
  return `<div class="my-component">${param}</div>`;
});
```

Usage in markdown:

```nunjucks
{% myShortcode "Hello" %}
```

### Adding a Filter

In `.eleventy.js`:

```javascript
eleventyConfig.addFilter("uppercase", function(str) {
  return str.toUpperCase();
});
```

Usage:

```nunjucks
{{ "hello" | uppercase }}
```

---

## License

License - see source for details.
