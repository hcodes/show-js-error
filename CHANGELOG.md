# Changelog

## v4.1.2
Small fix.

## v4.1.1
Fixed `screen.orientation.type` for old devices.

## v4.1.0
Added error filter.

## v4.0.4
Added ES5 mode for ESM, no need to babelify the package code.

## v4.0.3
Removed console.log. 

## v4.0.2
- Fixes for SSR.
- Updated dev deps in package.json.

## v4.0.1
- Fixed typings.

## v4.0.0
- Fixed package.json properties.
- Injected CSS to JS file.
- Removed default export.
- Fixes for Safari.

## v3.0.0
- Dropped support for old browsers.
- Dropped default exports.
- Code rewritten on TypeScript and added typings.
- Added support for es6 modules.
- Simplify building scripts.
- Added methods: `.clear()`, `.toggleView()`.
- Added support for CSP errors.
- Removed settings: `copyText`, `sendText`, `additionalText`, `userAgent`, `helpLinks`.
- `sendUrl` setting replaced with `reportUrl`.
- Updated README.

## v2.0.2
Updated dev deps in package.json.

## v2.0.1
- Updated README for npmjs.com.

## v2.0.0
- Removed bower support.
- Drop support for old nodejs versions.
- Fixes for builds.

## v1.10.1
Updated dev deps in package.json.

## v1.10.0
Support for Node.js module system.

## v1.9.0
Ignore "Script error." for old Android and iOS.

## v1.8.1
Small fix in bower.json.

## v1.8.0
- Removed support for view-source protocol.
- Added minified version.

## v1.7.0
- Highlighting links in e.stack.
- Fixed using view-source protocol in links.
- Removed settings.errorLoading.

## v1.6.2
Fixed z-index for the message.

## v1.6.1
Fixed height for long stacks.

## v1.6.0
Added links to MDN and Stack Overflow for help.

## v1.5.0
- Added output of total number of errors.
- Increased size of buttons.

## v1.4.0
Added ability to change text for button copy.

## v1.3.0
- Added screen properties in detailed message
- Error loading for css, image and script files
- Separate template for detailed message

Example:
```js
showJSError.init({
    errorLoading: true,
    templateDetailedMessage: 'Before\n{message}\nAfter'
});
```

## v1.2.0
Added bower support.
