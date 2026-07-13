export interface ExtendedError {
    colno?: number;
    lineno?: number;
    filename?: string;
    message?: string;
    stack?: string;
    title?: string;
}
export declare function getStack(error?: ExtendedError): string;
export declare function getMessage(error?: ExtendedError): string;
export declare function getFilenameWithPosition(error?: ExtendedError): string;
