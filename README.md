Show js error
=============

[![NPM version](https://img.shields.io/npm/v/show-js-error.svg)](https://www.npmjs.com/package/show-js-error)
[![Build Status](https://img.shields.io/travis/hcodes/show-js-error.svg?style=flat)](https://travis-ci.org/hcodes/show-js-error)
[![NPM Downloads](https://img.shields.io/npm/dm/show-js-error.svg?style=flat)](https://www.npmjs.org/package/show-js-error)
[![Dependency Status](https://img.shields.io/david/hcodes/show-js-error.svg)](https://david-dm.org/hcodes/show-js-error)

Shows a message when an js error occurs in a browser.<br>
Useful for developing and testing your site on mobile phones, tablets and desktop.

Shortly:<br>![Shortly](https://raw.githubusercontent.com/hcodes/show-js-error/master/images/simple.png?)<br><br>
Detail:<br>![Detail](https://raw.githubusercontent.com/hcodes/show-js-error/master/images/detailed.png?)

## Browsers
Any.

## Install
```
npm install show-js-error --save-dev
```

## Using
```html
<link rel="stylesheet" href="./node_modules/show-js-error/dist/show-js-error.css" />
<script src="./node_modules/show-js-error/dist/show-js-error.js"></script>
```
or

```html
<link rel="stylesheet" href="./node_modules/show-js-error/dist/show-js-error.css" />
<script src="./node_modules/show-js-error/dist/show-js-error.custom.js"></script>
<script>
    showJSError.init({
        title: 'JavaScript error',
        userAgent: navigator.userAgent,
        sendText: 'Send 🐛',
        sendUrl: 'https://github.com/hcodes/show-js-error/issues/new?title={title}&body={body}'
    });
</script>
```

## Show custom error
```js
showJSError.show({
    title: 'My title',
    message: 'My message',
    filename: 'My filename',
    stack: 'My stack',
    lineno: 100,
    colno: 3,
    userAgent: 'OS X Yosemite, Safari 8'
});

// or
showJSError.show('Hello error!');

// or
var err = new Error();
showJSError.show(err);

```

## [Example](http://hcodes.github.io/show-js-error/tests/many.html)

## [License](https://github.com/hcodes/show-js-error/blob/master/LICENSE)
MIT License
