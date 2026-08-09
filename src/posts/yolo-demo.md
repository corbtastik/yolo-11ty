---
layout: layouts/post.njk
title: Yolo Demo
description: The official Yolo-11ty demo site showcasing all features.
date: 2026-01-15
tags:
  - demo
  - eleventy
  - themes
  - features
permalink: /posts/yolo-demo/
links:
- yolo,https://github.com/corbtastik/yolo
- 11ty,https://www.11ty.dev
ext_js:
- custom
- theme-sampler
- search
ext_css:
- custom
- fancy-list
---

## Howdy

Yolo builds single page sites. It works for writers, developers, and photographers. 👋

> _I don't always use single-pages, but when I do, I [yolo](https://github.com/corbtastik/yolo)._

### Goals
{:.no-toc}

1. Live the single page life. 🎯
2. Keep it simple. No bloat. ✨
3. Make it yours. Bring your own [brand](#branding). 🎨

---

## Getting Started

You need [Node.js](https://nodejs.org/) and npm. 🚀

{% code "Get Yolo" %}
```bash
git clone https://github.com/corbtastik/yolo.git
cd yolo
npm install
npm run build
npm run serve
```


---

## Branding

Yolo uses themes for colors and fonts. Each theme has a matching syntax theme for code blocks.

> **Theme files:**
> * `src/_sass/yolo/brand/theme/` - color and font themes
> * `src/_sass/yolo/brand/syntax/` - syntax highlighting themes


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


---

## Syntax Themes

Yolo highlights code with custom syntax themes. Each color theme includes a matching syntax theme.

> **Syntax files:**
> * `src/_sass/yolo/brand/theme/` - color themes
> * `src/_sass/yolo/brand/syntax/` - syntax themes

Syntax themes map colors to code tokens like keywords, strings, and comments.


---

### Custom Syntax Theme
{:.no-toc}

1. Add a `.scss` file to `src/_sass/yolo/brand/syntax/`.
2. Set colors for **light** and **dark** modes.
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


---

## Typography

Customize fonts in your theme file. See [Themes](#themes) for details.

{% include "demo/typography-swatches.njk" %}


---

## Headers

> H1 is reserved for the site title.

## H2 Heading
{:.no-toc}

### H3 Heading
{:.no-toc}

#### H4 Heading
{:.no-toc}

##### H5 Heading
{:.no-toc}

###### H6 Heading
{:.no-toc}


---

## Paragraph Text

[Baseball](https://en.wikipedia.org/wiki/Baseball) is a bat-and-ball game. ⚾ Two teams of nine take turns batting and fielding. The pitcher throws. The batter swings. Hit the ball, run the bases, score runs. The team with more runs wins.


---

## Blockquotes

### Single
{:.no-toc}

> In the US and Canada, Major League Baseball teams split into the National League and American League. Each has three divisions. Playoffs decide the champion in the World Series.

### Multiple Paragraphs
{:.no-toc}

> Two teams play. Nine players each. They trade offense and defense.
>
> The field has foul lines at 45-degree angles from home plate. Inside is fair territory. Outside is foul.

### Nested
{:.no-toc}

> MLB rosters have 25 players with set roles:
>
> > Eight position players: catcher, four infielders, three outfielders.
>
> Most leagues use the designated hitter rule.

### With Markdown
{:.no-toc}

> #### Embedded Content
> {:.no-toc}
> - Plain text
> - **Bold**
> - *Italic*
> - <abbr title="Abbreviation">Abbr</abbr>
> - <cite>Citation</cite>
> - <del>Deleted</del>
> - <ins>Underlined</ins>
> - Super<sup>script</sup>
> - Sub<sub>script</sub>
> - Inline `code`
>
> | First | Last   | HR  |
> |-------|--------|-----|
> | Hank  | Aaron  | 755 |
> | Babe  | Ruth   | 714 |
>
> ![Moonie Moonpie](/assets/images/moonpie.png "Sweet Moonpie")


---

## Inline Text

- Plain text
- **Bold**
- *Italic*
- <abbr title="Abbreviation">Abbr</abbr>
- <cite>Citation</cite>
- <del>Deleted</del>
- <ins>Underlined</ins>
- Super<sup>script</sup>
- Sub<sub>script</sub>
- Inline `code`


---

## Lists

### Unordered
{:.no-toc}

* Arlington Stadium
* Rangers Ballpark
* Ebbets Field

* Boston Red Stockings
  * Boston Red Caps
    * Boston Beaneaters
      * Boston Red Sox

### Ordered
{:.no-toc}

1. Babe Ruth
2. Willie Mays
3. Dale Murphy
4. Mookie Wilson


---

## Tables

Click any column header to sort. Click again to reverse.

### Basic
{:.no-toc}

| Player       | BA   | HR  |
|--------------|------|-----|
| Hank Aaron   | .305 | 755 |
| Babe Ruth    | .342 | 714 |
| Mookie Wilson| .274 | 67  |

### Aligned
{:.no-toc}

| Left         | Center         | Right |
|:-------------|:--------------:|------:|
| Hank Aaron   | Right-fielder  |  .305 |
| Babe Ruth    | Outfielder     |  .342 |
| Mookie Wilson| Center-fielder |  .274 |


---

## Markdown Images

Standard markdown images use default `<img>` styling.

{% code "Markdown" %}
{% raw %}
```markdown
![Moonie Moonpie](assets/images/moonpie.png "Sweet Moonpie")
![BIG yawn Bucky](assets/images/bucky.png "Sleepy Bucky")
```
{% endraw %}

![Moonie Moonpie](/assets/images/moonpie.png "Sweet Moonpie")

![BIG yawn Bucky](/assets/images/bucky.png "Sleepy Bucky")


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


---

## Image Lightbox

Opens images in a modal. Navigate with arrows or `<` and `>` keys. 🔍

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


---

## Videos

{% video %}


---

## Presentations

Embed Google Slides. 📽️

1. Add data to `src/_data/prezos.yml`.
2. Use the `prezo` shortcode with the title.

Default aspect ratio is 16:9. Options: `is-16-by-9`, `is-4-by-3`, `is-1-by-1`.

#### 16:9
{:.no-toc}

{% code "Default ratio" %}
{% raw %}
```html
{% prezo "blinged-macmini" %}
```
{% endraw %}

{% prezo "blinged-macmini" %}

#### 4:3
{:.no-toc}

{% code "4:3 ratio" %}
{% raw %}
```html
{% prezo "one-awesome-prezo", "prezos", "is-4-by-3" %}
```
{% endraw %}

{% prezo "one-awesome-prezo", "prezos", "is-4-by-3" %}

#### 1:1
{:.no-toc}

{% code "1:1 ratio" %}
{% raw %}
```html
{% prezo "yolo-on", "prezos", "is-1-by-1" %}
```
{% endraw %}

{% prezo "yolo-on", "prezos", "is-1-by-1" %}


---

## Custom CSS

Add CSS files via front matter:

{% code "Front matter" %}
```yaml
ext_css:
  - custom
```

This loads `/assets/ext/css/custom.css` after `main.css`. 🎨

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

### Fancy List
{:.no-toc}

Styled with `fancy-list.css`:

{% include "demo/fancy-list.njk" %}


---

## Custom JavaScript

Add JavaScript via front matter:

{% code "Front matter" %}
```yaml
ext_js:
  - custom
```

This loads `/assets/ext/js/custom.js` before the closing `</body>` tag. ⚡

### XMLHttpRequest
{:.no-toc}

<button id="site-button-ajax" type="button">
    Site Info (AJAX)
</button>

### Fetch API
{:.no-toc}

<button id="site-button-fetch" type="button">
    Site Info (Fetch)
</button>


---

## Containers

Run Yolo in a container with [Podman](https://podman.io/). 📦

### Images
{:.no-toc}

The Makefile builds two images:

* **yoloc** - Builder image with Node.js and npm
* **yolo** - Runtime image with Apache httpd

### Build and Run
{:.no-toc}

{% code "Podman" %}
```bash
# Build the builder
podman build -f ./src/yoloc.Containerfile -t yoloc:latest ./src

# Build the runtime
podman build -f Containerfile -t yolo:latest .

# Run on port 9696
podman run --name yolo -d -p 9696:9696 yolo:latest
```

Or use Make:

{% code "Make" %}
```bash
make yolo-pod
```

Opens at [http://localhost:9696](http://localhost:9696).


---

## More Snippets

### Bash
{:.no-toc}

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


---

### C
{:.no-toc}

{% code "C" %}
```c
#include <stdio.h>

int main(int argc, char **argv) {
    if(argc != 2) {
        printf("Usage: Howdy <NAME>");
        return 1;
    }
    printf("Howdy %s!\n", argv[1]);
    return 0;
}
```


---

### C++
{:.no-toc}

{% code "C++" %}
```c++
#include <iostream>
using namespace std;

int main(int argc, char** argv) {
    if(argc != 2) {
        cout << "Usage: Howdy <NAME>";
        return 1;
    }
    cout << "Howdy " << argv[1];
    return 0;
}
```


---

### Dart
{:.no-toc}

{% code "Dart" %}
```dart
import 'dart:io';

void main(List<String> args) {
    exitCode = 0;
    if(args.length != 1) {
        stdout.writeln("Usage: Howdy <NAME>");
        exitCode = 1;
        return;
    }
    stdout.writeln("Howdy ${args[0]}!");
}
```


---

### Go
{:.no-toc}

{% code "Go" %}
```go
package main

import (
    "os"
    "fmt"
)

func main() {
    if len(os.Args) != 2 {
        fmt.Println("Usage: Howdy <NAME>")
        os.Exit(1)
    }
    fmt.Println("Howdy " + os.Args[1] + "!")
}
```


---

### HTML
{:.no-toc}

{% code "HTML" %}
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Howdy!</title>
</head>
<body>
    <h1>Howdy!</h1>
</body>
</html>
```


---

### JSON
{:.no-toc}

{% code "JSON" %}
```json
{
  "apiVersion": "v1",
  "kind": "Service",
  "metadata": {
    "name": "minio-server-lb",
    "namespace": "minio"
  },
  "spec": {
    "ports": [{
      "port": 9000,
      "targetPort": 9000
    }],
    "type": "LoadBalancer"
  }
}
```


---

### Java
{:.no-toc}

{% code "Java" %}
```java
public class Howdy {
    public static void main(String[] args) {
        if(args.length != 1) {
            System.out.println("Usage: Howdy <NAME>");
            System.exit(1);
        }
        System.out.println("Howdy " + args[0] + "!");
    }
}
```


---

### JavaScript
{:.no-toc}

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


---

### Kotlin
{:.no-toc}

{% code "Kotlin" %}
```kotlin
fun main(args: Array<String>): Int {
    if(args.size != 1) {
        println("Usage: Howdy <NAME>")
        return 1
    }
    println("Howdy " + args[0] + "!")
    return 0
}
```


---

### Markdown
{:.no-toc}

{% code "Markdown" %}
```markdown
# Howdy

* **Bold**
* *Italic*
* [Link](https://example.com)
* `code`
```


---

### Python
{:.no-toc}

{% code "Python" %}
```python
import sys

def say_howdy(name):
    print("Howdy " + name + "!")

if len(sys.argv) != 2:
    print("Usage: Howdy <NAME>")
    sys.exit(1)

say_howdy(sys.argv[1])
```


---

### SCSS
{:.no-toc}

{% code "SCSS" %}
```scss
.light-theme {
  color: $light-secondary-color;
  background-color: $light-primary-color;

  a {
    color: $light-link-color;
  }

  h1, h2, h3 {
    color: $light-accent-color;
  }
}
```


---

### SQL
{:.no-toc}

{% code "SQL" %}
```sql
SELECT *
FROM orders
WHERE cust_id = "mickey@mouse.com"
AND price > 5000
AND price <= 10000
```


---

### YAML
{:.no-toc}

{% code "YAML" %}
```yaml
name: Yolo
version: v1.5
title: Yolo on my friend
description: Loveable single pages
brand:
  theme: corbs
  syntax: corbs
sidebar:
  logo: assets/images/logo.png
```


---

## License

```text
MIT License

Copyright (c) 2023 Corbs

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

