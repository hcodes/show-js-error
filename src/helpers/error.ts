export interface ExtendedError {
    colno?: number;
    lineno?: number,
    filename?: string,
    message?: string,
    stack?: string;
    title?: string;
}

export function getStack(error?: ExtendedError): string {
    return error && error.stack || '';
}

export function getMessage(error?: ExtendedError): string {
    return error && error.message || '';
}

export function getFilenameWithPosition(error?: ExtendedError): string {
    if (!error) {
        return '';
    }

    let text = error.filename || '';
    if (typeof error.lineno !== 'undefined') {
        text += ':' + error.lineno;
        if (typeof error.colno !== 'undefined') {
            text += ':' + error.colno;
        }
    }

    return text;
}
