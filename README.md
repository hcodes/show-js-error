⚠️ Show JS Error
=============

[![NPM version](https://img.shields.io/npm/v/show-js-error.svg)](https://www.npmjs.com/package/show-js-error)
[![NPM Downloads](https://img.shields.io/npm/dm/show-js-error.svg?style=flat)](https://www.npmjs.org/package/show-js-error)
[![install size](https://packagephobia.com/badge?p=show-js-error)](https://packagephobia.com/result?p=show-js-error)

Shows a message when an js error occurs in a browser.<br>
Useful for developing and testing your site on mobile phones, smart TV, tablets and desktop.

Shortly:<br>![Shortly](https://raw.githubusercontent.com/hcodes/show-js-error/master/images/simple.png?)<br><br>
Detail:<br>![Detail](https://raw.githubusercontent.com/hcodes/show-js-error/master/images/detailed.png?)

## Features
- Support:
    - Window errors
    - Unhandled rejections
    - CSP errors
- [Small size](https://bundlephobia.com/package/show-js-error)
- Short and detailed mode
- Links with error hints on MDN and StackOverlow
- UI
- Integration with Github

## Browsers
- Chrome
- Mozilla Firefox
- Apple Safari
- Microsoft Edge
- Internet Explorer >= 11

## Install
```
npm install show-js-error --save-dev
```

## Using

### Browser
With default settings:
```html
<link rel="stylesheet" href="https://unpkg.com/show-js-error/dist/show-js-error.css" />
<script src="https://unpkg.com/show-js-error/dist/show-js-error.js"></script>
```
or with own settings:
```html
<link rel="stylesheet" href="https://unpkg.com/show-js-error/dist/show-js-error.css" />
<script src="https://unpkg.com/show-js-error/dist/show-js-error.js"></script>
```
```js
window.showJSError.setSettings({
    reportUrl: 'https://github.com/hcodes/show-js-error/issues/new?title={title}&body={body}'
});
```

### ES6 or TypeScript
```html
<link rel="stylesheet" href="./node_modules/show-js-error/dist/show-js-error.css" />
```

With default settings:
```js
import { ShowJSError } from 'show-js-error';
const showJSError = new ShowJSError();
```
or with own settings:
```js
import { ShowJSError } from 'show-js-error';

const showJSError = new ShowJSError();
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

### .clear()
Clear errors for error panel.

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

### .toggleView()
Toggle detailed info about current error.

### .destruct()
Detach error panel from page, remove global event listeners.

## [Examples](./tests)
- [Simple](http://hcodes.github.io/show-js-error/tests/many.html)
- [Advanced](http://hcodes.github.io/show-js-error/tests/index.html)

## [License](https://github.com/hcodes/show-js-error/blob/master/LICENSE)
MIT License
