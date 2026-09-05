/**
 * Copy-to-clipboard for code snippets.
 *
 * Each {% code %} shortcode emits a .yolo-code-header immediately followed by
 * the highlighted block. Clicking the header copies that block's text.
 */
(function() {
    'use strict';

    function flash(header, message) {
        if (header.classList.contains('copied')) return;
        var original = header.innerHTML;
        header.classList.add('copied');
        header.innerHTML = original + ' ' + message;
        setTimeout(function() {
            header.innerHTML = original;
            header.classList.remove('copied');
        }, 2000);
    }

    function init() {
        document.querySelectorAll('.yolo-code-header').forEach(function(header) {
            // Walk to the adjacent block rather than pairing headers and blocks
            // by index: one header without a block would shift every later pair.
            var block = header.nextElementSibling;
            if (!block || !block.classList.contains('highlighter-rouge')) return;

            header.addEventListener('click', function() {
                navigator.clipboard.writeText(block.innerText).then(function() {
                    flash(header, 'copied!');
                }, function(error) {
                    YoloUtils.error('Copy failed: ' + error.message);
                    flash(header, 'copy failed');
                });
            });
        });
    }

    YoloUtils.domReady(init);
})();
