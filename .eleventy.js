const yaml = require("js-yaml");
const markdownIt = require("markdown-it");
const markdownItAttrs = require("markdown-it-attrs");

module.exports = function(eleventyConfig) {
  // -------------------------------------------------------------------------
  // Global Data - Build Info
  // -------------------------------------------------------------------------
  const buildDate = new Date();
  eleventyConfig.addGlobalData("build", {
    date: buildDate.toISOString().replace('T', ' ').substring(0, 16)
  });

  // -------------------------------------------------------------------------
  // YAML Data Support
  // -------------------------------------------------------------------------
  eleventyConfig.addDataExtension("yml,yaml", contents => yaml.load(contents));

  // -------------------------------------------------------------------------
  // Markdown Configuration
  // -------------------------------------------------------------------------
  const md = markdownIt({
    html: true,
    breaks: false,
    linkify: true,
    typographer: false
  }).use(markdownItAttrs, {
    leftDelimiter: '{:',
    rightDelimiter: '}',
    allowedAttributes: ['id', 'class', /^data-.*$/]
  });

  // Custom renderer for code blocks to match Jekyll/Rouge output structure
  md.renderer.rules.fence = function(tokens, idx, options, env, self) {
    const token = tokens[idx];
    const lang = token.info.trim() || '';
    const code = md.utils.escapeHtml(token.content);

    // Match Jekyll's highlighter-rouge structure
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

  // relative_url - prepend baseurl
  eleventyConfig.addFilter("relative_url", function(url) {
    const baseurl = this.ctx.settings?.baseurl || "";
    if (!url) return baseurl || "/";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const cleanBase = baseurl.replace(/\/$/, "");
    const cleanUrl = url.startsWith("/") ? url : "/" + url;
    return cleanBase + cleanUrl;
  });

  // date filter - strftime-style formatting
  eleventyConfig.addFilter("date", function(date, format) {
    const d = date === "now" ? new Date() : new Date(date);
    if (!format) return d.toISOString();

    // Common strftime patterns
    const pad = (n) => String(n).padStart(2, '0');
    return format
      .replace(/%Y/g, d.getFullYear())
      .replace(/%m/g, pad(d.getMonth() + 1))
      .replace(/%d/g, pad(d.getDate()))
      .replace(/%H/g, pad(d.getHours()))
      .replace(/%M/g, pad(d.getMinutes()))
      .replace(/%S/g, pad(d.getSeconds()));
  });

  // replace filter
  eleventyConfig.addFilter("replace", function(str, search, replace) {
    if (!str) return "";
    return str.split(search).join(replace);
  });

  // remove filter
  eleventyConfig.addFilter("remove", function(str, search) {
    if (!str) return "";
    return str.split(search).join("");
  });

  // split filter
  eleventyConfig.addFilter("split", function(str, sep) {
    if (!str) return [];
    return str.split(sep);
  });

  // default filter
  eleventyConfig.addFilter("default", function(val, defaultVal) {
    return val ?? defaultVal;
  });

  // Math filters
  eleventyConfig.addFilter("minus", (a, b) => a - b);
  eleventyConfig.addFilter("plus", (a, b) => a + b);
  eleventyConfig.addFilter("times", (a, b) => a * b);
  eleventyConfig.addFilter("divided_by", (a, b) => Math.floor(a / b));

  // size filter (for arrays and strings)
  eleventyConfig.addFilter("size", function(val) {
    if (!val) return 0;
    return val.length;
  });

  // -------------------------------------------------------------------------
  // Shortcodes
  // -------------------------------------------------------------------------

  // arrow shortcode
  eleventyConfig.addShortcode("arrow", function(link) {
    const href = link || "#";
    return `<a href="${href}" class="yolo-to-top">
    <span class="material-icons md-36">keyboard_double_arrow_up</span>
</a>`;
  });

  // code shortcode (code header with copy button)
  // Note: trailing newlines ensure markdown code fences after this shortcode render correctly
  eleventyConfig.addShortcode("code", function(label = "") {
    return `<div class="yolo-code-header">
    <span class="code-label">${label}</span>
    <span class="copy-icon material-icons md-24">copy_all</span>
</div>

`;
  });

  // toc shortcode
  eleventyConfig.addShortcode("toc", function(header = "h2", text = "Table of Contents") {
    return `<${header} id="table-of-contents" class="no-toc">${text}</${header}>
<div id="toc"></div>`;
  });

  // video shortcode
  eleventyConfig.addShortcode("video", function() {
    const videos = this.ctx.videos || [];
    let html = "";
    if (videos[0]) {
      html += `<div class="yolo-video">
    <iframe src="${videos[0].src}"></iframe>
    <p>${videos[0].description}</p>
</div>`;
    }
    if (videos[1]) {
      html += `\n<div class="yolo-video">
    <iframe src="${videos[1].src}"></iframe>
    <p>${videos[1].description}</p>
</div>`;
    }
    return html;
  });

  // prezo shortcode
  eleventyConfig.addShortcode("prezo", function(title, dataFile = "prezos", aspectRatio = "is-16-by-9") {
    const prezos = this.ctx[dataFile] || [];
    for (const prezo of prezos) {
      if (prezo.title === title) {
        return `<strong>${prezo.description}</strong>
<div class="yolo-prezo-container ${aspectRatio}">
    <iframe class="yolo-prezo-iframe" src="${prezo.src}"></iframe>
</div>`;
      }
    }
    return "";
  });

  // image shortcode
  eleventyConfig.addShortcode("image", function(params = {}) {
    const imageData = params["image-data"] || params.imageData || "images";
    const images = this.ctx[imageData] || [];
    const name = params.name;
    const classes = params.classes || "";
    const src = params.src || "";
    const description = params.description || "";

    let sourceImage = null;
    if (name) {
      for (const image of images) {
        if (image.name === name) {
          sourceImage = image;
          break;
        }
      }
    }

    if (sourceImage) {
      if (sourceImage.description) {
        return `<figure class="${classes}">
  <img class="image ${classes}" alt="${sourceImage.description}" src="${sourceImage.src}">
  <figcaption>${sourceImage.description}</figcaption>
</figure>`;
      } else {
        return `<img class="image ${classes}" alt="${sourceImage.name}" src="${sourceImage.src}">`;
      }
    } else {
      if (description) {
        return `<figure>
  <img class="image ${classes}" alt="${description}" src="${src}">
  <figcaption>${description}</figcaption>
</figure>`;
      } else {
        return `<img class="image ${classes}" alt="${src}" src="${src}">`;
      }
    }
  });

  // imageGrid shortcode
  eleventyConfig.addShortcode("imageGrid", function(igData, igColumns) {
    igData = igData || "ig-images";
    igColumns = igColumns || 4;
    const igImages = this.ctx[igData] || [];
    const igNumImages = igImages.length;
    const igImagesPerColumn = Math.floor(igNumImages / igColumns);

    let html = `<!-- The image grid -->
<div id="ig-${igData}">
    <div class="columns is-mobile">`;

    for (let i = 0; i < igColumns; i++) {
      html += `\n        <div id="${igData}-${i}" class="column">`;
      for (let j = 0; j < igImagesPerColumn; j++) {
        const idx = i * igImagesPerColumn + j;
        const igImage = igImages[idx];
        if (igImage) {
          html += `\n            <img class="image square"
                 onclick="Yolo.imageGrid('${igData}').openImage('${igData}-image-${idx}');"
                 alt="${igImage.description || ''}"
                 src="${igImage.src}">`;
        }
      }
      html += `\n        </div>`;
    }

    html += `\n    </div>
</div>
<div id="ig-target-${igData}" class="no-display">
    <div class="columns is-mobile">
        <div id="${igData}-target-column" class="column">`;

    for (let i = 0; i < igNumImages; i++) {
      const igImage = igImages[i];
      if (igImage) {
        html += `\n            <img id="${igData}-image-${i}" class="image square"
                 onclick="Yolo.imageGrid('${igData}').closeImage('${igData}-image-${i}');"
                 alt="${igImage.description || ''}"
                 src="${igImage.src}">
            <div id="${igData}-caption-${i}" class="yolo-caption">
                <p>${igImage.description || ''}</p>
            </div>`;
      }
    }

    html += `\n        </div>
    </div>
</div>`;

    return html;
  });

  // lightbox shortcode
  eleventyConfig.addShortcode("lightbox", function(lbData) {
    lbData = lbData || "lb-images";
    const lbImages = this.ctx[lbData] || [];
    const lbNumImages = lbImages.length;
    const lbImagesPerColumn = Math.floor(lbNumImages / 4);

    let html = `<!-- The lb flexbox -->
<div class="columns is-mobile">`;

    for (let i = 0; i < 4; i++) {
      html += `\n    <div class="column">`;
      for (let j = 0; j < lbImagesPerColumn; j++) {
        const idx = i * lbImagesPerColumn + j;
        const lbImage = lbImages[idx];
        if (lbImage) {
          html += `\n        <img class="lb-square lb-hover-shadow"
             onclick="Yolo.lightbox('${lbData}').openModal();Yolo.lightbox('${lbData}').currentSlide(${idx});"
             alt="${lbImage.description || ''}"
             src="${lbImage.src}">`;
        }
      }
      html += `\n    </div>`;
    }

    html += `\n</div>
<!-- The lb-modal -->
<div id="lb-modal-${lbData}" class="lb-modal">
    <span class="lb-close" onclick="Yolo.lightbox('${lbData}').closeModal();">&times;</span>
    <div class="lb-container is-mobile">
        <div class="lb-modal-content">`;

    for (const lbImage of lbImages) {
      html += `\n            <div class="lb-slides">
                <img class="lb-item center"
                     alt="${lbImage.description || ''}"
                     src="${lbImage.src}">
            </div>`;
    }

    html += `\n            <!-- Next/previous controls -->
            <a class="lb-nav lb-prev" onclick="Yolo.lightbox('${lbData}').plusSlides(-1);">&#10094;</a>
            <a class="lb-nav lb-next" onclick="Yolo.lightbox('${lbData}').plusSlides(1);">&#10095;</a>
        </div>
        <!-- Caption text -->
        <div class="yolo-caption">
            <p id="lb-caption-${lbData}"></p>
        </div>
    </div>
</div>`;

    return html;
  });

  // flexbox shortcode
  eleventyConfig.addShortcode("flexbox", function(columns = 1, fill = "") {
    let html = '<div class="columns">';
    for (let i = 1; i <= columns; i++) {
      html += '\n    <div class="column">';
      if (fill) {
        html += `\n        <div class="cell ${fill}">${fill}</div>`;
      } else {
        html += `\n        <div class="cell accent-color">${i}</div>`;
      }
      html += '\n    </div>';
    }
    html += '\n</div>';
    return html;
  });

  // -------------------------------------------------------------------------
  // Directory Configuration
  // -------------------------------------------------------------------------
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
