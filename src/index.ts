import { ShowJSError } from './ShowJSError';

declare global {
    interface Window {
        showJSError: ShowJSError;
    }
}

const showJSError = new ShowJSError();

export default showJSError;
