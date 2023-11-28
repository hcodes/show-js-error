/* eslint-disable @typescript-eslint/no-explicit-any */
interface ElemData {
    name: string;
    container: HTMLElement;
    tag?: string;
    props?: Record<string, any>;
}

export function createElem<T = HTMLDivElement>(data: ElemData): T {
    const elem = document.createElement(data.tag || 'div') as any;

    if (data.props) {
        addProps(elem, data.props);
    }

    elem.className = buildElemClass(data.name);

    data.container.appendChild(elem);

    return elem;
}

function addProps(elem: HTMLElement, props: Record<string, unknown>) {
    Object.keys(props).forEach(key => {
        (elem as any)[key] = props[key];
    });
}

export function buildElemClass(name: string, mod?: Record<string, string | number | boolean | null | undefined>): string {
    let elemName = 'show-js-error';
    if (name) {
        elemName += '__' + name;
    }

    let className = elemName;

    if (mod) {
        Object.keys(mod).forEach((modName) => {
            const modValue = mod[modName];
            if (modValue === false || modValue === null || modValue === undefined || modValue === '') {
                return;
            }

            if (mod[modName] === true) {
                className += ' ' + elemName + '_' + modName;
            } else {
                className += ' ' + elemName + '_' + modName + '_' + modValue;
            }
        });
    }

    return className;
}
