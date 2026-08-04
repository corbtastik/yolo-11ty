#!/usr/bin/env node
/**
 * Yolo Site Generator
 * Creates a new blank Yolo single-page site from the template
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

// ANSI colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m'
};

const log = {
  info: (msg) => console.log(`${colors.cyan}${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.bright}${colors.magenta}${msg}${colors.reset}\n`)
};

// Available themes (subset of popular ones)
const themes = [
  'star-lord',
  'material-blue',
  'material-purple',
  'material-teal',
  'material-gray',
  'matrix-green',
  'chroma-blue',
  'chroma-violet',
  'monochrome',
  'abyssal',
  'amethyst'
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question, defaultValue = '') {
  const defaultHint = defaultValue ? ` (${defaultValue})` : '';
  return new Promise((resolve) => {
    rl.question(`${colors.cyan}${question}${defaultHint}: ${colors.reset}`, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function main() {
  const yoloDir = path.resolve(__dirname, '..');
  const parentDir = path.dirname(yoloDir);

  log.header('Yolo Site Generator');
  log.info('Create a new single-page site from the Yolo template\n');

  // Gather user input
  const siteName = await prompt('Site name', 'my-yolo-site');
  const siteSlug = slugify(siteName);
  const siteDir = path.join(parentDir, siteSlug);

  // Check if directory already exists
  if (fs.existsSync(siteDir)) {
    log.error(`\nDirectory already exists: ${siteDir}`);
    log.warn('Please choose a different name or remove the existing directory.');
    rl.close();
    process.exit(1);
  }

  const title = await prompt('Site title', siteName);
  const description = await prompt('Description', 'A loveable single page');
  const author = await prompt('Author', '');

  console.log(`\n${colors.cyan}Available themes:${colors.reset}`);
  themes.forEach((t, i) => console.log(`  ${i + 1}. ${t}`));
  const themeChoice = await prompt('\nTheme (name or number)', 'star-lord');

  // Parse theme choice
  let theme = themeChoice;
  const themeNum = parseInt(themeChoice);
  if (!isNaN(themeNum) && themeNum >= 1 && themeNum <= themes.length) {
    theme = themes[themeNum - 1];
  }
  if (!themes.includes(theme)) {
    log.warn(`Theme "${theme}" not in list, using anyway (make sure it exists)`);
  }

  const enableEmoji = await prompt('Enable emoji support? (y/n)', 'y');
  const emoji = enableEmoji.toLowerCase() === 'y';

  // Confirm
  log.header('Site Configuration');
  console.log(`  Directory:   ${siteDir}`);
  console.log(`  Title:       ${title}`);
  console.log(`  Description: ${description}`);
  console.log(`  Author:      ${author || '(not set)'}`);
  console.log(`  Theme:       ${theme}`);
  console.log(`  Emoji:       ${emoji ? 'enabled' : 'disabled'}`);

  const confirm = await prompt('\nCreate site? (y/n)', 'y');
  if (confirm.toLowerCase() !== 'y') {
    log.warn('\nAborted.');
    rl.close();
    process.exit(0);
  }

  // Create the site
  log.header('Creating site...');

  try {
    // Create directory structure
    fs.mkdirSync(siteDir);
    fs.mkdirSync(path.join(siteDir, 'src'));
    fs.mkdirSync(path.join(siteDir, 'src', '_data'));
    fs.mkdirSync(path.join(siteDir, 'src', '_includes'));
    fs.mkdirSync(path.join(siteDir, 'src', 'assets'));
    fs.mkdirSync(path.join(siteDir, 'src', 'assets', 'images'));
    fs.mkdirSync(path.join(siteDir, 'src', 'css'));
    fs.mkdirSync(path.join(siteDir, 'scripts'));

    // Copy core files
    const filesToCopy = [
      '.eleventy.js',
      '.gitignore',
      'scripts/build-scss.js',
      'scripts/generate-themes.js',
      'src/css/main.scss.njk',
      'src/css/brand.scss.njk',
      'src/site.json.njk',
      'src/themes.json.njk'
    ];

    for (const file of filesToCopy) {
      const src = path.join(yoloDir, file);
      const dest = path.join(siteDir, file);
      if (fs.existsSync(src)) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(src, dest);
        log.info(`  Copied: ${file}`);
      }
    }

    // Copy _sass directory
    const sassDir = path.join(yoloDir, 'src', '_sass');
    if (fs.existsSync(sassDir)) {
      copyDirSync(sassDir, path.join(siteDir, 'src', '_sass'));
      log.info('  Copied: src/_sass/');
    }

    // Copy _includes directory (layouts and components)
    const includesDir = path.join(yoloDir, 'src', '_includes');
    if (fs.existsSync(includesDir)) {
      // Copy layouts
      const layoutsDir = path.join(includesDir, 'layouts');
      if (fs.existsSync(layoutsDir)) {
        copyDirSync(layoutsDir, path.join(siteDir, 'src', '_includes', 'layouts'));
        log.info('  Copied: src/_includes/layouts/');
      }
      // Copy components (required by layouts)
      const componentsDir = path.join(includesDir, 'components');
      if (fs.existsSync(componentsDir)) {
        copyDirSync(componentsDir, path.join(siteDir, 'src', '_includes', 'components'));
        log.info('  Copied: src/_includes/components/');
      }
    }

    // Copy assets/js directory (core JavaScript)
    const jsDir = path.join(yoloDir, 'src', 'assets', 'js');
    if (fs.existsSync(jsDir)) {
      copyDirSync(jsDir, path.join(siteDir, 'src', 'assets', 'js'));
      log.info('  Copied: src/assets/js/');
    }

    // Copy _data directory (except settings.yml which we'll create fresh)
    const dataDir = path.join(yoloDir, 'src', '_data');
    if (fs.existsSync(dataDir)) {
      const dataFiles = fs.readdirSync(dataDir);
      for (const file of dataFiles) {
        if (file !== 'settings.yml') {
          const src = path.join(dataDir, file);
          const dest = path.join(siteDir, 'src', '_data', file);
          if (fs.statSync(src).isFile()) {
            fs.copyFileSync(src, dest);
            log.info(`  Copied: src/_data/${file}`);
          }
        }
      }
    }

    // Create settings.yml
    const settings = `# -----------------------------------------------------------------------------
# Site settings
# -----------------------------------------------------------------------------
baseurl: ""
name: ${title}
version: v1.0
title: ${title}
description: ${description}
${author ? `author: ${author}\n` : ''}brand:
  theme: ${theme}
  syntax: ${theme}
  emoji: ${emoji}
align: left
`;
    fs.writeFileSync(path.join(siteDir, 'src', '_data', 'settings.yml'), settings);
    log.info('  Created: src/_data/settings.yml');

    // Create index.md
    const indexContent = `---
layout: default
---

# ${title}

${description}

---

## Getting Started

Edit this file at \`src/index.md\` to customize your page.

### Features

- Single page site built with [Eleventy](https://www.11ty.dev/)
- Multiple color themes
- Light/dark mode toggle
- Responsive design
- Syntax highlighting

---

*Built with [Yolo](https://github.com/corbtastik/yolo-11ty)*
`;
    fs.writeFileSync(path.join(siteDir, 'src', 'index.md'), indexContent);
    log.info('  Created: src/index.md');

    // Create 404.md
    const notFoundContent = `---
layout: layouts/default.njk
permalink: /404.html
---

# Page Not Found

The page you're looking for doesn't exist.

[Go back home](/)
`;
    fs.writeFileSync(path.join(siteDir, 'src', '404.md'), notFoundContent);
    log.info('  Created: src/404.md');

    // Create package.json
    const packageJson = {
      name: siteSlug,
      version: '1.0.0',
      description: description,
      main: '.eleventy.js',
      scripts: {
        'build:11ty': 'eleventy',
        'build:scss': 'node scripts/build-scss.js',
        'build': 'npm run build:11ty && npm run build:scss',
        'serve': 'npm run build && eleventy --serve',
        'clean': 'rm -rf _site',
        'generate:themes': 'node scripts/generate-themes.js'
      },
      keywords: ['eleventy', '11ty', 'static-site', 'single-page'],
      author: author,
      license: 'MIT',
      dependencies: {
        '@11ty/eleventy': '^3.1.6',
        'js-yaml': '^4.1.0',
        'markdown-it': '^14.0.0',
        'markdown-it-attrs': '^4.1.6',
        'sass': '^1.69.0'
      }
    };
    fs.writeFileSync(
      path.join(siteDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
    log.info('  Created: package.json');

    // Create README
    const readme = `# ${title}

${description}

## Quick Start

\`\`\`bash
npm install
npm run serve
\`\`\`

Open http://localhost:8080 in your browser.

## Commands

- \`npm run serve\` - Start development server
- \`npm run build\` - Build for production
- \`npm run clean\` - Remove build output

## Customization

- Edit \`src/index.md\` for page content
- Edit \`src/_data/settings.yml\` for site settings
- Change theme in settings.yml (\`brand.theme\`)

## Learn More

- [Yolo Documentation](https://github.com/corbtastik/yolo-11ty)
- [Eleventy](https://www.11ty.dev/)
`;
    fs.writeFileSync(path.join(siteDir, 'README.md'), readme);
    log.info('  Created: README.md');

    log.success('\nSite created successfully!');
    log.header('Next Steps');
    console.log(`  cd ${siteSlug}`);
    console.log('  npm install');
    console.log('  npm run serve');
    console.log(`\n  Then open http://localhost:8080\n`);

  } catch (err) {
    log.error(`\nError creating site: ${err.message}`);
    process.exit(1);
  }

  rl.close();
}

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

main();
