import { escapeHTML } from './escapeHTML';

export function getStack(err) {
    return (err.error && err.error.stack) || err.stack || '';
}

export function getExtFilename(e) {
    var filename = e.filename,
        html = escapeHTML(getFilenameWithPosition(e));

    if (filename && filename.search(/^(https?|file):/) > -1) {
        return '<a target="_blank" href="' +
            escapeHTML(filename) + '">' + html + '</a>';
    } else {
        return html;
    }
}

function get(value, defaultValue) {
    return typeof value === 'undefined' ? defaultValue : value;
}

export function getFilenameWithPosition(e) {
    var text = e.filename || '';
    if (typeof e.lineno !== 'undefined') {
        text += ':' + get(e.lineno, '');
        if (typeof e.colno !== 'undefined') {
            text += ':' + get(e.colno, '');
        }
    }

    return text;
}

export function getMessage(e) {
    var msg = e.message;

    // IE
    if (e.error && e.error.name && 'number' in e.error) {
        msg = e.error.name + ': ' + msg;
    }

    return msg;
}
