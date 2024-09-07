/*! show-js-error | © 2024 Denis Seleznev | MIT License | https://github.com/hcodes/show-js-error/ */
function getScreenSize() {
    return [screen.width, screen.height, screen.colorDepth].join('×');
}
function getScreenOrientation() {
    return typeof screen.orientation === 'string' ? screen.orientation : screen.orientation.type;
}
function copyTextToClipboard(text) {
    const textarea = document.createElement('textarea');
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
function injectStyle(style) {
    const styleNode = document.createElement('style');
    document.body.appendChild(styleNode);
    styleNode.textContent = style;
    return styleNode;
}

function createElem(data) {
    const elem = document.createElement(data.tag || 'div');
    if (data.props) {
        addProps(elem, data.props);
    }
    elem.className = buildElemClass(data.name);
    data.container.appendChild(elem);
    return elem;
}
function addProps(elem, props) {
    Object.keys(props).forEach(key => {
        elem[key] = props[key];
    });
}
function buildElemClass(name, mod) {
    let elemName = 'show-js-error';
    if (name) {
        elemName += '__' + name;
    }
    let className = elemName;
    if (mod) {
        Object.keys(mod).forEach((modName) => {
            const modValue = mod[modName];
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
    let text = error.filename || '';
    if (typeof error.lineno !== 'undefined') {
        text += ':' + getValue(error.lineno, '');
        if (typeof error.colno !== 'undefined') {
            text += ':' + getValue(error.colno, '');
        }
    }
    return text;
}

const STYLE = '.show-js-error{background:#ffc1cc;bottom:15px;color:#000;font-family:Arial,sans-serif;font-size:13px;left:15px;max-width:90vw;min-width:15em;opacity:1;position:fixed;transition:opacity .2s ease-out;transition-delay:0s;visibility:visible;z-index:10000000}.show-js-error_size_big{transform:scale(2) translate(25%,-25%)}.show-js-error_hidden{opacity:0;transition:opacity .3s,visibility 0s linear .3s;visibility:hidden}.show-js-error__title{background:#f66;color:#fff;font-weight:700;padding:4px 30px 4px 7px}.show-js-error__title_no-errors{background:#6b6}.show-js-error__message{cursor:pointer;display:inline}.show-js-error__message:before{background-color:#eee;border-radius:10px;content:"+";display:inline-block;font-size:10px;height:10px;line-height:10px;margin-bottom:2px;margin-right:5px;text-align:center;vertical-align:middle;width:10px}.show-js-error__body_detailed .show-js-error__message:before{content:"-"}.show-js-error__body_no-stack .show-js-error__message:before{display:none}.show-js-error__body_detailed .show-js-error__filename{display:block}.show-js-error__body_no-stack .show-js-error__filename{display:none}.show-js-error__close{color:#fff;cursor:pointer;font-size:20px;line-height:20px;padding:3px;position:absolute;right:2px;top:0}.show-js-error__body{line-height:19px;padding:5px 8px}.show-js-error__body_hidden{display:none}.show-js-error__filename{background:#ffe1ec;border:1px solid #faa;display:none;margin:3px 0 3px -2px;max-height:15em;overflow-y:auto;padding:5px;white-space:pre-wrap}.show-js-error__actions{border-top:1px solid #faa;margin-top:5px;padding:5px 0 3px}.show-js-error__actions_hidden{display:none}.show-js-error__arrows{margin-left:8px;white-space:nowrap}.show-js-error__arrows_hidden{display:none}.show-js-error__copy,.show-js-error__next,.show-js-error__num,.show-js-error__prev,.show-js-error__report{font-size:12px}.show-js-error__report_hidden{display:none}.show-js-error__next{margin-left:1px}.show-js-error__num{margin-left:5px;margin-right:5px}.show-js-error__copy,.show-js-error__report{margin-right:3px}.show-js-error input{padding:1px 2px}.show-js-error a,.show-js-error a:visited{color:#000;text-decoration:underline}.show-js-error a:hover{text-decoration:underline}';
class ShowJSError {
    constructor() {
        this.elems = {};
        this.state = {
            appended: false,
            detailed: false,
            errorIndex: 0,
            errorBuffer: [],
        };
        this.onerror = (event) => {
            const error = event.error ? event.error : event;
            this.pushError({
                title: 'JavaScript Error',
                message: error.message,
                filename: error.filename,
                colno: error.colno,
                lineno: error.lineno,
                stack: error.stack,
            });
        };
        this.onsecuritypolicyviolation = (error) => {
            this.pushError({
                title: 'CSP Error',
                message: `blockedURI: ${error.blockedURI || ''}\n violatedDirective: ${error.violatedDirective} || ''\n originalPolicy: ${error.originalPolicy || ''}`,
                colno: error.columnNumber,
                filename: error.sourceFile,
                lineno: error.lineNumber,
            });
        };
        this.onunhandledrejection = (error) => {
            this.pushError({
                title: 'Unhandled promise rejection',
                message: error.reason.message,
                colno: error.reason.colno,
                filename: error.reason.filename,
                lineno: error.reason.lineno,
                stack: error.reason.stack,
            });
        };
        this.appendToBody = () => {
            document.removeEventListener('DOMContentLoaded', this.appendToBody, false);
            if (this.elems.container) {
                this.styleNode = injectStyle(STYLE);
                document.body.appendChild(this.elems.container);
            }
        };
        this.settings = this.prepareSettings();
        if (typeof window === 'undefined') {
            return;
        }
        window.addEventListener('error', this.onerror, false);
        window.addEventListener('unhandledrejection', this.onunhandledrejection, false);
        document.addEventListener('securitypolicyviolation', this.onsecuritypolicyviolation, false);
    }
    destruct() {
        var _a;
        window.removeEventListener('error', this.onerror, false);
        window.removeEventListener('unhandledrejection', this.onunhandledrejection, false);
        document.removeEventListener('securitypolicyviolation', this.onsecuritypolicyviolation, false);
        document.removeEventListener('DOMContentLoaded', this.appendToBody, false);
        if (document.body && this.elems.container) {
            document.body.removeChild(this.elems.container);
        }
        this.state.errorBuffer = [];
        this.elems = {};
        if (this.styleNode) {
            (_a = this.styleNode.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(this.styleNode);
            this.styleNode = undefined;
        }
    }
    setSettings(settings) {
        this.settings = this.prepareSettings(settings);
        if (this.state.appended) {
            this.updateUI();
        }
    }
    /**
     * Show error panel with transmitted error.
     */
    show(error) {
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
    }
    /**
     * Hide error panel.
     */
    hide() {
        if (this.elems.container) {
            this.elems.container.className = buildElemClass('', {
                size: this.settings.size,
                hidden: true
            });
        }
    }
    /**
     * Clear error panel.
     */
    clear() {
        this.state.errorBuffer = [];
        this.state.detailed = false;
        this.setCurrentError(0);
    }
    /**
     * Toggle view (shortly/detail).
     */
    toggleView() {
        this.state.detailed = !this.state.detailed;
        this.updateUI();
    }
    prepareSettings(rawSettings) {
        const settings = rawSettings || {};
        return {
            size: settings.size || 'normal',
            reportUrl: settings.reportUrl || '',
            templateDetailedMessage: settings.templateDetailedMessage || '',
        };
    }
    pushError(error) {
        this.state.errorBuffer.push(error);
        this.state.errorIndex = this.state.errorBuffer.length - 1;
        this.updateUI();
    }
    appendUI() {
        const container = document.createElement('div');
        container.className = buildElemClass('', {
            size: this.settings.size,
        });
        this.elems.container = container;
        this.elems.close = createElem({
            name: 'close',
            props: {
                innerText: '×',
                onclick: () => {
                    this.hide();
                }
            },
            container
        });
        this.elems.title = createElem({
            name: 'title',
            props: {
                innerText: this.getTitle()
            },
            container
        });
        const body = createElem({
            name: 'body',
            container
        });
        this.elems.body = body;
        this.elems.message = createElem({
            name: 'message',
            props: {
                onclick: () => {
                    this.toggleView();
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
            this.styleNode = injectStyle(STYLE);
        }
        else {
            document.addEventListener('DOMContentLoaded', this.appendToBody, false);
        }
    }
    createActions(container) {
        const actions = createElem({
            name: 'actions',
            container
        });
        this.elems.actions = actions;
        createElem({
            tag: 'input',
            name: 'copy',
            props: {
                type: 'button',
                value: 'Copy',
                onclick: () => {
                    const error = this.getCurrentError();
                    copyTextToClipboard(this.getDetailedMessage(error));
                }
            },
            container: actions
        });
        const reportLink = createElem({
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
    }
    createArrows(container) {
        const arrows = createElem({
            tag: 'span',
            name: 'arrows',
            container
        });
        this.elems.arrows = arrows;
        this.elems.prev = createElem({
            tag: 'input',
            name: 'prev',
            props: {
                type: 'button',
                value: '←',
                onclick: () => {
                    this.setCurrentError(this.state.errorIndex - 1);
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
                onclick: () => {
                    this.setCurrentError(this.state.errorIndex + 1);
                }
            },
            container: arrows
        });
    }
    getDetailedMessage(error) {
        let text = [
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
        ].map(item => (item[0] + ': ' + item[1] + '\n')).join('');
        if (this.settings.templateDetailedMessage) {
            text = this.settings.templateDetailedMessage.replace(/\{message\}/, text);
        }
        return text;
    }
    getTitle(error) {
        return error ? (error.title || 'Error') : 'No errors';
    }
    showUI() {
        if (this.elems.container) {
            this.elems.container.className = buildElemClass('', {
                size: this.settings.size,
            });
        }
    }
    hasStack() {
        const error = this.getCurrentError();
        return error && (error.stack || error.filename);
    }
    getCurrentError() {
        return this.state.errorBuffer[this.state.errorIndex];
    }
    setCurrentError(index) {
        const length = this.state.errorBuffer.length;
        let newIndex = index;
        if (newIndex > length - 1) {
            newIndex = length - 1;
        }
        else if (newIndex < 0) {
            newIndex = 0;
        }
        this.state.errorIndex = newIndex;
        this.updateUI();
    }
    updateUI() {
        const error = this.getCurrentError();
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
    }
    updateArrows(error) {
        const length = this.state.errorBuffer.length;
        const errorIndex = this.state.errorIndex;
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
    }
}

const showJSError = new ShowJSError();
if (typeof window !== 'undefined') {
    window.showJSError = showJSError;
}

export { showJSError };
