declare namespace JSX {
    interface IntrinsicElements {
        [key: string]: any;
    }
    interface Element {
        type: string;
        props: any;
        content: any[];
    }
}
module D3Components {
    type D3Selection = d3.Selection<any, any, any, any>;
    type D3Primitive = d3.ValueFn<any, any, string | number | boolean>;

    /**
     * A property map for a component
     */
    export interface ElementProps {
        each?: Function;
        [key: string]: any;
    }

    export interface InjectedElementProps extends ElementProps{
        selection: D3Selection;
        children: ElementContent[];
    }

    /**
     * Child content types in JSX elements
     */
    export type ElementContent = Element | D3Primitive;

    /**
     * Rendering results from a custom element. This is only necessary when the selection
     * is mutated.
     */
    export class RenderResult {
        constructor(
            public rendered: Element | Element[],
            public selection: D3Selection,
        ) {
            this.rendered = rendered;
            this.selection = selection;
        }
    }

    /**
     * The function interface for a custom element function
     */
    interface CustomElementFunction {
        (props: ElementProps): Element | RenderResult;
    }

    /**
     * An interface for a JSX element
     */
    export interface Element {
        type: string | CustomElementFunction;
        props: ElementProps;
        content: ElementContent[];
    }

    /**
     * Represents an element in a JSX tree
     */
    class ElementImpl implements Element {
        constructor(
            public type: string,
            public props: ElementProps,
            public content: ElementContent[],
        ) {
        }
    }

    /**
     * The JSX Element Factor
     * @param type The element type
     * @param props The element property map
     * @param content The child elements or content
     */
    export function createElement(
        type: string,
        props: ElementProps,
        ...content: ElementContent[],
    ) {
        return new ElementImpl(type, props || {} as ElementProps, content || []);
    }

    /**
     * Properties that are not transmitted to DOM elements
     */
    interface FlagMap {
        [key: string]: boolean
    }
    const EXCLUDED_PROPS: FlagMap = {
        text: true,
        each: true,
        call: true,
        on: true,
        style: true,
    };

    function renderBasicElement(element: Element, selection: D3Selection): D3Selection | D3Selection[] {
        let result = selection.append(element.type as string);

        Object.keys(element.props).forEach(key => {
            if (!EXCLUDED_PROPS[key]) {
                result = result.attr(key, element.props[key]);
            }
        });

        if (element.props['style']) {
            Object.keys(element.props['style']).forEach(styleKey => {
                result = result.style(styleKey, element.props['style'][styleKey]);
            });
        }

        if (element.props['on']) {
            Object.keys(element.props['on']).forEach(onKey => {
                result = result.on(onKey, element.props['on'][onKey]);
            });
        }
        if (element.props['call']) {
            result = result.call(element.props['call']);
        }

        if (element.props['each']) {
            result = result.each(element.props['each'] as any);
        }

        if (element.props['text']) {
            result = result.text(element.props['text']);
        }

        if (element.content.length > 0) {
            element.content.forEach(c => {
                const contentType = typeof c;
                if (c instanceof ElementImpl) {
                    render(c as Element, result);
                } else if (contentType === 'string' || contentType === 'function') {
                    result = result.text(c as D3Primitive);
                }
            });
        }

        return result;
    }

    function renderFunctionElement(element: Element, selection: D3Selection): D3Selection | D3Selection[] {
        const props = {
            ...element.props,
            children: element.content,
            selection,
        };
        const renderResult = (element.type as CustomElementFunction)(props);

        let rendered = null;
        if (renderResult instanceof RenderResult) {
            rendered = renderResult.rendered;
            selection = renderResult.selection;
        } else {
            rendered = renderResult;
        }
        
        const assembleChildProps = (rendered) => {
            // Pass d3 directives down until they hit a DOM node
            Object.keys(EXCLUDED_PROPS).forEach(excludedProp => {
                if (element.props[excludedProp]) {
                    rendered.props[excludedProp] = element.props[excludedProp];
                }
            });
        };

        if (Array.isArray(rendered)) {
            rendered.forEach(r => assembleChildProps(r));
            return rendered.map(r => render(r, selection)) as D3Selection[];
        } else {
            assembleChildProps(rendered);
            return render(rendered, selection);
        }
    }

    export function render(element: Element, selection: D3Selection): D3Selection | D3Selection[] {
        const elementTypeType = typeof element.type;
        if (elementTypeType === "string") {
            return renderBasicElement(element, selection);
        } else if (elementTypeType === "function") {
            return renderFunctionElement(element, selection);
        }

        return selection;
    }

    export const Select: CustomElementFunction = ({
        selection,
        children,
        selector,
        data,
        all,
    }) => {
        if (!selector) {
            throw new Error('Select must have a selector prop defined');
        }
        let newSelection = all ?
            selection.selectAll(selector) :
            selection.select(selector);

        if (data) {
            newSelection = newSelection.data(data);
        }

        return new RenderResult(children as Element[], newSelection);
    };

    export const Data: CustomElementFunction = ({
        selection,
        children,
        data,
    }) => {
        if (!data) {
            throw new Error('Data must have data defined');
        }
        const newSelection = selection.data(data);
        return new RenderResult(children as Element[], newSelection);
    };

    export const Enter: CustomElementFunction = ({
        selection,
        children,
    }) => {
        let newSelection = selection.enter();
        return new RenderResult(children as Element[], newSelection);
    };

    export const Exit: CustomElementFunction = ({
        selection,
        children,
    }) => {
        let newSelection = selection.exit();
        return new RenderResult(children as Element[], newSelection);
    };
}