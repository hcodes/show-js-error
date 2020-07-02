export function getMdnUrl(q) {
    return 'https://developer.mozilla.org/en-US/search?q=' + encodeURIComponent(q);
}

export function getStackOverflowUrl(q) {
    return 'https://stackoverflow.com/search?q=' + encodeURIComponent('[js] ' + q);
}
