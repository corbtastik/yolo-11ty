/**
 * Generate SCSS theme and syntax files from themes.json
 */
const fs = require('fs');
const path = require('path');

// Load themes from JSON
const themesPath = path.join(__dirname, '..', 'src', '_data', 'themes.json');
const themesData = JSON.parse(fs.readFileSync(themesPath, 'utf8'));

const themeDir = path.join(__dirname, '..', 'src', '_sass', 'yolo', 'brand', 'theme');
const syntaxDir = path.join(__dirname, '..', 'src', '_sass', 'yolo', 'brand', 'syntax');

function generateThemeFile(theme) {
  const { id, dark, light } = theme;
  return `// ----------------------------------------------------------------------------
// ${id} font-families
// ----------------------------------------------------------------------------
$font-family-primary: "Space Mono", "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", monospace;
$font-family-secondary: "Montserrat", "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif;
$font-family-monospace: "Source Code Pro", "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", monospace;
// ----------------------------------------------------------------------------
// ${id} light-mode
// ----------------------------------------------------------------------------
$light-primary-color: ${light.bg};
$light-on-primary-color: ${light.text};
$light-primary-container-color: ${light.surface};
$light-on-primary-container-color: ${light.heading};
$light-secondary-color: ${light.heading};
$light-on-secondary-color: ${light.bg};
$light-secondary-container-color: ${light.border};
$light-on-secondary-container-color: ${light.text};
$light-tertiary-color: ${light.primary};
$light-on-tertiary-color: ${light.bg};
$light-link-color: ${light.link};
// ----------------------------------------------------------------------------
// ${id} dark-mode
// ----------------------------------------------------------------------------
$dark-primary-color: ${dark.bg};
$dark-on-primary-color: ${dark.text};
$dark-primary-container-color: ${dark.surface};
$dark-on-primary-container-color: ${dark.heading};
$dark-secondary-color: ${dark.heading};
$dark-on-secondary-color: ${dark.bg};
$dark-secondary-container-color: ${dark.border};
$dark-on-secondary-container-color: ${dark.text};
$dark-tertiary-color: ${dark.primary};
$dark-on-tertiary-color: ${dark.bg};
$dark-link-color: ${dark.link};
`;
}

