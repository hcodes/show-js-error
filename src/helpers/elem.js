/**
 * Create a elem.
 *
 * @param {Object} data
 * @param {String} data.name
 * @param {DOMElement} data.container
 * @param {String} [data.tag]
 * @param {Object} [data.props]
 * @returns {DOMElement}
 */
export function elem(data) {
    var el = document.createElement(data.tag || 'div'),
        props = data.props;

    for (var i in props) {
        // eslint-disable-next-line no-prototype-builtins
        if (props.hasOwnProperty(i)) {
            el[i] = props[i];
        }
    }

    el.className = elemClass(data.name);

    data.container.appendChild(el);

    return el;
}

/**
 * Build className for elem.
 *
 * @param {String} [name]
 * @param {String} [mod]
 * @returns {String}
 */
export function elemClass(name, mod) {
    var cl = 'show-js-error';
    if (name) {
        cl += '__' + name;
    }

    if (mod) {
        cl += ' ' + cl + '_' + mod;
    }

    return cl;
}
