import { ExtendedError } from './helpers/error';
export interface ShowJSErrorSettings {
    reportUrl?: string;
    templateDetailedMessage?: string;
}
declare class ShowJSError {
    private elems;
    private settings;
    private state;
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
declare const showJSError: ShowJSError;
export default showJSError;
