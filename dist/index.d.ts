import { ShowJSError } from './ShowJSError';
declare global {
    interface Window {
        showJSError: ShowJSError;
    }
}
export declare const showJSError: ShowJSError;
