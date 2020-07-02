var screen = typeof window.screen === 'object' ? window.screen : {};

export function getScreenSize() {
    return [screen.width, screen.height, screen.colorDepth].join('×');
}

export function getScreenOrientation() {
    var orientation = screen.orientation || screen.mozOrientation || screen.msOrientation || '';

    return typeof orientation === 'string' ? orientation : orientation.type;
}

/**
 * Copy error message to clipboard.
 */
export function copyText(text) {
    var textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    document.body.appendChild(textarea);

    try {
        textarea.select();
        document.execCommand('copy');
    } catch (e) {
        alert('Copying text is not supported in this browser.');
    }

    document.body.removeChild(textarea);
}
