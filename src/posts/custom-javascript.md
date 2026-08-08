---
layout: layouts/post.njk
title: Custom JavaScript
description: Add custom JavaScript to individual pages.
date: 2026-01-21
tags:
  - javascript
  - customization
  - api
permalink: /posts/custom-javascript/
ext_css:
  - custom
ext_js:
  - custom
---

## Custom JavaScript

Add page-specific JavaScript using front-matter.

{% code "Front Matter" %}
```yaml
ext_js:
  - custom
  - another-file
```

Files go in `src/assets/ext/js/`. Add them without the `.js` extension.

---

### XMLHttpRequest
{:.no-toc}

<button id="site-button-ajax" type="button">
    Site Info (AJAX)
</button>

---

### Fetch API
{:.no-toc}

<button id="site-button-fetch" type="button">
    Site Info (Fetch)
</button>
