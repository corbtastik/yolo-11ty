const yaml = require("js-yaml");
const markdownIt = require("markdown-it");
const markdownItAttrs = require("markdown-it-attrs");
const { execSync } = require("child_process");

module.exports = function(eleventyConfig) {
  // -------------------------------------------------------------------------
  // Global Data - Build Info
  // -------------------------------------------------------------------------
  let gitTag = "dev";
  try { gitTag = execSync("git describe --tags --abbrev=0", { encoding: "utf8" }).trim(); } catch (e) {}
  eleventyConfig.addGlobalData("build", {
    version: gitTag,
    date: new Date().toISOString().replace('T', ' ').substring(0, 16)
  });

  // -------------------------------------------------------------------------
  // YAML Data Support
  // -------------------------------------------------------------------------
  eleventyConfig.addDataExtension("yml,yaml", contents => yaml.load(contents));

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
  // Passthrough Copy
  // -------------------------------------------------------------------------
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy({ "src/_sass": "_sass" });

  // -------------------------------------------------------------------------
  // Filters
  // -------------------------------------------------------------------------
  eleventyConfig.addFilter("relative_url", function(url) {
    const base = (this.ctx.settings?.baseurl || "").replace(/\/$/, "");
    if (!url) return base || "/";
    if (url.startsWith("http")) return url;
    return base + (url.startsWith("/") ? url : "/" + url);
  });

  eleventyConfig.addFilter("date", function(date, format) {
    const d = date === "now" ? new Date() : new Date(date);
    if (!format) return d.toISOString();
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const pad = n => String(n).padStart(2, '0');
    const y = d.getUTCFullYear(), m = d.getUTCMonth(), day = d.getUTCDate();
    const h = d.getUTCHours(), min = d.getUTCMinutes(), s = d.getUTCSeconds();

    if (format.includes('MMMM') || format.includes('YYYY')) {
      return format.replace(/YYYY/g, y).replace(/MMMM/g, months[m]).replace(/MM/g, pad(m+1)).replace(/DD/g, pad(day)).replace(/D/g, day);
    }
    return format.replace(/%Y/g, y).replace(/%m/g, pad(m+1)).replace(/%d/g, pad(day)).replace(/%H/g, pad(h)).replace(/%M/g, pad(min)).replace(/%S/g, pad(s));
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
    const perCol = Math.floor(images.length / columns);
    let grid = `<div class="columns is-mobile">`;

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
    return `<div id="ig-${name}">${galleryHtml('ig', name, images, columns)}</div>`;
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
