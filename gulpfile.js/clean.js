const
    del = require('del'),
    paths = require('./paths');

function clean() {
    return del([ `${paths.dest}/*` ]);
}

module.exports = clean;
