'use strict';

const
    rollup = require('rollup'),
    paths = require('./paths');

function jsCustom() {
    return rollup.rollup({
            input: paths.jsCustom,
            output: {
                dir: paths.dest,
                format: 'umd',
                name: 'showJSError'            
            }
    }).then((data) => data.write({
        file: `${paths.dest}/show-js-error.custom.js`,
        format: 'umd',
        name: 'showJSError'
    }));
}

module.exports = jsCustom;
