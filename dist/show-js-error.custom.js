/*! show-js-error | © 2016 Denis Seleznev | MIT License */
/* exported showJSError */
var showJSError = {
    init: function(settings) {
        if (!window.addEventListener) {
            return;
        }

        var that = this;

        this.settings = settings || {};

        this._buffer = [];
        this._isLast = true;
        this._i = 0;

        this._onerror = function(e) {
            that._buffer.push(e);
            if (that._isLast) {
                that._i = that._buffer.length - 1;
            }

            that.update();
        };

        window.addEventListener('error', this._onerror, false);
    },
    update: function() {
        if (!this._appended) {
            this.append();
            this._appended = true;
        }

        var e = this._buffer[this._i];

        this._message.innerHTML = this.escapeHTML(e.message);

        this._filename.innerHTML = this.getExtFilename(e);

        if (this.settings.userAgent) {
            this._ua.innerHTML = this.escapeHTML(navigator.userAgent);
        }

        if (this.settings.send) {
            this._sendLink.href = this.settings.send
                .replace(/\{title\}/, encodeURIComponent(e.message))
                .replace(/\{message\}/, encodeURIComponent(this.getFilenameWithPosition(e)));
        }

        if (this._buffer.length > 1) {
            this._arrows.className = this.elemClass('arrows', 'visible');
        }

        this._prev.disabled = !this._i;
        this._num.innerHTML = this._i + 1;
        this._next.disabled = this._i === this._buffer.length - 1;

        this.show();
    },
    getExtFilename: function(e) {
        var html = this.escapeHTML(this.getFilenameWithPosition(e));
        if (e.filename && e.filename.search(/^https?:|file:/) !== -1) {
            return '<a target="_blank" href="view-source:' +
                this.escapeHTML(e.filename) + '">' + html + '</a>';
        } else {
            return html;
        }
    },
    getFilenameWithPosition: function(e) {
        return e.filename +
            ':' + (typeof e.lineno !== 'undefined' ? e.lineno : '') +
            ':' + (typeof e.colno !== 'undefined' ? e.colno : '');
    },
    show: function() {
        this._container.className = this.elemClass('', 'visible');
    },
    hide: function() {
        this._container.className = this.elemClass('');
    },
    append: function() {
        var that = this;

        this._container = document.createElement('div');
        this._container.className = this.elemClass('');

        this.elem({
            name: 'title',
            props: {
                innerHTML: this.settings.title || ''
            },
            container: this._container
        });

        this._body = this.elem({
            name: 'body',
            container: this._container
        });

        this._message = this.elem({
            name: 'message',
            props: {
                onclick: function() {
                    that.toggleDetailed();
                }
            },
            container: this._body
        });

        this._filename = this.elem({
            name: 'filename',
            container: this._body
        });

        if (this.settings.userAgent) {
            this._ua = this.elem({
                name: 'ua',
                container: this._body
            });
        }

        this.elem({
            name: 'close',
            props: {
                innerHTML: '×',
                onclick: function() {
                    that.hide();
                }
            },
            container: this._container
        });

        this._actions = this.elem({
            name: 'actions',
            container: this._container
        });

        this.elem({
            tag: 'input',
            name: 'copy',
            props: {
                type: 'button',
                value: 'Copy',
                onclick: function() {
                    that.copyText();
                }
            },
            container: this._actions
        });

        this._arrows = this.elem({
            tag: 'span',
            name: 'arrows',
            container: this._actions
        });

        this._prev = this.elem({
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

                    that.update();
                }
            },
            container: this._arrows
        });

        this._num = this.elem({
            tag: 'span',
            name: 'num',
            props: {
                innerHTML: this._i + 1
            },
            container: this._arrows
        });

        this._next = this.elem({
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

                    that.update();
                }
            },
            container: this._arrows
        });

        if (this.settings.send) {
            this._sendLink = this.elem({
                tag: 'a',
                name: 'send-link',
                props: {
                    href: '',
                    target: '_blank'
                },
                container: this._actions
            });

            this._send = this.elem({
                tag: 'input',
                name: 'send',
                props: {
                    type: 'button',
                    value: 'Send'
                },
                container: this._sendLink
            });
        }

        if (document.body) {
            document.body.appendChild(this._container);
        } else {
            document.addEventListener('DOMContentLoaded', function() {
                document.body.appendChild(that._container);
            }, false);
        }
    },
    elem: function(data) {
        var el = document.createElement(data.tag || 'div'),
            props = data.props;

        for (var i in props) {
            if (props.hasOwnProperty(i)) {
                el[i] = props[i];
            }
        }

        el.className = this.elemClass(data.name);

        data.container.appendChild(el);

        return el;
    },
    elemClass: function(name, mod) {
        var cl = 'show-js-error';
        if (name) {
            cl += '__' + name;
        }

        if (mod) {
            cl += ' ' + cl + '_' + mod;
        }

        return cl;
    },
    copyText: function() {
        var err = this._buffer[this._i],
            text = [
                err.message,
                this.getFilenameWithPosition(err),
                navigator.userAgent
            ].join('\n'),
            body = document.body;

        var textarea = this.elem({
            name: 'textarea',
            tag: 'textarea',
            props: {
                innerHTML: text
            },
            container: body
        });

        try {
            textarea.select();
            document.execCommand('copy');
        } catch(e) {
            alert('Copying text is not supported in this browser.');
        }

        body.removeChild(textarea);
    },
    toggleDetailed: function() {
        if (this._toggleDetailed) {
            this._toggleDetailed = false;
            this._body.className = this.elemClass('body');
        } else {
            this._toggleDetailed = true;
            this._body.className = this.elemClass('body', 'detailed');
        }
    },
    escapeHTML: function(text) {
        return (text || '').replace(/[&<>"'\/]/g, function(sym) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                '\'': '&#39;',
                '/': '&#x2F;'
            }[sym];
        });
    }
};
