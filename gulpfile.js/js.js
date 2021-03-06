'use strict';

const
    rollup = require('rollup'),
    paths = require('./paths');

function js() {
    return rollup.rollup({
            input: paths.js,
            output: {
                dir: paths.dest,
                format: 'umd',
                name: 'showJSError'
            }
    }).then((data) => data.write({
        file: `${paths.dest}/show-js-error.js`,
        format: 'umd',
        name: 'showJSError'
    }));
}

module.exports = js;
