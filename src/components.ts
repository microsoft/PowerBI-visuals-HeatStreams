module essex.d3components {
    export type BasicSelection = d3.Selection<any, any, any, any>;
    export const ON_PREFIX = '__ON_EVENT__';
    export const on = (event: string) => `${ON_PREFIX}${event}`;

    export interface D3Props {
        parent?: BasicSelection;
        children?: D3Component<any>[];

        /**
         * Raw props to map over
         */
        [key: string]: any;
    }

    export interface RenderResults {
        selection: BasicSelection;
        continuation?: D3Component<any> | D3Component<any>[] | null;
    }

    export interface D3Component<P extends D3Props> {
        props: P;
        render(): RenderResults;
    }

    export class BaseComponent<P extends D3Props> implements D3Component<P> {
        constructor(public props: P) {
        }

        public render(): RenderResults {
            console.error('You must override the render() method in your component');
            return { selection: this.props.parent };
        }
    }

    export interface SelectProps extends D3Props {
        /**
         * The selector string used to define the selection
         */
        selector: string;
    }

    export class Select extends BaseComponent<SelectProps> {
        public props: SelectProps;

        render(): RenderResults {
            return {
                selection: this.props.parent.select(this.props.selector),
            };
        }
    }

    export interface SelectAllComponentProps extends D3Props {
        /**
         * The selector string used to define the selection
         */
        selector: string;
    }

    export class SelectAll extends BaseComponent<SelectAllComponentProps> {
        public props: SelectAllComponentProps;

        render(): RenderResults {
            return {
                selection: this.props.parent.selectAll(this.props.selector),
            };
        }
    }

    export interface EnterProps extends D3Props {
    }

    export class Enter extends BaseComponent<EnterProps> {
        public props: EnterProps;

        render(): RenderResults {
            return {
                selection: this.props.parent.enter(),
            };
        }
    }

    export interface ExitProps extends D3Props {
    }

    export class Exit extends BaseComponent<ExitProps> {
        public props: ExitProps;

        render(): RenderResults {
            return {
                selection: this.props.parent.exit(),
            };
        }
    }

    export interface DataProps extends D3Props {
        data: d3.ValueFn<any, any, {}[]>;
        key?: any; // Function
    }

    export class Data extends BaseComponent<DataProps> {
        public props: DataProps;

        render(): RenderResults {
            return {
                selection: this.props.parent.data(this.props.data, this.props.key),
            };
        }
    }


    export interface DomProps extends D3Props {
        /**
         * The tag type to us{e
         */
        type: string;

        call?: any;
        each?: any;

        /**
         * The inner text of the Dom node
         */
        text?: d3.ValueFn<any, any, string | number | boolean>;
    }

    /**
     * Prop keys excluded from being folded over to attributes
     */
    const EXCLUDED_KEYS = {
        'type': true,
        'text': true,
        'call': true,
        'each': true,
        'children': true,
        'parent': true,
    };

    export class Dom extends BaseComponent<DomProps> {
        public props: DomProps;

        render(): RenderResults {
            console.log("Render DOM Node", this.props);
            let result = this.props.parent.append(this.props.type);

            Object.keys(this.props).forEach(key => {
                if (!EXCLUDED_KEYS[key]) {
                    if (key.indexOf(ON_PREFIX) === 0) {
                        const eventName = key.slice(ON_PREFIX.length);
                        result = result.on(eventName, this.props[key]);
                    } else {
                        result = result.attr(key, this.props[key]);
                    }
                }
            });

            if (this.props.call) {
                result = result.call(this.props.call);
            }

            if (this.props.each) {
                result = result.each(this.props.each);
            }

            if (this.props.text) {
                result = result.text(this.props.text);
            }

            return {selection: result};
        }
    }

    export function createComponent<P extends D3Props>(componentClass: any, props: P, children: any[] = []) {
        props.children = !children ? null : children;
        const result = new componentClass(props);
        return result;
    }

    export function render(component: D3Component<any>, root: BasicSelection) {
        component.props.parent = root;
        const { selection, continuation } = component.render(); // should return either a raw selection or a component

        if (!continuation) {
            if (component.props.children) {
                console.log(`Null Continuation, checking ${component.props.children.length} children`);
                return component.props.children.map(c => render(c, selection));
            }
            return null;
        } else if (Array.isArray(continuation)) {
            console.log("Array Continuation");
            return continuation.map(c => render(c, selection));
        } else {
            console.log("Render", continuation);
            return render(continuation, selection);
        }
    }
}