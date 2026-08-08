---
layout: layouts/post.njk
title: Styled Images
description: Image classes for thumbnails, squares, circles, and aspect ratios.
date: 2026-01-14
tags:
  - images
  - styling
  - media
  - css
permalink: /posts/styled-images/
---

## Styled Images

Yolo has classes for common aspect ratios.

> Click an image to enlarge. 🔎

---

### Thumbnail
{:.no-toc}

128px square. Use the `thumbnail` class.

{% image { classes: "thumbnail", src: "https://storage.googleapis.com/corbs-foto/broken-bow-we-go/big-tongue-bucky.jpg" } %}


---

### Square
{:.no-toc}

Classes: `is-16` through `is-640`.

{% image { classes: "image is-256", src: "https://storage.googleapis.com/corbs-foto/bigd/granada-theater-greenville-1150.jpg" } %}


---

### Circle
{:.no-toc}

Classes: `is-circle-16` through `is-circle-640`.

{% image { classes: "is-circle-256", src: "https://storage.googleapis.com/corbs-foto/broken-bow-we-go/big-tongue-bucky.jpg" } %}


---

### 4:3 Ratio
{:.no-toc}

Classes: `is-100-by-75` through `is-640-by-480`.

{% image { classes: "image is-256-by-192", src: "https://storage.googleapis.com/corbs-foto/flowerhood/bluebonnet.jpg" } %}


---

### 3:4 Ratio
{:.no-toc}

Classes: `is-75-by-100` through `is-480-by-640`.

{% image { classes: "image is-240-by-320", src: "https://storage.googleapis.com/corbs-foto/flowerhood/bluebonnet.jpg" } %}


---

### 16:9 Ratio
{:.no-toc}

Classes: `is-112-by-63` through `is-640-by-360`.

{% image { classes: "image is-256-by-144", src: "https://storage.googleapis.com/corbs-foto/flowerhood/bluebonnet.jpg" } %}


---

### 9:16 Ratio
{:.no-toc}

Classes: `is-63-by-112` through `is-360-by-640`.

{% image { classes: "image is-225-by-400", src: "https://storage.googleapis.com/corbs-foto/flowerhood/bluebonnet.jpg" } %}
