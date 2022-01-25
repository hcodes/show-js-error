⚠️ Show js error
=============

[![NPM version](https://img.shields.io/npm/v/show-js-error.svg)](https://www.npmjs.com/package/show-js-error)
[![Build Status](https://img.shields.io/travis/hcodes/show-js-error.svg?style=flat)](https://travis-ci.org/hcodes/show-js-error)
[![NPM Downloads](https://img.shields.io/npm/dm/show-js-error.svg?style=flat)](https://www.npmjs.org/package/show-js-error)
[![Bundlephobia](https://badgen.net/bundlephobia/minzip/show-js-error)](https://bundlephobia.com/package/show-js-error)
[![install size](https://packagephobia.com/badge?p=show-js-error)](https://packagephobia.com/result?p=show-js-error)
[![Bundlephobia](https://badgen.net/bundlephobia/tree-shaking/show-js-error)](https://bundlephobia.com/package/show-js-error)

Shows a message when an js error occurs in a browser.<br>
Useful for developing and testing your site on mobile phones, tablets and desktop.

Shortly:<br>![Shortly](https://raw.githubusercontent.com/hcodes/show-js-error/master/images/simple.png?)<br><br>
Detailed:<br>![Detail](https://raw.githubusercontent.com/hcodes/show-js-error/master/images/detailed.png?)

## Browsers
- Chrome
- Firefox
- Safari
- MS Edge
- IE >= 11

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
```

With default settings:
```js
import 'show-js-error'; // Default settings
```
or with own settings:
```js
import { showJSError } from 'show-js-error';

showJSError.setSettings({
    reportUrl: 'https://github.com/hcodes/show-js-error/issues/new?title={title}&body={body}'
});
```

## API

### .setSettings(settings)
Set settings for error panel.

```js
showJSError.setSettings({
    reportUrl: 'https://github.com/hcodes/show-js-error/issues/new?title={title}&body={body}', // Default: ""
    templateDetailedMessage: 'My title\n{message}',
})
```

### .show(error?: Error | object | string)
Show error panel.

```js
showJSError.show();
```

Show error panel with transmitted error.
```js
showJSError.show({
    title: 'My title',
    message: 'My message',
    filename: 'My filename',
    stack: 'My stack',
    lineno: 100,
    colno: 3
});

// or
showJSError.show('My error');

// or
showJSError.show(new Error('My error'));
```

### .hide()
Hide error panel.

### .clear()
Clear error panel.

### .toggleView()
Toggle detailed info about current error.

### .destruct()
Deattach error panel from page, remove global event listeners.

## [Example](http://hcodes.github.io/show-js-error/tests/many.html)

## [License](https://github.com/hcodes/show-js-error/blob/master/LICENSE)
MIT License
