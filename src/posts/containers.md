---
layout: layouts/post.njk
title: Containers
description: Build and run Yolo in Docker containers.
date: 2026-01-22
tags:
  - docker
  - containers
  - deployment
permalink: /posts/containers/
---

## Containers

Run Yolo in Docker.

### Images
{:.no-toc}

1. **yolo** - Runs the 11ty development server.
2. **yolo-nginx** - Serves static content with Nginx.

---

### Build and Run
{:.no-toc}

{% code "Build and run yolo" %}
```bash
docker build -t yolo .
docker run --rm -it -p 8080:8080 yolo
# open http://localhost:8080
```

{% code "Build and run yolo-nginx" %}
```bash
docker build -t yolo-nginx -f Dockerfile-nginx .
docker run --rm -it -p 8080:80 yolo-nginx
# open http://localhost:8080
```
