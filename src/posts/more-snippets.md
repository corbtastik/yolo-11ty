---
layout: layouts/post.njk
title: More Snippets
description: Code snippet examples in various programming languages.
date: 2026-01-23
tags:
  - code
  - snippets
  - syntax
  - highlighting
permalink: /posts/more-snippets/
---

## More Snippets

Code blocks with syntax highlighting. Click the header to copy.

---

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

int main() {
    char name[50];
    printf("Howdy, what's your name? ");
    scanf("%s", name);
    printf("Howdy %s!\n", name);
    return 0;
}
```

---

### Go
{:.no-toc}

{% code "Go" %}
```go
package main

import (
    "fmt"
    "os"
)

func main() {
    if len(os.Args) != 2 {
        fmt.Println("Usage: Howdy <NAME>")
        os.Exit(1)
    }
    fmt.Printf("Howdy %s!\n", os.Args[1])
}
```

---

### Java
{:.no-toc}

{% code "Java" %}
```java
public class Howdy {
    public static void main(String[] args) {
        if (args.length != 1) {
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

### Python
{:.no-toc}

{% code "Python" %}
```python
import sys

def say_howdy(name):
    print(f"Howdy {name}!")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: Howdy <NAME>")
        sys.exit(1)
    say_howdy(sys.argv[1])
```

---

### Kotlin
{:.no-toc}

{% code "Kotlin" %}
```kotlin
fun main(args: Array<String>) {
    if (args.size != 1) {
        println("Usage: Howdy <NAME>")
        return
    }
    println("Howdy ${args[0]}!")
}
```

---

### JSON
{:.no-toc}

{% code "JSON" %}
```json
{
  "greeting": "Howdy",
  "name": "Partner",
  "emoji": "🤠"
}
```

---

### YAML
{:.no-toc}

{% code "YAML" %}
```yaml
greeting: Howdy
name: Partner
emoji: 🤠
features:
  - simple
  - readable
  - no-braces
```

---

### HTML
{:.no-toc}

{% code "HTML" %}
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Howdy</title>
</head>
<body>
    <h1>Howdy Partner!</h1>
</body>
</html>
```

---

### SQL
{:.no-toc}

{% code "SQL" %}
```sql
SELECT greeting, name
FROM greetings
WHERE style = 'howdy'
ORDER BY created_at DESC;
```
