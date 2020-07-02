import { getScreenSize, getScreenOrientation, copyText } from './helpers/dom';
import { elem, elemClass } from './helpers/elem';
import { escapeHTML } from './helpers/escapeHTML';
import { getStack, getExtFilename, getFilenameWithPosition, getMessage } from './helpers/error';
import { highlightLinks } from './helpers/highlightLinks';
import { getMdnUrl, getStackOverflowUrl } from './helpers/url';

var showJSError = {
    /**
     * Initialize.
     *
     * @param {Object} [settings]
     * @param {String} [settings.title]
     * @param {String} [settings.userAgent]
     * @param {String} [settings.copyText]
     * @param {String} [settings.sendText]
     * @param {String} [settings.sendUrl]
     * @param {String} [settings.additionalText]
     * @param {Boolean} [settings.helpLinks]
     */
    init: function(settings) {
        if (this._inited) {
            return;
        }

        var that = this,
            isAndroidOrIOS = /(Android|iPhone|iPod|iPad)/i.test(navigator.userAgent);

        this.settings = settings || {};

        this._inited = true;
        this._isLast = true;
        this._i = 0;
        this._buffer = [];

        this._onerror = function(e) {
            if (isAndroidOrIOS && e && e.message === 'Script error.' && !e.lineno && !e.filename) {
                return;
            }

            that._buffer.push(e);
            if (that._isLast) {
                that._i = that._buffer.length - 1;
            }

            that._update();
        };

        this._onunhandledrejection = function(e) {
            var reason = e.reason;

            that._onerror({
                message: 'Unhandled promise rejection: ' + reason.message,
                colno: reason.colno,
                error: reason,
                filename: reason.filename,
                lineno: reason.lineno,
                stack: reason.stack,
            });
        };

        if (window.addEventListener) {
            window.addEventListener('error', this._onerror, false);
            window.addEventListener('unhandledrejection', this._onunhandledrejection, false);
        } else {
            this._oldOnError = window.onerror;

            window.onerror = function(message, filename, lineno, colno, error) {
                that._onerror({
                    message: message,
                    filename: filename,
                    lineno: lineno,
                    colno: colno,
                    error: error
                });

                if (typeof that._oldOnError === 'function') {
                    that._oldOnError.apply(window, arguments);
                }
            };
        }
    },
    /**
     * Destructor.
     */
    destruct: function() {
        if (!this._inited) { return; }

        if (window.addEventListener) {
            window.removeEventListener('error', this._onerror, false);
            window.removeEventListener('unhandledrejection', this._onunhandledrejection, false);
        } else {
            window.onerror = this._oldOnError || null;
            delete this._oldOnError;
        }

        if (document.body && this._container) {
            document.body.removeChild(this._container);
        }

        this._buffer = [];

        this._inited = false;
    },
    /**
     * Show error message.
     *
     * @param {String|Object|Error} err
     */
    show: function(err) {
        if (typeof err !== 'undefined') {
            this._buffer.push(typeof err === 'object' ? err : new Error(err));
        }

        this._update();
        this._show();
    },
    /**
     * Hide error message.
     */
    hide: function() {
        if (this._container) {
            this._container.className = elemClass('');
        }
    },
    /**
     * Toggle view (shortly/detail).
     */
    toggleDetailed: function() {
        var body = this._body;
        if (body) {
            if (this._toggleDetailed) {
                this._toggleDetailed = false;
                body.className = elemClass('body');
            } else {
                this._toggleDetailed = true;
                body.className = elemClass('body', 'detailed');
            }
        }
    },
    _append: function() {
        var that = this;

        this._container = document.createElement('div');
        this._container.className = elemClass('');

        this._title = elem({
            name: 'title',
            props: {
                innerHTML: this._getTitle()
            },
            container: this._container
        });

        this._body = elem({
            name: 'body',
            container: this._container
        });

        this._message = elem({
            name: 'message',
            props: {
                onclick: function() {
                    that.toggleDetailed();
                }
            },
            container: this._body
        });

        if (this.settings.helpLinks) {
            this._helpLinks = elem({
                name: 'help',
                container: this._body
            });

            this._mdn = elem({
                tag: 'a',
                name: 'mdn',
                props: {
                    target: '_blank',
                    innerHTML: 'MDN'
                },
                container: this._helpLinks
            });

            this._stackoverflow = elem({
                tag: 'a',
                name: 'stackoverflow',
                props: {
                    target: '_blank',
                    innerHTML: 'Stack Overflow'
                },
                container: this._helpLinks
            });
        }

        this._filename = elem({
            name: 'filename',
            container: this._body
        });

        if (this.settings.userAgent) {
            this._ua = elem({
                name: 'ua',
                container: this._body
            });
        }

        if (this.settings.additionalText) {
            this._additionalText = elem({
                name: 'additional-text',
                container: this._body
            });
        }

        elem({
            name: 'close',
            props: {
                innerHTML: '×',
                onclick: function() {
                    that.hide();
                }
            },
            container: this._container
        });

        this._actions = elem({
            name: 'actions',
            container: this._container
        });

        elem({
            tag: 'input',
            name: 'copy',
            props: {
                type: 'button',
                value: this.settings.copyText || 'Copy',
                onclick: function() {
                    var err = that._buffer[that._i];
                    copyText(that._getDetailedMessage(err));
                }
            },
            container: this._actions
        });

        if (this.settings.sendUrl) {
            this._sendLink = elem({
                tag: 'a',
                name: 'send-link',
                props: {
                    href: '',
                    target: '_blank'
                },
                container: this._actions
            });

            this._send = elem({
                tag: 'input',
                name: 'send',
                props: {
                    type: 'button',
                    value: this.settings.sendText || 'Send'
                },
                container: this._sendLink
            });
        }

        this._arrows = elem({
            tag: 'span',
            name: 'arrows',
            container: this._actions
        });

        this._prev = elem({
            tag: 'input',
            name: 'prev',
            props: {
                type: 'button',
                value: '←',
                onclick: function() {
                    that._isLast = false;
                    if (that._i) {
                        that._i--;
                    }

                    that._update();
                }
            },
            container: this._arrows
        });

        this._next = elem({
            tag: 'input',
            name: 'next',
            props: {
                type: 'button',
                value: '→',
                onclick: function() {
                    that._isLast = false;
                    if (that._i < that._buffer.length - 1) {
                        that._i++;
                    }

                    that._update();
                }
            },
            container: this._arrows
        });

        this._num = elem({
            tag: 'span',
            name: 'num',
            props: {
                innerHTML: this._i + 1
            },
            container: this._arrows
        });

        var append = function() {
            document.removeEventListener('DOMContentLoaded', append, false);
            document.body.appendChild(that._container);
        };

        if (document.body) {
            append();
        } else {
            if (document.addEventListener) {
                document.addEventListener('DOMContentLoaded', append, false);
            } else if (document.attachEvent) {
                document.attachEvent('onload', append);
            }
        }
    },
    _getDetailedMessage: function(err) {
        var settings = this.settings,
            props = [
                ['Title', this._getTitle(err)],
                ['Message', getMessage(err)],
                ['Filename', getFilenameWithPosition(err)],
                ['Stack', getStack(err)],
                ['Page url', window.location.href],
                ['Refferer', document.referrer],
                ['User-agent', settings.userAgent || navigator.userAgent],
                ['Screen size', getScreenSize()],
                ['Screen orientation', getScreenOrientation()],
                ['Cookie enabled', navigator.cookieEnabled]
            ];

        var text = '';
        for (var i = 0; i < props.length; i++) {
            var item = props[i];
            text += item[0] + ': ' + item[1] + '\n';
        }

        if (settings.templateDetailedMessage) {
            text = settings.templateDetailedMessage.replace(/\{message\}/, text);
        }

        return text;
    },
    _getTitle: function(error) {
        return error && error.title || this.settings.title || 'JavaScript error';
    },
    _show: function() {
        this._container.className = elemClass('', 'visible');
    },
    _update: function() {
        if (!this._appended) {
            this._append();
            this._appended = true;
        }

        var e = this._buffer[this._i],
            stack = getStack(e),
            filename;

        if (stack) {
            filename = highlightLinks(escapeHTML(stack));
        } else {
            filename = getExtFilename(e);
        }

        this._title.innerHTML = escapeHTML(this._getTitle(e));

        this._message.innerHTML = escapeHTML(getMessage(e));

        this._filename.innerHTML = filename;

        if (this._ua) {
            this._ua.innerHTML = escapeHTML(this.settings.userAgent);
        }

        if (this._additionalText) {
            this._additionalText.innerHTML = escapeHTML(this.settings.additionalText);
        }

        if (this._sendLink) {
            this._sendLink.href = this.settings.sendUrl
                .replace(/\{title\}/, encodeURIComponent(getMessage(e)))
                .replace(/\{body\}/, encodeURIComponent(this._getDetailedMessage(e)));
        }

        if (this._buffer.length > 1) {
            this._arrows.className = elemClass('arrows', 'visible');
        }

        if (this._helpLinks) {
            this._mdn.href = getMdnUrl(e.message || e.stack || '');
            this._stackoverflow.href = getStackOverflowUrl('[js] ' + (e.message || e.stack || ''));
        }

        this._prev.disabled = !this._i;
        this._num.innerHTML = (this._i + 1) + '&thinsp;/&thinsp;' + this._buffer.length;
        this._next.disabled = this._i === this._buffer.length - 1;

        this._show();
    }
};

export default showJSError;
