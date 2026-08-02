const sass = require('sass');
const fs = require('fs');
const path = require('path');

const siteDir = path.join(__dirname, '..', '_site');
const cssDir = path.join(siteDir, 'css');
const sassDir = path.join(__dirname, '..', 'src', '_sass');

// Files to compile
const scssFiles = ['main.scss', 'brand.scss'];

function compileScss() {
  // Ensure directories exist
  if (!fs.existsSync(cssDir)) {
    console.log('CSS directory not found, skipping SCSS build');
    return;
  }

  scssFiles.forEach(file => {
    const inputPath = path.join(cssDir, file);
    const outputPath = path.join(cssDir, file.replace('.scss', '.css'));
    const mapPath = outputPath + '.map';

    if (!fs.existsSync(inputPath)) {
      console.log(`Skipping ${file} - not found`);
      return;
    }

    try {
      console.log(`Compiling ${file}...`);

      const result = sass.compile(inputPath, {
        loadPaths: [sassDir],
        style: 'expanded',
        sourceMap: true,
        sourceMapIncludeSources: true
      });

      // Write CSS
      let css = result.css;
      css += `\n/*# sourceMappingURL=${path.basename(mapPath)} */\n`;
      fs.writeFileSync(outputPath, css);

      // Write source map
      if (result.sourceMap) {
        fs.writeFileSync(mapPath, JSON.stringify(result.sourceMap));
      }

      // Remove the intermediate .scss file
      fs.unlinkSync(inputPath);

      console.log(`  -> ${outputPath}`);
    } catch (err) {
      console.error(`Error compiling ${file}:`, err.message);
      process.exit(1);
    }
  });

  console.log('SCSS compilation complete!');
}

compileScss();
