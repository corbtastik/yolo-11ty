---
layout: layouts/post.njk
title: Syntax Themes
description: Custom syntax highlighting for code blocks in Yolo.
date: 2026-01-05
tags:
  - syntax
  - code
  - highlighting
  - themes
permalink: /posts/syntax-themes/
---

## Syntax Themes

Yolo highlights code with custom syntax themes. Each color theme includes a matching syntax theme.

> **Syntax files:**
> * `src/_data/themes.json` - the `sh*` keys hold syntax colors
> * `src/assets/js/theme-vars.js` - expands them to syntax CSS variables

Syntax themes map colors to code tokens like keywords, strings, and comments.

---

### Custom Syntax Theme
{:.no-toc}

1. Add an entry to a group in `src/_data/themes.json`.
2. Set the `sh*` colors for **light** and **dark** modes.
3. Update `settings.yml`:

{% code "settings.yml" %}
```yaml
name: Yolo
title: Yolo on my friend
description: Loveable single pages
brand:
  theme: reveal
  syntax: reveal
```

---

### Syntax Swatches
{:.no-toc}

These swatches show the current syntax theme colors. Each shows the token name and CSS selector.

{% include "demo/syntax-theme-swatches.njk" %}

---

### Snippets
{:.no-toc}

> Click the header to copy code. 📋

{% code "Bash" %}
```bash
#!/bin/bash
function say_howdy() {
  echo "Howdy $1!"
}

if [ $# -ne 1 ]; then
    echo "Usage: Howdy <NAME>"
    exit 1
fi

say_howdy $1
```


{% code "JavaScript" %}
```javascript
function sayHowdy(name) {
  console.log("Howdy " + name + "!");
}

if(process.argv.length != 3) {
  console.log("Usage: Howdy <NAME>");
  process.exit(1);
}

sayHowdy(process.argv[2]);
```
