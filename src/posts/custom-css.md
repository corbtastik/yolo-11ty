---
layout: layouts/post.njk
title: Custom CSS
description: Add custom CSS to individual pages.
date: 2026-01-20
tags:
  - css
  - customization
  - styling
permalink: /posts/custom-css/
ext_css:
  - custom
  - fancy-list
---

## Custom CSS

Add page-specific CSS using front-matter.

{% code "Front Matter" %}
```yaml
ext_css:
  - custom
  - another-file
```

Files go in `src/assets/ext/css/`. Add them without the `.css` extension.

---

### Rubik Cube
{:.no-toc}

Styled with `custom.css`:

<div class="rubik-cube-row">
    <div class="flex-item red"></div>
    <div class="flex-item yellow"></div>
    <div class="flex-item green"></div>
</div>
<div class="rubik-cube-row">
    <div class="flex-item blue"></div>
    <div class="flex-item orange"></div>
    <div class="flex-item yellow"></div>
</div>
<div class="rubik-cube-row">
    <div class="flex-item yellow"></div>
    <div class="flex-item red"></div>
    <div class="flex-item blue"></div>
</div>

---

### Fancy List
{:.no-toc}

{% include "demo/fancy-list.njk" %}
