(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.showJSError = factory());
})(this, (function () { 'use strict';

    function getScreenSize() {
        return [screen.width, screen.height, screen.colorDepth].join('×');
    }
    function getScreenOrientation() {
        return typeof screen.orientation === 'string' ? screen.orientation : screen.orientation.type;
    }
    function copyTextToClipboard(text) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        try {
            textarea.select();
            document.execCommand('copy');
        }
        catch (e) {
            alert('Copying text is not supported in this browser.');
        }
        document.body.removeChild(textarea);
    }

    function createElem(data) {
        var elem = document.createElement(data.tag || 'div');
        if (data.props) {
            addProps(elem, data.props);
        }
        elem.className = buildElemClass(data.name);
        data.container.appendChild(elem);
        return elem;
    }
    function addProps(elem, props) {
        Object.keys(props).forEach(function (key) {
            elem[key] = props[key];
        });
    }
    function buildElemClass(name, mod) {
        var elemName = 'show-js-error';
        if (name) {
            elemName += '__' + name;
        }
        var className = elemName;
        if (mod) {
            Object.keys(mod).forEach(function (modName) {
                var modValue = mod[modName];
                if (modValue === false || modValue === null || modValue === undefined || modValue === '') {
                    return;
                }
                if (mod[modName] === true) {
                    className += ' ' + elemName + '_' + modName;
                }
                else {
                    className += ' ' + elemName + '_' + modName + '_' + modValue;
                }
            });
        }
        return className;
    }

    function getStack(error) {
        return error && error.stack || '';
    }
    function getMessage(error) {
        return error && error.message || '';
    }
    function getValue(value, defaultValue) {
        return typeof value === 'undefined' ? defaultValue : value;
    }
    function getFilenameWithPosition(error) {
        if (!error) {
            return '';
        }
        var text = error.filename || '';
        if (typeof error.lineno !== 'undefined') {
            text += ':' + getValue(error.lineno, '');
            if (typeof error.colno !== 'undefined') {
                text += ':' + getValue(error.colno, '');
            }
        }
        return text;
    }

    var ShowJSError = /** @class */ (function () {
        function ShowJSError() {
            var _this = this;
            this.elems = {};
            this.state = {
                appended: false,
                detailed: false,
                errorIndex: 0,
                errorBuffer: [],
            };
            this.onerror = function (event) {
                var error = event.error;
                _this.pushError({
                    title: 'JavaScript Error',
                    message: error.message,
                    filename: error.filename,
                    colno: error.colno,
                    lineno: error.lineno,
                    stack: error.stack,
                });
            };
            this.onsecuritypolicyviolation = function (error) {
                _this.pushError({
                    title: 'CSP Error',
                    message: "blockedURI: ".concat(error.blockedURI || '', "\n violatedDirective: ").concat(error.violatedDirective, " || ''\n originalPolicy: ").concat(error.originalPolicy || ''),
                    colno: error.columnNumber,
                    filename: error.sourceFile,
                    lineno: error.lineNumber,
                });
            };
            this.onunhandledrejection = function (error) {
                _this.pushError({
                    title: 'Unhandled promise rejection',
                    message: error.reason.message,
                    colno: error.reason.colno,
                    filename: error.reason.filename,
                    lineno: error.reason.lineno,
                    stack: error.reason.stack,
                });
            };
            this.appendToBody = function () {
                document.removeEventListener('DOMContentLoaded', _this.appendToBody, false);
                if (_this.elems.container) {
                    document.body.appendChild(_this.elems.container);
                }
            };
            this.settings = this.prepareSettings();
            window.addEventListener('error', this.onerror, false);
            window.addEventListener('unhandledrejection', this.onunhandledrejection, false);
            document.addEventListener('securitypolicyviolation', this.onsecuritypolicyviolation, false);
        }
        ShowJSError.prototype.destruct = function () {
            window.removeEventListener('error', this.onerror, false);
            window.removeEventListener('unhandledrejection', this.onunhandledrejection, false);
            document.removeEventListener('securitypolicyviolation', this.onsecuritypolicyviolation, false);
            document.removeEventListener('DOMContentLoaded', this.appendToBody, false);
            if (document.body && this.elems.container) {
                document.body.removeChild(this.elems.container);
            }
            this.state.errorBuffer = [];
            this.elems = {};
        };
        ShowJSError.prototype.setSettings = function (settings) {
            this.settings = this.prepareSettings(settings);
            if (this.state.appended) {
                this.updateUI();
            }
        };
        /**
         * Show error panel with transmitted error.
         */
        ShowJSError.prototype.show = function (error) {
            if (!error) {
                this.showUI();
                return;
            }
            if (typeof error === 'string') {
                this.pushError({ message: error });
            }
            else {
                this.pushError(typeof error === 'object' ?
                    error :
                    new Error(error));
            }
        };
        /**
         * Hide error panel.
         */
        ShowJSError.prototype.hide = function () {
            if (this.elems.container) {
                this.elems.container.className = buildElemClass('', {
                    hidden: true
                });
            }
        };
        /**
         * Clear error panel.
         */
        ShowJSError.prototype.clear = function () {
            this.state.errorBuffer = [];
            this.state.detailed = false;
            this.setCurrentError(0);
        };
        /**
         * Toggle view (shortly/detail).
         */
        ShowJSError.prototype.toggleView = function () {
            this.state.detailed = !this.state.detailed;
            this.updateUI();
        };
        ShowJSError.prototype.prepareSettings = function (rawSettings) {
            var settings = rawSettings || {};
            return {
                reportUrl: settings.reportUrl || '',
                templateDetailedMessage: settings.templateDetailedMessage || '',
            };
        };
        ShowJSError.prototype.pushError = function (error) {
            this.state.errorBuffer.push(error);
            this.state.errorIndex = this.state.errorBuffer.length - 1;
            this.updateUI();
        };
        ShowJSError.prototype.appendUI = function () {
            var _this = this;
            var container = document.createElement('div');
            container.className = buildElemClass('');
            this.elems.container = container;
            this.elems.close = createElem({
                name: 'close',
                props: {
                    innerText: '×',
                    onclick: function () {
                        _this.hide();
                    }
                },
                container: container
            });
            this.elems.title = createElem({
                name: 'title',
                props: {
                    innerText: this.getTitle()
                },
                container: container
            });
            var body = createElem({
                name: 'body',
                container: container
            });
            this.elems.body = body;
            this.elems.message = createElem({
                name: 'message',
                props: {
                    onclick: function () {
                        _this.toggleView();
                    }
                },
                container: body
            });
            this.elems.filename = createElem({
                name: 'filename',
                container: body
            });
            this.createActions(body);
            if (document.body) {
                document.body.appendChild(container);
            }
            else {
                document.addEventListener('DOMContentLoaded', this.appendToBody, false);
            }
        };
        ShowJSError.prototype.createActions = function (container) {
            var _this = this;
            var actions = createElem({
                name: 'actions',
                container: container
            });
            this.elems.actions = actions;
            createElem({
                tag: 'input',
                name: 'copy',
                props: {
                    type: 'button',
                    value: 'Copy',
                    onclick: function () {
                        var error = _this.getCurrentError();
                        copyTextToClipboard(_this.getDetailedMessage(error));
                    }
                },
                container: actions
            });
            var reportLink = createElem({
                tag: 'a',
                name: 'report-link',
                props: {
                    href: '',
                    target: '_blank'
                },
                container: actions
            });
            this.elems.reportLink = reportLink;
            this.elems.report = createElem({
                tag: 'input',
                name: 'report',
                props: {
                    type: 'button',
                    value: 'Report'
                },
                container: reportLink
            });
            this.createArrows(actions);
        };
        ShowJSError.prototype.createArrows = function (container) {
            var _this = this;
            var arrows = createElem({
                tag: 'span',
                name: 'arrows',
                container: container
            });
            this.elems.arrows = arrows;
            this.elems.prev = createElem({
                tag: 'input',
                name: 'prev',
                props: {
                    type: 'button',
                    value: '←',
                    onclick: function () {
                        _this.setCurrentError(_this.state.errorIndex - 1);
                    }
                },
                container: arrows
            });
            this.elems.num = createElem({
                tag: 'span',
                name: 'num',
                props: {
                    innerText: this.state.errorIndex + 1
                },
                container: arrows
            });
            this.elems.next = createElem({
                tag: 'input',
                name: 'next',
                props: {
                    type: 'button',
                    value: '→',
                    onclick: function () {
                        _this.setCurrentError(_this.state.errorIndex + 1);
                    }
                },
                container: arrows
            });
        };
        ShowJSError.prototype.getDetailedMessage = function (error) {
            var text = [
                ['Title', this.getTitle(error)],
                ['Message', getMessage(error)],
                ['Filename', getFilenameWithPosition(error)],
                ['Stack', getStack(error)],
                ['Page url', window.location.href],
                ['Refferer', document.referrer],
                ['User-agent', navigator.userAgent],
                ['Screen size', getScreenSize()],
                ['Screen orientation', getScreenOrientation()],
                ['Cookie enabled', navigator.cookieEnabled]
            ].map(function (item) { return (item[0] + ': ' + item[1] + '\n'); }).join('');
            if (this.settings.templateDetailedMessage) {
                text = this.settings.templateDetailedMessage.replace(/\{message\}/, text);
            }
            return text;
        };
        ShowJSError.prototype.getTitle = function (error) {
            return error ? (error.title || 'Error') : 'No errors';
        };
        ShowJSError.prototype.showUI = function () {
            if (this.elems.container) {
                this.elems.container.className = buildElemClass('');
            }
        };
        ShowJSError.prototype.hasStack = function () {
            var error = this.getCurrentError();
            return error && (error.stack || error.filename);
        };
        ShowJSError.prototype.getCurrentError = function () {
            return this.state.errorBuffer[this.state.errorIndex];
        };
        ShowJSError.prototype.setCurrentError = function (index) {
            var length = this.state.errorBuffer.length;
            var newIndex = index;
            if (newIndex > length - 1) {
                newIndex = length - 1;
            }
            else if (newIndex < 0) {
                newIndex = 0;
            }
            this.state.errorIndex = newIndex;
            this.updateUI();
        };
        ShowJSError.prototype.updateUI = function () {
            var error = this.getCurrentError();
            if (!this.state.appended) {
                this.state.appended = true;
                this.appendUI();
            }
            if (this.elems.body) {
                this.elems.body.className = buildElemClass('body', {
                    detailed: this.state.detailed,
                    'no-stack': !this.hasStack(),
                    hidden: !error,
                });
            }
            if (this.elems.title) {
                this.elems.title.innerText = this.getTitle(error);
                this.elems.title.className = buildElemClass('title', {
                    'no-errors': !error
                });
            }
            if (this.elems.message) {
                this.elems.message.innerText = getMessage(error);
            }
            if (this.elems.actions) {
                this.elems.actions.className = buildElemClass('actions', { hidden: !error });
            }
            if (this.elems.reportLink) {
                this.elems.reportLink.className = buildElemClass('report', {
                    hidden: !this.settings.reportUrl
                });
            }
            if (this.elems.reportLink) {
                this.elems.reportLink.href = this.settings.reportUrl
                    .replace(/\{title\}/, encodeURIComponent(getMessage(error)))
                    .replace(/\{body\}/, encodeURIComponent(this.getDetailedMessage(error)));
            }
            if (this.elems.filename) {
                this.elems.filename.className = buildElemClass('filename', { hidden: !error });
                this.elems.filename.innerText = getStack(error) || getFilenameWithPosition(error);
            }
            this.updateArrows(error);
            this.showUI();
        };
        ShowJSError.prototype.updateArrows = function (error) {
            var length = this.state.errorBuffer.length;
            var errorIndex = this.state.errorIndex;
            if (this.elems.arrows) {
                this.elems.arrows.className = buildElemClass('arrows', { hidden: !error });
            }
            if (this.elems.prev) {
                this.elems.prev.disabled = !errorIndex;
            }
            if (this.elems.num) {
                this.elems.num.innerText = (errorIndex + 1) + '\u2009/\u2009' + length;
            }
            if (this.elems.next) {
                this.elems.next.disabled = errorIndex === length - 1;
            }
        };
        return ShowJSError;
    }());

    var showJSError = new ShowJSError();

    return showJSError;

}));
