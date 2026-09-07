---
layout: layouts/default.njk
title: Function Codes
description: Every function code, and what it does.
permalink: /commands/
---

## Function Codes

Type `/` in any search box on this site and it becomes a command line. Matching
codes appear as you type; press <kbd>Enter</kbd> to run one, or <kbd>Esc</kbd>
to go back to searching.

<div id="command-reference"></div>

<noscript>
Function codes are typed into the search box and need JavaScript, so the list
cannot be shown here.
</noscript>

### Arguments
{:.no-toc}

A code shown as `/tag <value>` takes an argument: type the code, a space, then
the value.

{% code "arguments" %}
```text
/tag photos
/page 2
/sort old
```

### Adding your own
{:.no-toc}

Codes register themselves, so a site can add its own without touching the ones
that ship. Register after `commands.js` has loaded:

{% code "custom code" %}
```javascript
YoloCommands.register({
  name: 'hello',
  describe: 'Say hello',
  run: function () {
    YoloCommands.announce('Howdy');
  }
});
```

Add `arg` to require a value, and `when` to hide the code on pages where it
would not work — that is how the index codes above stay off pages that have no
posts to sort.
