const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const sass = require("sass");
const nunjucks = require("nunjucks");
const markdownIt = require("markdown-it");
const markdownItAttrs = require("markdown-it-attrs");
const { execSync } = require("child_process");

// Shared with the browser - see the header of src/assets/ext/js/theme-vars.js.
const themeVars = require("./src/assets/ext/js/theme-vars.js");
const themesById = themeVars.byId(require("./src/_data/themes.json"));

const SASS_INCLUDES = path.join(__dirname, "src", "_sass");
const DEFAULT_THEME = "yolo";

module.exports = function(eleventyConfig) {
  // -------------------------------------------------------------------------
  // Global Data - Build Info
  // -------------------------------------------------------------------------
  // Match only version tags, so working tags (checkpoints, anchors) never end
  // up displayed as the site version in the footer.
  let gitTag = "dev";
  try {
    gitTag = execSync("git describe --tags --abbrev=0 --match 'v[0-9]*'", { encoding: "utf8" }).trim();
  } catch (e) {}
  eleventyConfig.addGlobalData("build", {
    version: gitTag,
    date: new Date().toISOString().replace('T', ' ').substring(0, 16)
  });

  // -------------------------------------------------------------------------
  // YAML Data Support
  // -------------------------------------------------------------------------
  eleventyConfig.addDataExtension("yml,yaml", contents => yaml.load(contents));

  // -------------------------------------------------------------------------
  // Collections
  // -------------------------------------------------------------------------

  // Post metadata for the hub index, derived from each post's own front matter
  // so there is a single source of truth.
  //
  // Order: posts with `pinned: true` first (in date order among themselves),
  // then everything else oldest-first - the reading order the docs are written
  // in, which is Eleventy's natural collection order.
  eleventyConfig.addCollection("hubPosts", collectionApi =>
    collectionApi.getFilteredByTag("post")
      .map(post => ({
        pinned: post.data.pinned === true,
        title: post.data.title || "",
        description: post.data.description || "",
        url: post.url,
        date: post.date.toISOString().substring(0, 10),
        tags: (post.data.tags || []).filter(tag => tag !== "post")
      }))
      .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
      .map(({ pinned, ...post }) => post)
  );

  // -------------------------------------------------------------------------
  // Markdown Configuration
  // -------------------------------------------------------------------------
  const md = markdownIt({ html: true, breaks: false, linkify: true, typographer: false })
    .use(markdownItAttrs, { leftDelimiter: '{:', rightDelimiter: '}', allowedAttributes: ['id', 'class', /^data-.*$/] });

  md.renderer.rules.fence = function(tokens, idx) {
    const token = tokens[idx];
    const lang = token.info.trim() || '';
    const code = md.utils.escapeHtml(token.content);
    return `<div class="language-${lang} highlighter-rouge"><div class="highlight"><pre class="highlight"><code>${code}</code></pre></div></div>\n`;
  };

  eleventyConfig.setLibrary("md", md);

  // -------------------------------------------------------------------------
  // SCSS Compilation
  //
  // Entry points in src/css are Nunjucks-templated (brand.scss expands the
  // selected theme), then compiled to CSS in the same pass. Partials under
  // src/_sass are pulled in via @use and must not be treated as templates
  // themselves.
  // -------------------------------------------------------------------------
  eleventyConfig.addTemplateFormats("scss");
  eleventyConfig.ignores.add("src/_sass/**");
  eleventyConfig.addWatchTarget("src/_sass/");

  // These templates render outside Eleventy's own Nunjucks environment, so
  // filters they need are registered here. Autoescaping is off because the
  // output is stylesheet text, not markup.
  const scssEnv = new nunjucks.Environment(null, { autoescape: false });

  // Expand the selected theme into CSS custom property declarations for one
  // mode. `brand` is settings.brand; theme and syntax may name different
  // themes, so each is resolved independently.
  scssEnv.addFilter("brandVars", function(brand, mode) {
    const pick = id => {
      const theme = themesById[id];
      if (!theme) throw new Error(
        `Unknown brand theme "${id}". Add it to src/_data/themes.json or pick one of: ` +
        Object.keys(themesById).slice(0, 5).join(", ") + ", ...");
      return theme;
    };
    brand = brand || {};
    const themeColors = pick(brand.theme || DEFAULT_THEME)[mode];
    const syntaxColors = pick(brand.syntax || DEFAULT_THEME)[mode];

    return themeVars.cssVars(themeColors, syntaxColors, mode)
      .map(([name, value]) => `  --${name}: ${value};`)
      .join("\n");
  });

  // Swatch classes for the demo's colour grid, one per syntax token. Generated
  // from the same list that defines the --syntax-* properties so a new token
  // cannot end up with a variable but no class to paint it.
  scssEnv.addGlobal("syntaxSwatchCss", function() {
    return themeVars.SYNTAX_VARS.map(([name]) => {
      // Most names are like "syntax-keyword" and take a "-color" suffix for the
      // class. "syntax-container-color" already ends in -color; it also backs a
      // container rather than a token, so its text defaults light, not dark.
      const isContainer = name.endsWith("-color");
      const cls = isContainer ? name : `${name}-color`;
      const onColor = isContainer ? `${name.replace(/-color$/, "")}-on-color, #fff`
                                  : `${name}-on-color, #000`;
      return `.${cls} {\n  background-color: var(--${name});\n  color: var(--${onColor});\n}`;
    }).join("\n");
  });

  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",
    compile: function(inputContent, inputPath) {
      return function(data) {
        // Resolve {{ settings.* }} before handing the result to sass.
        const scss = scssEnv.renderString(inputContent, data);
        const result = sass.compileString(scss, {
          loadPaths: [SASS_INCLUDES, path.dirname(inputPath)],
          style: "expanded",
          sourceMap: true,
          sourceMapIncludeSources: true
        });

        // Eleventy writes a single file per template, so emit the sibling
        // .map ourselves rather than inlining it into the shipped CSS.
        const outputPath = data.page && data.page.outputPath;
        if (!outputPath || !result.sourceMap) return result.css;

        const mapName = path.basename(outputPath) + ".map";
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(path.join(path.dirname(outputPath), mapName),
          JSON.stringify(result.sourceMap));

        return result.css + `\n/*# sourceMappingURL=${mapName} */\n`;
      };
    }
  });

  // -------------------------------------------------------------------------
  // Passthrough Copy
  // -------------------------------------------------------------------------
  eleventyConfig.addPassthroughCopy("src/assets");

  // -------------------------------------------------------------------------
  // Filters
  // -------------------------------------------------------------------------
  eleventyConfig.addFilter("relative_url", function(url) {
    const base = (this.ctx.settings?.baseurl || "").replace(/\/$/, "");
    if (!url) return base || "/";
    if (url.startsWith("http")) return url;
    return base + (url.startsWith("/") ? url : "/" + url);
  });

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  // Single-pass token replacement. Chained .replace() calls corrupt output when
  // an earlier substitution emits a character a later pattern matches - e.g.
  // MMMM -> "December", then /D/g rewrites it to "15ecember".
  const DATE_TOKENS = /YYYY|MMMM|MMM|MM|DD|D|%Y|%m|%d|%H|%M|%S/g;

  eleventyConfig.addFilter("date", function(date, format) {
    const d = date === "now" ? new Date() : new Date(date);
    if (!format) return d.toISOString();
    const pad = n => String(n).padStart(2, '0');
    const m = d.getUTCMonth();
    const values = {
      YYYY: d.getUTCFullYear(),
      MMMM: MONTHS[m],
      MMM: MONTHS[m].slice(0, 3),
      MM: pad(m + 1),
      DD: pad(d.getUTCDate()),
      D: d.getUTCDate(),
      '%Y': d.getUTCFullYear(),
      '%m': pad(m + 1),
      '%d': pad(d.getUTCDate()),
      '%H': pad(d.getUTCHours()),
      '%M': pad(d.getUTCMinutes()),
      '%S': pad(d.getUTCSeconds())
    };
    return format.replace(DATE_TOKENS, token => values[token]);
  });

  eleventyConfig.addFilter("replace", (str, search, replace) => str ? str.split(search).join(replace) : "");
  eleventyConfig.addFilter("remove", (str, search) => str ? str.split(search).join("") : "");
  eleventyConfig.addFilter("split", (str, sep) => str ? str.split(sep) : []);
  eleventyConfig.addFilter("default", (val, def) => val ?? def);
  eleventyConfig.addFilter("minus", (a, b) => a - b);
  eleventyConfig.addFilter("plus", (a, b) => a + b);
  eleventyConfig.addFilter("times", (a, b) => a * b);
  eleventyConfig.addFilter("divided_by", (a, b) => Math.floor(a / b));
  eleventyConfig.addFilter("size", val => val ? val.length : 0);

  // -------------------------------------------------------------------------
  // Shortcodes
  // -------------------------------------------------------------------------

  // Helper: generate gallery HTML
  function galleryHtml(type, name, images, columns) {
    const prefix = type === 'lb' ? 'lb' : 'ig';
    // ceil, not floor: with floor, a remainder that does not divide evenly across
    // the columns drops the trailing images from the grid entirely (they stayed
    // in the modal, so the data-index values went out of sync with the slides).
    const perCol = Math.max(1, Math.ceil(images.length / columns));

    // ImageGrid.open() hides #ig-<name> to reveal the expanded view, so the
    // wrapper must enclose ONLY the thumbnail grid - if it also contains
    // #ig-target-<name>, hiding it hides the expanded view along with it.
    let grid = type === 'ig' ? `<div id="ig-${name}">` : '';
    grid += `<div class="columns is-mobile">`;

    for (let c = 0; c < columns; c++) {
      grid += `<div class="column">`;
      for (let r = 0; r < perCol; r++) {
        const idx = c * perCol + r;
        const img = images[idx];
        if (img) {
          const cls = type === 'lb' ? 'lb-square lb-hover-shadow' : 'image square';
          grid += `<img class="${cls}" data-gallery="${name}" data-gallery-type="${prefix}" data-action="open" data-index="${idx}" alt="${img.description || ''}" src="${img.src}">`;
        }
      }
      grid += `</div>`;
    }
    grid += `</div>`;
    if (type === 'ig') grid += `</div>`;  // close #ig-<name> before the target

    if (type === 'lb') {
      grid += `<div id="lb-modal-${name}" class="lb-modal">
        <span class="lb-close" data-gallery="${name}" data-gallery-type="lb" data-action="close">&times;</span>
        <div class="lb-container is-mobile"><div class="lb-modal-content">`;
      images.forEach(img => {
        grid += `<div class="lb-slides"><img class="lb-item center" alt="${img.description || ''}" src="${img.src}"></div>`;
      });
      grid += `<a class="lb-nav lb-prev" data-gallery="${name}" data-gallery-type="lb" data-action="prev">&#10094;</a>
        <a class="lb-nav lb-next" data-gallery="${name}" data-gallery-type="lb" data-action="next">&#10095;</a>
        </div><div class="yolo-caption"><p id="lb-caption-${name}"></p></div></div></div>`;
    } else {
      grid += `<div id="ig-target-${name}" class="no-display"><div class="ig-modal-content"><div class="ig-slides">`;
      images.forEach((img, i) => {
        grid += `<img id="${name}-image-${i}" class="image square" data-gallery="${name}" data-gallery-type="ig" data-action="close" alt="${img.description || ''}" src="${img.src}">
          <div id="${name}-caption-${i}" class="yolo-caption"><p>${img.description || ''}</p></div>`;
      });
      grid += `</div>
        <a class="ig-nav ig-prev" data-gallery="${name}" data-gallery-type="ig" data-action="prev">&#10094;</a>
        <a class="ig-nav ig-next" data-gallery="${name}" data-gallery-type="ig" data-action="next">&#10095;</a>
        </div></div>`;
    }

    return grid;
  }

  eleventyConfig.addShortcode("arrow", link =>
    `<a href="${link || '#'}" class="yolo-to-top"><span class="material-icons md-36">keyboard_double_arrow_up</span></a>`);

  eleventyConfig.addShortcode("code", (label = "") =>
    `<div class="yolo-code-header"><span class="code-label">${label}</span><span class="copy-icon material-icons md-24">copy_all</span></div>\n\n`);

  eleventyConfig.addShortcode("toc", (header = "h2", text = "Table of Contents") =>
    `<${header} id="table-of-contents" class="no-toc">${text}</${header}><div id="toc"></div>`);

  eleventyConfig.addShortcode("video", function() {
    const videos = this.ctx.videos || [];
    return videos.slice(0, 2).map(v =>
      `<div class="yolo-video"><iframe src="${v.src}"></iframe><p>${v.description}</p></div>`
    ).join('\n');
  });

  eleventyConfig.addShortcode("prezo", function(title, dataFile = "prezos", aspect = "is-16-by-9") {
    const prezo = (this.ctx[dataFile] || []).find(p => p.title === title);
    if (!prezo) return "";
    return `<strong>${prezo.description}</strong>
      <div class="yolo-prezo-container ${aspect}"><iframe class="yolo-prezo-iframe" src="${prezo.src}"></iframe></div>`;
  });

  eleventyConfig.addShortcode("image", function(params = {}) {
    const images = this.ctx[params.imageData || params["image-data"] || "images"] || [];
    const img = params.name ? images.find(i => i.name === params.name) : null;
    const src = img?.src || params.src || "";
    const desc = img?.description || params.description || "";
    const cls = params.classes || "";

    if (desc) {
      return `<figure class="${cls}"><img class="image ${cls}" alt="${desc}" src="${src}"><figcaption>${desc}</figcaption></figure>`;
    }
    return `<img class="image ${cls}" alt="${src}" src="${src}">`;
  });

  eleventyConfig.addShortcode("imageGrid", function(name, columns) {
    name = name || "ig-images";
    columns = columns || 4;
    const images = this.ctx[name] || [];
    // galleryHtml emits the #ig-<name> wrapper itself, around the grid only.
    return galleryHtml('ig', name, images, columns);
  });

  eleventyConfig.addShortcode("lightbox", function(name) {
    name = name || "lb-images";
    return galleryHtml('lb', name, this.ctx[name] || [], 4);
  });

  eleventyConfig.addShortcode("flexbox", (columns = 1, fill = "") => {
    let html = '<div class="columns">';
    for (let i = 1; i <= columns; i++) {
      const cls = fill || 'accent-color';
      const content = fill || i;
      html += `<div class="column"><div class="cell ${cls}">${content}</div></div>`;
    }
    return html + '</div>';
  });

  // -------------------------------------------------------------------------
  // Directory Configuration
  // -------------------------------------------------------------------------
  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
