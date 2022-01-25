interface ElemData {
    name: string;
    container: HTMLElement;
    tag?: string;
    props?: Record<string, any>;
}
export declare function createElem<T = HTMLDivElement>(data: ElemData): T;
export declare function buildElemClass(name: string, mod?: Record<string, string | number | boolean | null | undefined>): string;
export {};
