import { ShowJSError } from './ShowJSError';
declare global {
    interface Window {
        showJSError: ShowJSError;
    }
}
declare const showJSError: ShowJSError;
export default showJSError;
