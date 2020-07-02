/**
 * Escape HTML.
 *
 * @param {String} text
 * @returns {String}
 */
export function escapeHTML(text) {
    return (text || '').replace(/[&<>"'/]/g, function(sym) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#39;',
            '/': '&#x2F;'
        }[sym];
    });
}
