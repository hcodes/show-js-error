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

function getValue(value: number, defaultValue: string) {
    return typeof value === 'undefined' ? defaultValue : value;
}

export function getFilenameWithPosition(error?: ExtendedError): string {
    if (!error) {
        return '';
    }

    let text = error.filename || '';
    if (typeof error.lineno !== 'undefined') {
        text += ':' + getValue(error.lineno, '');
        if (typeof error.colno !== 'undefined') {
            text += ':' + getValue(error.colno, '');
        }
    }

    return text;
}
