import fs from 'fs';

const currentYear = new Date().getFullYear();
const copyright = `/*! show-js-error | © ${currentYear} Denis Seleznev | MIT License */\n`;

function injectCopyright(source) {
    fs.writeFileSync(
        source,
        fs.readFileSync(source, 'utf-8').replace(/^/, copyright),
        'utf-8'
    );
}

injectCopyright('./dist/show-js-error.js');
injectCopyright('./dist/show-js-error.esm.js');
