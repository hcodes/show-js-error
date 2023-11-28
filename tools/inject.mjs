import fs from 'fs';

const copyright = `/*! show-js-error | © ${new Date().getFullYear()} Denis Seleznev | MIT License | https://github.com/hcodes/show-js-error/ */\n`;

const css = fs.readFileSync('./dist/index.css', 'utf-8');

const encodeQuotes = (content) => {
    return content.replace(/'/g, '\\\'');
}

const injectCSS = (source, dest) => {
    const content = fs.readFileSync(source, 'utf-8')
        .replace(/\{STYLE\}/, encodeQuotes(css))
        .replace(/^/, copyright);

    fs.writeFileSync(dest, content, 'utf-8');
}

injectCSS('./dist/show-js-error.js', './dist/show-js-error.js');
injectCSS('./dist/show-js-error.esm.js', './dist/show-js-error.esm.js');
