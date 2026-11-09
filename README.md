# Yolo

Loveable single pages - Eleventy edition.

Yolo builds single-page sites. It works for writers, developers and photographers.

**Live demos** - the same content, the same build, one setting apart:

| | | |
|---|---|---|
| **Single page** | [yolo-11ty.web.app](https://yolo-11ty.web.app) | everything on one scrolling page |
| **Multi page** | [yolo-hub-11ty.web.app](https://yolo-hub-11ty.web.app) | a searchable card index over separate posts |

**Every theme, as a slide deck** -
[yolo-themes-showcase.web.app](https://yolo-themes-showcase.web.app) walks
through the colors, typefaces and components of every theme in
`src/_data/themes.json`. Each deck wears the palette it describes.

> **Upgrading from 1.x?** Themes now live only in `src/_data/themes.json`.
> The generated SCSS under `src/_sass/yolo/brand/theme/` and `.../syntax/` is
> gone. So are the `build:scss` and `generate:themes` scripts. `npm run build`
> does the whole job in one pass.

## Quick Start

### Create a New Site

Generate a new site from the template. That is the fastest way to start.

```bash
# Clone yolo-11ty
git clone https://github.com/corbtastik/yolo-11ty.git
cd yolo-11ty
npm install

# Create your new site (interactive prompts)
npm run create
```

You get a new site folder beside yolo-11ty, built with the settings you chose.

### Run the Demo

To run the Yolo demo site:

```bash
git clone https://github.com/corbtastik/yolo-11ty.git
cd yolo-11ty
npm install
npm run serve
```

Open http://localhost:8080 to see your site.

## Features

### Themes

Yolo ships **67 themes**, each with matching syntax highlighting. Click the
palette icon in the top right to switch themes on any page. Yolo remembers
your pick as you move around the site.

**Configure your theme** in `src/_data/settings.yml`:

```yaml
brand:
  theme: matrix-blue
  syntax: matrix-blue
```

Theme categories:
- **Material** - Google Material Design colors
- **Matrix** - Terminal and hacker looks
- **Chroma** - Vivid single-color themes
- **Corbs** - Custom artistic themes
- **Original Yolo** - The themes Yolo started with

### Light/Dark Mode

Click the sun or moon icon in the top right to switch between light and dark.
Yolo remembers your choice. Mode and theme are separate axes. Every theme
carries both a light and a dark palette.

### Sidebar

An optional sidebar. It carries your logo, and on a post it carries that
post's contents too. Configure it in `src/_data/settings.yml`:

```yaml
sidebar:
  position: left  # or 'right'
  logo: assets/images/logo.png
```

The sidebar shows on the hub and on every page, at one width. Click the menu
icon to collapse it. Yolo remembers that too, so following a link moves
nothing.

### Single Page or Multi Page

One setting decides the shape of the whole site:

```yaml
hub:
  enabled: false   # single page: the home page is your headline post
  postsPerPage: 10
```

**`enabled: false`** - the home page renders the post marked `pinned: true` in
full. The site becomes one long scrolling page. Everything else still builds at
its own URL. This is [yolo-11ty.web.app](https://yolo-11ty.web.app).

**`enabled: true`** - the home page becomes the Hub, a searchable card index,
and each post is its own page. This is
[yolo-hub-11ty.web.app](https://yolo-hub-11ty.web.app).

Mark the headline post in its front matter:

```yaml
---
title: Yolo Demo
pinned: true
---
```

`pinned` means the same thing in both modes: the post that leads. In
single-page mode it is the page. In hub mode it is the first card. Pin nothing
and the oldest post leads.

### Yolo Hub

The Hub is a card index of every post. It has search, tag filters and
pagination.

**Features:**
- **Card layout** - Each post gets a card with title, description, date and tags
- **Live search** - Filter by title, description or tag as you type
- **Keyboard navigation** - Arrow keys move, Enter opens, Escape clears
- **Tag filtering** - Click a tag to filter by it
- **Pagination** - Set posts per page, with full navigation controls
- **Seamless transitions** - The hub and its posts share one column width, and the sidebar stays as you left it

**Configure** in `src/_data/settings.yml`:

```yaml
hub:
  enabled: true
  postsPerPage: 10
```

The hub reads `src/posts/` and takes what it needs from each post's front
matter. There is no list to keep in sync. Posts marked `pinned: true` come
first, then the rest by date.

### Search

Type-ahead search filters the page by section. Press:
- **Arrow keys** - Navigate results
- **Enter** - Jump to section
- **Escape** - Close search

### Sortable Tables

Click any column header to sort. Click again to reverse. Numbers sort as
numbers, text as text.

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
Builds a table of contents from the H2 headings:

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
Shows images in a grid. Click one to expand it:

```nunjucks
{% imageGrid "ig-images", 4 %}
```

Data file: `src/_data/ig-images.yml`

#### Lightbox
A full-screen gallery with arrow navigation:

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
├── .eleventy.js            # Eleventy config: filters, shortcodes, SCSS build
├── scripts/
│   └── create-site.js      # Site generator (npm run create)
├── src/
│   ├── _data/
│   │   ├── settings.yml    # Site configuration
│   │   ├── themes.json     # All 67 themes, colors for light and dark
│   │   └── syntaxTokens.yml # Token catalog for the demo swatch grid
│   ├── _includes/
│   │   ├── components/     # Reusable Nunjucks partials
│   │   ├── demo/           # Demo-only partials
│   │   └── layouts/        # base.njk plus thin per-type layouts
│   ├── _sass/yolo/
│   │   ├── base/           # Reset, variables
│   │   ├── brand/          # Color utilities, syntax and theme rules
│   │   ├── components/     # UI components
│   │   ├── core/           # Layout, typography
│   │   └── utilities/      # Helpers
│   ├── assets/
│   │   ├── js/             # Core JavaScript
│   │   └── ext/            # Opt-in CSS/JS, loaded via front matter
│   ├── css/                # Stylesheet entry points (.scss)
│   └── index.njk           # Hub index page
└── _site/                  # Built output
```

### NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run create` | Create a new site from template |
| `npm run build` | Build to `_site/` |
| `npm run serve` | Serve with hot reload |
| `npm run clean` | Remove `_site` directory |

### Build Process

Eleventy does everything in one pass. Files in `src/css/` are Nunjucks
templates, and a custom extension compiles them to CSS. Edit any partial under
`src/_sass/` and the stylesheet rebuilds while the server runs.

### Adding a Theme

`themes.json` is the only place theme colors live.

1. Add an entry to a group:

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

2. Point `settings.yml` at it:

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
| `src/_data/syntaxTokens.yml` | Token catalog for the demo swatch grid |
| `src/assets/js/utils.js` | Shared JS utilities (search, pagination, formatting) |
| `src/assets/js/hub.js` | Hub: search, filter, pagination, keyboard nav |
| `src/assets/js/theme.js` | Sets light or dark before the first paint |
| `src/assets/js/palette.js` | Theme palette picker, on every page |
| `src/assets/js/commands.js` | Function codes typed into any search box |
| `src/assets/js/yolo.js` | Core: lightbox, image grid, TOC, sidebar |
| `src/assets/ext/js/theme-vars.js` | Theme colors to CSS variables, shared by build and browser |
| `src/assets/ext/js/theme-sampler.js` | Live theme switching |
| `src/css/brand.scss` | Theme variables and syntax swatch classes |
| `src/css/hub.scss` | Hub card and pagination styles |

### Styling

- **CSS custom properties** - Every theme color is a variable, set on `:root`
- **One mapping** - `theme-vars.js` turns a theme's twelve colors into the
  full variable set. The build and the browser both call it
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
--syntax-name-function   /* Code: functions */
```

### JavaScript Architecture

- **IIFE pattern** - Each file is self-contained
- **YoloUtils** - Shared helpers: `domReady`, `debounce`, `formatDate`,
  `filterByQuery`, `paginate`, `selectionList`
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

### Deploying

`npm run build` writes a static site to `_site/`. Any static host will serve
it. This repo ships a Firebase config with two hosting targets, because the
demo publishes both modes from one source:

| Target | Site | `hub.enabled` |
|--------|------|---------------|
| `yolo-11ty` | [yolo-11ty.web.app](https://yolo-11ty.web.app) | `false` |
| `yolo-hub-11ty` | [yolo-hub-11ty.web.app](https://yolo-hub-11ty.web.app) | `true` |

Both targets publish `_site`. The mode is whatever `settings.yml` said at
build time. Build and deploy one at a time:

```bash
# single page
# set hub.enabled: false in src/_data/settings.yml
npm run build
firebase deploy --only hosting:yolo-11ty

# multi page
# set hub.enabled: true in src/_data/settings.yml
npm run build
firebase deploy --only hosting:yolo-hub-11ty
```

For your own site you need one target. Drop the other from `firebase.json`
and `.firebaserc`.

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

CORBS Commercial License v1.0 - see [LICENSE](LICENSE).
