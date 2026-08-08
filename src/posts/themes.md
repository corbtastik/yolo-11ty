---
layout: layouts/post.njk
title: Themes
description: Preview and customize color themes in Yolo.
date: 2026-01-04
tags:
  - themes
  - colors
  - customization
  - design
permalink: /posts/themes/
ext_css:
  - custom
ext_js:
  - theme-sampler
---

## Themes

Click a pill to preview any theme. The site updates instantly. 🎭

{% include "demo/theme-sampler.njk" %}

---

### Custom Themes
{:.no-toc}

Create a custom theme in three steps:

1. Add a new `.scss` file to `src/_sass/yolo/brand/theme/`.
2. Set colors for **light** and **dark** modes.
3. Set `brand.theme` in `src/_data/settings.yml`.

### Color Variables
{:.no-toc}

Three main colors define a theme:

1. **`primary-color`** - Page background
2. **`secondary-color`** - Headers
3. **`tertiary-color`** - Accents

Pick these first. The other colors should complement them.

> Set values for both **light** ☀️ and **dark** 🌙 modes.

#### On Colors
{:.no-toc}

"On" colors sit on top of main colors. They need contrast for readability.

#### Container Colors
{:.no-toc}

Container colors fill nested elements within primary or secondary sections.

> There is no `tertiary-container-color`. Tertiary stands alone as an accent.

#### Link Color
{:.no-toc}

Links get their own color. Pick something distinct and use it everywhere.

---

### Color Swatches
{:.no-toc}

#### Theme Colors
{:.no-toc}

{% include "demo/theme-swatches.njk" %}

#### General Colors
{:.no-toc}

{% include "demo/general-color-swatches.njk" %}
