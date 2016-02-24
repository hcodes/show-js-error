Show js error
=============

Shows a message when an js error occurs in a browser.<br>
Useful for developing and testing your site on mobile phones, tablets and desktop.

Shortly:<br>![Shortly](https://raw.githubusercontent.com/hcodes/show-js-error/gh-pages/images/simple.png)<br><br>
Detail:<br>![Detail](https://raw.githubusercontent.com/hcodes/show-js-error/gh-pages/images/detailed.png)

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
    send: 'https://github.com/hcodes/show-js-error/issues/new?title={title}&message={message}'
});
</script>
```
## [Example](http://hcodes.github.io/show-js-error/tests/many.html)

## [License](./LICENSE.md)
MIT License
