import { ShowJSError } from './ShowJSError';

declare global {
    interface Window {
        showJSError: ShowJSError;
    }
}

export const showJSError = new ShowJSError();

if (typeof window !== 'undefined') {
    window.showJSError = showJSError;
}
