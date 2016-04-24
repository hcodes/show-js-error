# Changelog

## v1.3.0
- Added screen properties in detailed message
- Error loading for css, image and script files
- Separate template for detailed message

Example:
```js
showJSError.init({
    errorLoading: true,
    templateDetailedMessage: '```\n{message}\n```'
});
```

## v1.2.0
- Added bower support