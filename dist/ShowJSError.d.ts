import { ExtendedError } from './helpers/error';
export interface ShowJSErrorSettings {
    reportUrl?: string;
    templateDetailedMessage?: string;
    size?: 'big' | 'normal';
    errorFilter?: (error: ExtendedError) => boolean;
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
export declare class ShowJSError {
    private elems;
    private settings;
    private state;
    private styleNode?;
    constructor();
    destruct(): void;
    setSettings(settings: ShowJSErrorSettings): void;
    /**
     * Show error panel with transmitted error.
     */
    show(error: string | ExtendedError | Error): void;
    /**
     * Hide error panel.
     */
    hide(): void;
    /**
     * Clear error panel.
     */
    clear(): void;
    /**
     * Toggle view (shortly/detail).
     */
    toggleView(): void;
    private prepareSettings;
    private onerror;
    private onsecuritypolicyviolation;
    private onunhandledrejection;
    private pushError;
    private appendUI;
    private appendToBody;
    private createActions;
    private createArrows;
    private getDetailedMessage;
    private getTitle;
    private showUI;
    private hasStack;
    private getCurrentError;
    private setCurrentError;
    private updateUI;
    private updateArrows;
}