function generateSyntaxFile(theme) {
  const { id, dark, light } = theme;
  return `// ----------------------------------------------------------------------------
// ${id} light-mode syntax theme
// ----------------------------------------------------------------------------
$light-syntax-text: ${light.text};
$light-syntax-container-color: ${light.surface};
$light-syntax-highlight-line: ${light.primary};
$light-syntax-error: #b71c1c;
$light-syntax-punctuation: ${light.text};
$light-syntax-text-whitespace: ${light.text};
$light-syntax-comment-hashbang: ${light.shComment};
$light-syntax-comment-multiline: ${light.shComment};
$light-syntax-comment-preproc: ${light.shComment};
$light-syntax-comment-preprocfile: ${light.shComment};
$light-syntax-comment-single: ${light.shComment};
$light-syntax-comment-special: ${light.shComment};
$light-syntax-comment: ${light.shComment};
$light-syntax-generic-deleted: #b71c1c;
$light-syntax-generic-emph: ${light.text};
$light-syntax-generic-error: ${light.text};
$light-syntax-generic-heading: ${light.text};
$light-syntax-generic-inserted: ${light.text};
$light-syntax-generic-output: ${light.text};
$light-syntax-generic-prompt: ${light.shKeyword};
$light-syntax-generic-strong: ${light.shKeyword};
$light-syntax-generic-subheading: ${light.text};
$light-syntax-generic-traceback: ${light.text};
$light-syntax-keyword-constant: ${light.shKeyword};
$light-syntax-keyword-declaration: ${light.shKeyword};
$light-syntax-keyword-namespace: ${light.shKeyword};
$light-syntax-keyword-pseudo: ${light.shKeyword};
$light-syntax-keyword-reserved: ${light.shKeyword};
$light-syntax-keyword-type: ${light.shKeyword};
$light-syntax-keyword: ${light.shKeyword};
$light-syntax-literal-date: ${light.text};
$light-syntax-literal: ${light.text};
$light-syntax-name-attribute: ${light.shFunction};
$light-syntax-name-builtin-pseudo: ${light.text};
$light-syntax-name-builtin: ${light.shVariable};
$light-syntax-name-class: ${light.shFunction};
$light-syntax-name-constant: ${light.text};
$light-syntax-name-decorator: ${light.text};
$light-syntax-name-entity: ${light.text};
$light-syntax-name-exception: ${light.text};
$light-syntax-name-function-magic: ${light.shFunction};
$light-syntax-name-function: ${light.shFunction};
$light-syntax-name-label: ${light.shFunction};
$light-syntax-name-namespace: ${light.text};
$light-syntax-name-other: ${light.text};
$light-syntax-name-property: ${light.shFunction};
$light-syntax-name-tag: ${light.shKeyword};
$light-syntax-name-variable-class: ${light.shVariable};
$light-syntax-name-variable-global: ${light.shVariable};
$light-syntax-name-variable-instance: ${light.shVariable};
$light-syntax-name-variable-magic: ${light.shVariable};
$light-syntax-name-variable: ${light.shVariable};
$light-syntax-name: ${light.text};
$light-syntax-number-bin: ${light.shString};
$light-syntax-number-float: ${light.shString};
$light-syntax-number-hex: ${light.shString};
$light-syntax-number-integer-long: ${light.shString};
$light-syntax-number-integer: ${light.shString};
$light-syntax-number-oct: ${light.shString};
$light-syntax-number: ${light.shString};
$light-syntax-operator-word: ${light.shFunction};
$light-syntax-operator: ${light.shFunction};
$light-syntax-string-affix: ${light.shString};
$light-syntax-string-backtick: ${light.shString};
$light-syntax-string-char: ${light.shString};
$light-syntax-string-delimiter: ${light.shString};
$light-syntax-string-doc: ${light.shString};
$light-syntax-string-double: ${light.shString};
$light-syntax-string-escape: ${light.shString};
$light-syntax-string-heredoc: ${light.shString};
$light-syntax-string-interpol: ${light.shString};
$light-syntax-string-other: ${light.shString};
$light-syntax-string-regex: ${light.shString};
$light-syntax-string-single: ${light.shString};
$light-syntax-string-symbol: ${light.shString};
$light-syntax-string: ${light.shString};
// ----------------------------------------------------------------------------
// ${id} dark-mode syntax theme
// ----------------------------------------------------------------------------
$dark-syntax-text: ${dark.text};
$dark-syntax-container-color: ${dark.surface};
$dark-syntax-highlight-line: ${dark.primary};
$dark-syntax-error: #ff5252;
$dark-syntax-punctuation: ${dark.text};
$dark-syntax-text-whitespace: ${dark.text};
$dark-syntax-comment-hashbang: ${dark.shComment};
$dark-syntax-comment-multiline: ${dark.shComment};
$dark-syntax-comment-preproc: ${dark.shComment};
$dark-syntax-comment-preprocfile: ${dark.shComment};
$dark-syntax-comment-single: ${dark.shComment};
$dark-syntax-comment-special: ${dark.shComment};
$dark-syntax-comment: ${dark.shComment};
$dark-syntax-generic-deleted: #ff5252;
$dark-syntax-generic-emph: ${dark.text};
$dark-syntax-generic-error: ${dark.text};
$dark-syntax-generic-heading: ${dark.text};
$dark-syntax-generic-inserted: ${dark.text};
$dark-syntax-generic-output: ${dark.text};
$dark-syntax-generic-prompt: ${dark.shKeyword};
$dark-syntax-generic-strong: ${dark.shKeyword};
$dark-syntax-generic-subheading: ${dark.text};
$dark-syntax-generic-traceback: ${dark.text};
$dark-syntax-keyword-constant: ${dark.shKeyword};
$dark-syntax-keyword-declaration: ${dark.shKeyword};
$dark-syntax-keyword-namespace: ${dark.shKeyword};
$dark-syntax-keyword-pseudo: ${dark.shKeyword};
$dark-syntax-keyword-reserved: ${dark.shKeyword};
$dark-syntax-keyword-type: ${dark.shKeyword};
$dark-syntax-keyword: ${dark.shKeyword};
$dark-syntax-literal-date: ${dark.text};
$dark-syntax-literal: ${dark.text};
$dark-syntax-name-attribute: ${dark.shFunction};
$dark-syntax-name-builtin-pseudo: ${dark.text};
$dark-syntax-name-builtin: ${dark.shVariable};
$dark-syntax-name-class: ${dark.shFunction};
$dark-syntax-name-constant: ${dark.text};
$dark-syntax-name-decorator: ${dark.text};
$dark-syntax-name-entity: ${dark.text};
$dark-syntax-name-exception: ${dark.text};
$dark-syntax-name-function-magic: ${dark.shFunction};
$dark-syntax-name-function: ${dark.shFunction};
$dark-syntax-name-label: ${dark.shFunction};
$dark-syntax-name-namespace: ${dark.text};
$dark-syntax-name-other: ${dark.text};
$dark-syntax-name-property: ${dark.shFunction};
$dark-syntax-name-tag: ${dark.shKeyword};
$dark-syntax-name-variable-class: ${dark.shVariable};
$dark-syntax-name-variable-global: ${dark.shVariable};
$dark-syntax-name-variable-instance: ${dark.shVariable};
$dark-syntax-name-variable-magic: ${dark.shVariable};
$dark-syntax-name-variable: ${dark.shVariable};
$dark-syntax-name: ${dark.text};
$dark-syntax-number-bin: ${dark.shString};
$dark-syntax-number-float: ${dark.shString};
$dark-syntax-number-hex: ${dark.shString};
$dark-syntax-number-integer-long: ${dark.shString};
$dark-syntax-number-integer: ${dark.shString};
$dark-syntax-number-oct: ${dark.shString};
$dark-syntax-number: ${dark.shString};
$dark-syntax-operator-word: ${dark.shFunction};
$dark-syntax-operator: ${dark.shFunction};
$dark-syntax-string-affix: ${dark.shString};
$dark-syntax-string-backtick: ${dark.shString};
$dark-syntax-string-char: ${dark.shString};
$dark-syntax-string-delimiter: ${dark.shString};
$dark-syntax-string-doc: ${dark.shString};
$dark-syntax-string-double: ${dark.shString};
$dark-syntax-string-escape: ${dark.shString};
$dark-syntax-string-heredoc: ${dark.shString};
$dark-syntax-string-interpol: ${dark.shString};
$dark-syntax-string-other: ${dark.shString};
$dark-syntax-string-regex: ${dark.shString};
$dark-syntax-string-single: ${dark.shString};
$dark-syntax-string-symbol: ${dark.shString};
$dark-syntax-string: ${dark.shString};
`;
}

// Generate all theme files
let count = 0;
themesData.groups.forEach(group => {
  group.themes.forEach(theme => {
    const themeContent = generateThemeFile(theme);
    const syntaxContent = generateSyntaxFile(theme);

    const themeFile = path.join(themeDir, `_${theme.id}.scss`);
    const syntaxFile = path.join(syntaxDir, `_${theme.id}.scss`);

    fs.writeFileSync(themeFile, themeContent);
    fs.writeFileSync(syntaxFile, syntaxContent);

    console.log(`Created: ${theme.id}`);
    count++;
  });
});

console.log(`\nGenerated ${count} theme and syntax file pairs.`);
