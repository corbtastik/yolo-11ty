---
layout: layouts/post.njk
title: Image Lightbox
description: Full-screen image lightbox with navigation controls.
date: 2026-01-17
tags:
  - images
  - lightbox
  - media
  - gallery
permalink: /posts/image-lightbox/
---

## Image Lightbox

Creates a full-screen lightbox. 📸

1. Add images to `src/_data/lb-images.yml`.
2. Use the `lightbox` shortcode.

### Default
{:.no-toc}

Uses `src/_data/lb-images.yml`:

{% code "Shortcode" %}
{% raw %}
```html
{% lightbox %}
```
{% endraw %}

{% lightbox %}

### Custom File
{:.no-toc}

Create a file in `src/_data/` with an `lb-` prefix:

{% code "Custom data" %}
{% raw %}
```html
{% lightbox "lb-marfa" %}
```
{% endraw %}

{% lightbox "lb-marfa" %}
