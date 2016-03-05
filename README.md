Show js error
=============

Shows a message when an js error occurs in a browser.<br>
Useful for developing and testing your site on mobile phones, tablets and desktop.

Shortly:<br>![Shortly](https://raw.githubusercontent.com/hcodes/show-js-error/gh-pages/images/simple.png)<br><br>
Detail:<br>![Detail](https://raw.githubusercontent.com/hcodes/show-js-error/gh-pages/images/detailed.png)

### Browsers
Any.

## Using
```html
<link rel="stylesheet" href="dist/show-js-error.css" />
<script src="dist/show-js-error.js"></script>
```
or

```html
<link rel="stylesheet" href="dist/show-js-error.css" />
<script src="dist/show-js-error.custom.js"></script>
<script>
showJSError.init({
    title: 'JavaScript error',
    userAgent: navigator.userAgent,
    send: 'https://github.com/hcodes/show-js-error/issues/new?title={title}&body={body}'
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

## [License](./LICENSE.md)
MIT License
