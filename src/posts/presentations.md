---
layout: layouts/post.njk
title: Presentations
description: Embed presentations with configurable aspect ratios.
date: 2026-01-19
tags:
  - presentations
  - embed
  - media
  - slides
permalink: /posts/presentations/
---

## Presentations

Embed Google Slides. 📽️

1. Add data to `src/_data/prezos.yml`.
2. Use the `prezo` shortcode with the title.

Default aspect ratio is 16:9. Options: `is-16-by-9`, `is-4-by-3`, `is-1-by-1`.

---

### 16:9 Ratio
{:.no-toc}

{% code "Default ratio" %}
{% raw %}
```html
{% prezo "blinged-macmini" %}
```
{% endraw %}

{% prezo "blinged-macmini" %}

---

### 4:3 Ratio
{:.no-toc}

{% code "4:3 ratio" %}
{% raw %}
```html
{% prezo "one-awesome-prezo", "prezos", "is-4-by-3" %}
```
{% endraw %}

{% prezo "one-awesome-prezo", "prezos", "is-4-by-3" %}

---

### 1:1 Ratio
{:.no-toc}

{% code "1:1 ratio" %}
{% raw %}
```html
{% prezo "yolo-on", "prezos", "is-1-by-1" %}
```
{% endraw %}

{% prezo "yolo-on", "prezos", "is-1-by-1" %}
