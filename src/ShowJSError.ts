import { getScreenSize, getScreenOrientation, copyTextToClipboard, injectStyle } from './helpers/dom';
import { createElem, buildElemClass } from './helpers/elem';
import { getStack, getFilenameWithPosition, getMessage, ExtendedError } from './helpers/error';

export interface ShowJSErrorSettings {
    reportUrl?: string;
    templateDetailedMessage?: string;
    size?: 'big' | 'normal';
}

export interface ShowJSErrorElems {
    actions: HTMLDivElement;
    close: HTMLDivElement;
    container: HTMLDivElement;

    body: HTMLDivElement;
    message: HTMLDivElement;
    title: HTMLDivElement;

    filename: HTMLDivElement;

    arrows: HTMLDivElement;
    prev: HTMLInputElement;
    num: HTMLSpanElement;
    next: HTMLInputElement;

    report: HTMLInputElement;
    reportLink: HTMLLinkElement;
}

export interface ShowJSErrorState {
    appended: boolean;
    detailed: boolean;
    errorIndex: number;
    errorBuffer: ExtendedError[];
}

const STYLE = '{STYLE}';

export class ShowJSError {
    private elems: Partial<ShowJSErrorElems> = {};

    private settings: Required<ShowJSErrorSettings>;

    private state: ShowJSErrorState = {
        appended: false,
        detailed: false,
        errorIndex: 0,
        errorBuffer: [],
    };

    private styleNode?: HTMLStyleElement;

    constructor() {
        this.settings = this.prepareSettings();        

        window.addEventListener('error', this.onerror, false);
        window.addEventListener('unhandledrejection', this.onunhandledrejection, false);
        document.addEventListener('securitypolicyviolation', this.onsecuritypolicyviolation, false);
    }

    public destruct() {
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
            this.styleNode.parentNode?.removeChild(this.styleNode);
            this.styleNode = undefined;
        }
    }

    public setSettings(settings: ShowJSErrorSettings) {
        this.settings = this.prepareSettings(settings);

        if (this.state.appended) {
            this.updateUI();
        }
    }

    /**
     * Show error panel with transmitted error.
     */
     public show(error: string | ExtendedError | Error) {
        if (!error) {
            this.showUI();

            return;
        }

        if (typeof error === 'string') {
            this.pushError({ message: error });
        } else {
            this.pushError(
                typeof error === 'object' ?
                    error :
                    new Error(error)
            );
        }
    }

    /**
     * Hide error panel.
     */
    public hide() {
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
    public clear() {
        this.state.errorBuffer = [];
        this.state.detailed = false;

        this.setCurrentError(0);
    }

    /**
     * Toggle view (shortly/detail).
     */
    public toggleView() {
        this.state.detailed = !this.state.detailed;
        this.updateUI();
    }

    private prepareSettings(rawSettings?: ShowJSErrorSettings): Required<ShowJSErrorSettings> {
        const settings: ShowJSErrorSettings = rawSettings || {};

        return {
            size: settings.size || 'normal',
            reportUrl: settings.reportUrl || '',
            templateDetailedMessage: settings.templateDetailedMessage || '',
        };
    }

    private onerror = (event: ErrorEvent) => {
        const error = event.error ? event.error : event;

        console.log(1, event);
        this.pushError({
            title: 'JavaScript Error',
            message: error.message,
            filename: error.filename,
            colno: error.colno,
            lineno: error.lineno,
            stack: error.stack,
        });
    }

    private onsecuritypolicyviolation = (error: SecurityPolicyViolationEvent) => {
        this.pushError({
            title: 'CSP Error',
            message: `blockedURI: ${error.blockedURI || ''}\n violatedDirective: ${error.violatedDirective} || ''\n originalPolicy: ${error.originalPolicy || ''}`,
            colno: error.columnNumber,
            filename: error.sourceFile,
            lineno: error.lineNumber,
        });
    }

    private onunhandledrejection = (error: PromiseRejectionEvent) => {
        this.pushError({
            title: 'Unhandled promise rejection',
            message: error.reason.message,
            colno: error.reason.colno,
            filename: error.reason.filename,
            lineno: error.reason.lineno,
            stack: error.reason.stack,
        });
    }

    private pushError(error: ExtendedError) {
        this.state.errorBuffer.push(error);
        this.state.errorIndex = this.state.errorBuffer.length - 1;

        this.updateUI();
    }

    private appendUI() {
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

        const body: HTMLDivElement = createElem({
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
        } else {
            document.addEventListener('DOMContentLoaded', this.appendToBody, false);
        }
    }

    private appendToBody = () => {
        document.removeEventListener('DOMContentLoaded', this.appendToBody, false);
        if (this.elems.container) {
            this.styleNode = injectStyle(STYLE);
            document.body.appendChild(this.elems.container);
        }
    }

    private createActions(container: HTMLDivElement) {
        const actions: HTMLDivElement = createElem({
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

        const reportLink: HTMLLinkElement = createElem({
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

    private createArrows(container: HTMLDivElement) {
        const arrows: HTMLDivElement = createElem({
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

    private getDetailedMessage(error?: ExtendedError) {
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

    private getTitle(error?: ExtendedError) {
        return error ? (error.title || 'Error') : 'No errors';
    }

    private showUI() {
        if (this.elems.container) {
            this.elems.container.className = buildElemClass('', {
                size: this.settings.size,
            });
        }
    }

    private hasStack() {
        const error = this.getCurrentError();

        return error && (error.stack || error.filename);
    }

    private getCurrentError(): ExtendedError | undefined {
        return this.state.errorBuffer[this.state.errorIndex];
    }

    private setCurrentError(index: number) {
        const length = this.state.errorBuffer.length;

        let newIndex = index;
        if (newIndex > length - 1) {
            newIndex = length - 1;
        } else if (newIndex < 0) {
            newIndex = 0;
        }

        this.state.errorIndex = newIndex;

        this.updateUI();
    }

    private updateUI() {
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

    private updateArrows(error?: ExtendedError) {
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
};
