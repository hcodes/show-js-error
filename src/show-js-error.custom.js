/*! show-js-error | © 2017 Denis Seleznev | MIT License */
(function(root, factory) {
    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        define('show-js-error', [], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.showJSError = factory();
    }
}(this, function() {
    //=include main.js

    return showJSError;
}));
