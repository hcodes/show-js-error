export function getScreenSize(): string {
    return [screen.width, screen.height, screen.colorDepth].join('×');
}

export function getScreenOrientation(): string {
    return typeof screen.orientation === 'string' ? screen.orientation : screen.orientation.type;
}

export function copyTextToClipboard(text: string) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);

    try {
        textarea.select();
        document.execCommand('copy');
    } catch (e) {
        alert('Copying text is not supported in this browser.');
    }

    document.body.removeChild(textarea);
}

export function injectStyle(style: string) {
    const styleNode = document.createElement('style');
    document.body.appendChild(styleNode);

    styleNode.textContent = style;

    return styleNode;
}
