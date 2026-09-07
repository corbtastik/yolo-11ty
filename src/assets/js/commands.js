/**
 * Function codes.
 *
 * Type a slash in any search box and it becomes a command line: /dark, /tag
 * photos, /page 2. The search field is already the one place people type on
 * this site, so commands live there rather than behind a separate shortcut
 * nobody discovers.
 *
 * Commands register themselves. The ones here work on any page; hub.js adds
 * the ones that only mean something over a list of posts (sorting, paging,
 * filtering), so a command never appears where it cannot run.
 *
 * @namespace YoloCommands
 */
(function() {
    'use strict';

    var registry = [];
    var config = window.YoloConfig || {};

    // ------------------------------------------------------------------
    // Registry
    // ------------------------------------------------------------------

    /**
     * @param {Object} spec
     * @param {string} spec.name    without the slash, e.g. "tag"
     * @param {string} [spec.arg]   argument name, shown in help
     * @param {string} spec.describe one line, shown in the palette
     * @param {Function} spec.run   receives the argument string
     * @param {Function} [spec.when] return false to hide the command here
     */
    function register(spec) {
        registry.push(spec);
    }

    function available() {
        return registry.filter(function(c) { return !c.when || c.when(); });
    }

    /** "/tag photos" -> { name: "tag", arg: "photos" } */
    function parse(text) {
        var raw = String(text || '').trim();
        if (raw.charAt(0) !== '/') return null;
        var body = raw.slice(1);
        var space = body.indexOf(' ');
        return space === -1
            ? { name: body.toLowerCase(), arg: '' }
            : { name: body.slice(0, space).toLowerCase(), arg: body.slice(space + 1).trim() };
    }

    /** Commands whose name starts with the partial the user has typed. */
    function matching(partial) {
        var name = (partial || '').toLowerCase();
        return available().filter(function(c) {
            return c.name.indexOf(name) === 0;
        });
    }

    function run(text) {
        var parsed = parse(text);
        if (!parsed) return false;

        var found = available().filter(function(c) { return c.name === parsed.name; })[0];
        if (!found) return { ok: false, message: 'No such code: /' + parsed.name };

        if (found.arg && !parsed.arg) {
            return { ok: false, message: '/' + found.name + ' needs a ' + found.arg };
        }

        var result = found.run(parsed.arg);
        return { ok: true, message: typeof result === 'string' ? result : '' };
    }

    // ------------------------------------------------------------------
    // Palette
    //
    // Built by script rather than markup so any search input on any page
    // gets one without a template knowing about commands.
    // ------------------------------------------------------------------
    function paletteFor(input) {
        var existing = input.parentNode.querySelector('.yolo-palette');
        if (existing) return existing;

        var el = document.createElement('div');
        el.className = 'yolo-palette';
        el.setAttribute('role', 'listbox');
        el.hidden = true;
        input.parentNode.insertBefore(el, input.nextSibling);
        return el;
    }

    function renderPalette(el, commands, note) {
        if (note) {
            el.innerHTML = '<p class="yolo-palette-note">' + note + '</p>';
            el.hidden = false;
            return;
        }
        if (!commands.length) {
            el.innerHTML = '<p class="yolo-palette-note">No matching function code</p>';
            el.hidden = false;
            return;
        }

        el.innerHTML = commands.map(function(c, i) {
            return '<div class="yolo-palette-row' + (i === 0 ? ' is-first' : '') + '">' +
                '<code class="yolo-palette-code">/' + c.name +
                (c.arg ? ' &lt;' + c.arg + '&gt;' : '') + '</code>' +
                '<span class="yolo-palette-desc">' + c.describe + '</span>' +
            '</div>';
        }).join('');
        el.hidden = false;
    }

    function attach(input) {
        if (!input || input.dataset.commandsAttached) return;
        input.dataset.commandsAttached = 'true';

        var palette = paletteFor(input);

        function close() {
            palette.hidden = true;
            palette.innerHTML = '';
        }

        input.addEventListener('input', function() {
            var parsed = parse(input.value);
            if (!parsed) return close();
            // Show what is reachable from what has been typed so far.
            renderPalette(palette, matching(parsed.name));
        });

        input.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !palette.hidden) {
                close();
                return;
            }
            if (e.key !== 'Enter') return;

            var parsed = parse(input.value);
            if (!parsed) return;

            // Enter on a partial name runs the only thing it can mean.
            var candidates = matching(parsed.name);
            if (!parsed.arg && candidates.length === 1 && candidates[0].name !== parsed.name) {
                input.value = '/' + candidates[0].name;
            }

            e.preventDefault();
            var outcome = run(input.value);

            if (outcome && outcome.ok) {
                input.value = '';
                if (outcome.message) renderPalette(palette, [], outcome.message);
                else close();
            } else if (outcome) {
                renderPalette(palette, [], outcome.message);
            }
        });

        // A click anywhere else puts the palette away.
        document.addEventListener('click', function(e) {
            if (e.target !== input && !palette.contains(e.target)) close();
        });
    }

    // ------------------------------------------------------------------
    // Codes that work anywhere
    // ------------------------------------------------------------------
    function go(url) { if (url) window.location.href = url; }
    // Named openExternal, not open, so it cannot be mistaken for window.open.
    function openExternal(url) { if (url) window.open(url, '_blank', 'noopener'); }

    /**
     * Every registered code, whether or not it applies here.
     *
     * The palette only ever offers what will work on this page, but the
     * reference page has to show the whole set, including the codes that
     * need an index of posts. Each entry says which it is.
     */
    function listAll() {
        return registry.map(function(c) {
            return {
                name: c.name,
                arg: c.arg || '',
                describe: c.describe,
                context: c.context || 'anywhere',
                availableHere: !c.when || c.when()
            };
        });
    }

    /**
     * Fill an element with the full reference. Used by the /commands page, so
     * the page can never drift from the registry the way a hand-written list
     * would.
     */
    function renderReference(el) {
        if (!el) return;
        var groups = {};
        listAll().filter(function(c) {
            // Index codes are listed even though this page has no index -
            // they exist, they just work elsewhere. A profile code that has
            // no profile configured does not exist on this site at all, so
            // listing it would be advertising something that does nothing.
            return c.availableHere || c.context === 'index';
        }).forEach(function(c) {
            (groups[c.context] = groups[c.context] || []).push(c);
        });

        el.innerHTML = Object.keys(groups).map(function(context) {
            var rows = groups[context].map(function(c) {
                return '<tr>' +
                    '<td><code>/' + c.name + (c.arg ? ' &lt;' + c.arg + '&gt;' : '') + '</code></td>' +
                    '<td>' + c.describe + '</td>' +
                '</tr>';
            }).join('');

            return '<h3 class="no-toc">' +
                (context === 'index' ? 'On the index' : 'Anywhere') + '</h3>' +
                (context === 'index'
                    ? '<p>These need a list of posts, so they work on the index page.</p>'
                    : '') +
                '<table class="command-reference"><tbody>' + rows + '</tbody></table>';
        }).join('');
    }

    function setMode(mode) {
        var root = document.documentElement;
        root.removeAttribute(mode === 'dark' ? 'light' : 'dark');
        root.setAttribute(mode, '');
        localStorage.setItem('theme', mode);
        var toggle = document.getElementById('theme-toggle');
        if (toggle) toggle.textContent = mode === 'dark' ? 'light_mode' : 'dark_mode';
        document.dispatchEvent(new CustomEvent('yolo:themechange', { detail: { mode: mode } }));
    }

    register({ name: 'home', describe: 'Go to the home page', run: function() { go(config.home || '/'); } });

    register({
        name: 'commands',
        describe: 'Open the function code reference',
        run: function() { go(config.commandsUrl || '/commands/'); }
    });

    ['github', 'linkedin', 'instagram'].forEach(function(site) {
        register({
            name: site,
            describe: 'Open ' + site.charAt(0).toUpperCase() + site.slice(1) + ' profile',
            // Hidden unless the site actually has that profile configured, so
            // the palette never offers a code that goes nowhere.
            when: function() { return !!(config.profiles && config.profiles[site]); },
            run: function() { openExternal(config.profiles[site]); }
        });
    });

    register({ name: 'dark', describe: 'Enable dark mode', run: function() { setMode('dark'); } });
    register({ name: 'light', describe: 'Enable light mode', run: function() { setMode('light'); } });

    register({
        name: 'focus',
        describe: 'Hide everything but the writing',
        run: function() { document.body.classList.add('yolo-focus'); }
    });

    register({
        name: 'unfocus',
        describe: 'Leave distraction-free mode',
        run: function() { document.body.classList.remove('yolo-focus'); }
    });

    // Transient line under the input, for codes that act rather than navigate.
    function announce(message) {
        var palette = document.querySelector('.yolo-palette');
        if (!palette) return;
        renderPalette(palette, [], message);
        setTimeout(function() { palette.hidden = true; palette.innerHTML = ''; }, 2500);
    }

    window.YoloCommands = {
        register: register,
        run: run,
        parse: parse,
        matching: matching,
        list: available,
        attach: attach,
        announce: announce,
        listAll: listAll,
        renderReference: renderReference
    };

    /**
     * The command line's own shortcut.
     *
     * Pressing / anywhere focuses the search box and starts a code, the way
     * / opens search on sites people already use. It puts the slash in the
     * field itself rather than letting the keystroke through, so the palette
     * opens on the first press instead of needing a second one.
     *
     * The key is only taken when it would otherwise do nothing: never while
     * someone is typing into a field, and never with a modifier held, where
     * it may belong to the browser.
     */
    function isTyping(el) {
        if (!el) return false;
        if (el.isContentEditable) return true;
        var tag = el.tagName;
        return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
    }

    function bindSlashShortcut() {
        document.addEventListener('keydown', function(e) {
            if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
            if (isTyping(document.activeElement)) return;

            // The index's own box first, then the page search.
            var input = document.getElementById('hub-search') ||
                        document.getElementById('search-input');
            if (!input) return;

            e.preventDefault();
            input.focus();
            input.value = '/';
            input.dispatchEvent(new Event('input', { bubbles: true }));
        });
    }

    YoloUtils.domReady(function() {
        document.querySelectorAll('.search-input').forEach(attach);
        renderReference(document.getElementById('command-reference'));
        bindSlashShortcut();
    });
})();
