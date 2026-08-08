---
layout: layouts/post.njk
title: Image Grid
description: Display images in a grid layout with click-to-enlarge.
date: 2026-01-16
tags:
  - images
  - grid
  - media
  - gallery
permalink: /posts/image-grid/
---

## Image Grid

Shows images inline. Click to enlarge. Click again to shrink. 📷

1. Add images to `src/_data/ig-images.yml`.
2. Use the `imageGrid` shortcode.

### Default
{:.no-toc}

Uses `src/_data/ig-images.yml`:

{% code "Shortcode" %}
{% raw %}
```html
{% imageGrid %}
```
{% endraw %}

{% imageGrid %}

### Custom File
{:.no-toc}

Create a file in `src/_data/` with an `ig-` prefix:

{% code "Custom data" %}
{% raw %}
```html
{% imageGrid "ig-pets", 2 %}
```
{% endraw %}

{% imageGrid "ig-pets", 2 %}
