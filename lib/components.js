// d3-jsx Version 0.0.1. Copyright 2017 Microsoft.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.d3 = global.d3 || {}, global.d3.jsx = global.d3.jsx || {})));
}(this, (function (exports) { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};



function unwrapExports (x) {
	return x && x.__esModule ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var applyAttributes = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXCLUDED_PROPS = {
    append: true,
    attr: true,
    // used in conjunction with 'insert'
    before: true,
    // https://github.com/d3/d3-selection#selection_call
    call: true,
    // child jsx nodes
    children: true,
    // https://github.com/d3/d3-selection#selection_classed
    classed: true,
    // https://github.com/d3/d3-selection#selection_each
    each: true,
    // https://github.com/d3/d3-selection#selection_html
    html: true,
    // Insert and before can be used to render a basic element
    // https://github.com/d3/d3-selection#selection_insert
    insert: true,
    // https://github.com/d3/d3-selection#selection_on
    on: true,
    // https://github.com/d3/d3-selection#selection_property
    property: true,
    remove: true,
    selection: true,
    /**
     * Allows the client to access the selection via a ref function at any point in the tree
     */
    selectionRef: true,
    // https://github.com/d3/d3-selection#selection_style
    style: true,
    // https://github.com/d3/d3-selection#selection_text
    text: true,
};
function applyAttrs(props, selection, excluded) {
    if (excluded === void 0) { excluded = exports.EXCLUDED_PROPS; }
    if (props.attr) {
        exports.applyMapAttribute(props, selection, 'attr');
    }
    Object.keys(props).forEach(function (key) {
        if (!excluded[key]) {
            selection.attr(key, props[key]);
        }
    });
}
exports.applyAttrs = applyAttrs;
exports.applyMapAttribute = function (props, selection, name) {
    if (props[name]) {
        Object.keys(props[name]).forEach(function (key) {
            var value = props[name][key];
            (selection[name])(key, value);
        });
    }
};
exports.applyAttribute = function (props, selection, name) {
    if (props[name]) {
        (selection[name])(props[name]);
    }
};
});

var ElementImpl_1 = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents an element in a JSX tree
 */
var ElementImpl = (function () {
    function ElementImpl(type, props, content) {
        this.type = type;
        this.props = props;
        this.content = content;
    }
    return ElementImpl;
}());
exports.default = ElementImpl;
});

var RenderResultImpl_1 = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Rendering results from a custom element. This is only necessary when the selection
 * is mutated.
 */
var RenderResultImpl = (function () {
    function RenderResultImpl(rendered, selection) {
        this.rendered = rendered;
        this.selection = selection;
        this.rendered = rendered;
        this.selection = selection;
    }
    return RenderResultImpl;
}());
exports.default = RenderResultImpl;
});

var index$2 = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

exports.ElementImpl = ElementImpl_1.default;

exports.RenderResultImpl = RenderResultImpl_1.default;
});

var render_1 = createCommonjsModule(function (module, exports) {
"use strict";
var __assign = (commonjsGlobal && commonjsGlobal.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });


function mergeRefs(refs, childRefs) {
    return {
        selections: __assign({}, refs.selections, childRefs.selections),
    };
}
function renderBasicElement(element, parentSelection) {
    var elType = element.type;
    // Insert the element
    var selection = element.props.insert ?
        parentSelection.insert(elType, element.props.before || undefined) :
        parentSelection.append(elType);
    // Apply attributes to the element
    applyAttributes.applyAttrs(element.props, selection);
    ['style', 'classed', 'property', 'on'].forEach(function (name) { return applyAttributes.applyMapAttribute(element.props, selection, name); });
    ['call', 'each', 'text', 'html'].forEach(function (name) { return applyAttributes.applyAttribute(element.props, selection, name); });
    // Render Children
    var refs = { selections: {} };
    if (element.content.length > 0) {
        element.content.forEach(function (c) {
            if (c instanceof index$2.ElementImpl) {
                var childRefs = renderElement(c, selection);
                refs = mergeRefs(refs, childRefs);
            }
            else {
                selection.text(c);
            }
        });
    }
    handleSelectionRef(element.props.selectionRef, selection, refs);
    return refs;
}
function handleSelectionRef(selRef, selection, refMap) {
    if (selRef) {
        if (typeof selRef === 'function') {
            selRef(selection);
        }
        else if (typeof selRef === 'string') {
            refMap.selections[selRef] = selection;
        }
        else {
            throw new Error('could not handle selectionRef type ' + typeof selRef);
        }
    }
}
function renderFunctionElement(element, selection) {
    var props = __assign({}, element.props, { children: element.content, selection: selection });
    var renderResult = element.type(props);
    var rendered;
    if (renderResult instanceof index$2.RenderResultImpl) {
        rendered = renderResult.rendered;
        selection = renderResult.selection;
    }
    else {
        rendered = renderResult;
    }
    var refMap = { selections: {} };
    handleSelectionRef(element.props.selectionRef, selection, refMap);
    if (Array.isArray(rendered)) {
        rendered
            .map(function (r) { return renderElement(r, selection); })
            .forEach(function (rm) { return (refMap = mergeRefs(refMap, rm)); });
    }
    else {
        var rm = renderElement(rendered, selection);
        refMap = mergeRefs(refMap, rm);
    }
    return refMap;
}
function renderElement(element, selection) {
    if (typeof element.type === 'string') {
        return renderBasicElement(element, selection);
    }
    else if (typeof element.type === 'function') {
        return renderFunctionElement(element, selection);
    }
    else {
        console.error(// tslint:disable-line no-console
        "unable to handle element of type " + typeof element, element, selection);
        throw new Error('could not handle element');
    }
}
function render(selection) {
    var elements = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        elements[_i - 1] = arguments[_i];
    }
    var result = { selections: {} };
    elements.forEach(function (e) {
        var refs = renderElement(e, selection);
        result = mergeRefs(result, refs);
    });
    return result;
}
exports.default = render;
});

var createElement_1 = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

/**
 * The JSX Element Factor
 * @param type The element type
 * @param props The element property map
 * @param content The child elements or content
 */
function createElement(type, props) {
    var content = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        content[_i - 2] = arguments[_i];
    }
    return new index$2.ElementImpl(type, props || {}, content || []);
}
exports.default = createElement;
});

var Select_1 = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });


/**
 * https://github.com/d3/d3-selection#select
 * https://github.com/d3/d3-selection#selectAll
 */
var Select = function (props) {
    var newSelection = updateSelection(props.selection, props);
    if (props.rebind) {
        props.rebind(function (mutator) {
            var newSel = mutator(applySelector(props.selection, props));
            render_1.default.apply(void 0, [newSel].concat(props.children));
        });
    }
    return new index$2.RenderResultImpl(props.children, newSelection);
};
function applySelector(selection, props) {
    var all = props.all, selector = props.selector;
    return all ?
        selection.selectAll(selector) :
        selection.select(selector);
}
function updateSelection(selection, props) {
    var selector = props.selector, filter = props.filter, data = props.data, dataKey = props["data-key"], sort = props.sort;
    if (!selector) {
        throw new Error('Select must have a selector prop defined');
    }
    var newSelection = applySelector(selection, props);
    if (data) {
        if (dataKey) {
            newSelection = newSelection.data(data, dataKey);
        }
        else {
            newSelection = newSelection.data(data);
        }
    }
    if (filter) {
        newSelection = newSelection.filter(filter);
    }
    if (sort) {
        newSelection = newSelection.sort(sort);
    }
    return newSelection;
}
exports.default = Select;
});

var Enter_1 = createCommonjsModule(function (module, exports) {
"use strict";
var __assign = (commonjsGlobal && commonjsGlobal.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });

var Enter = function (props) {
    var selection = props.selection, children = props.children, append = props.append, insert = props.insert;
    var newSelection = selection.enter();
    // If the 'append' or 'insert' props are inbound, inject a basic element
    var injectedChild;
    if (append || insert) {
        var childProps = __assign({}, props, { children: children, insert: !!props.insert });
        delete childProps.insert;
        delete childProps.before;
        var name_1 = append || insert;
        injectedChild = new index$2.ElementImpl(name_1, childProps, children);
    }
    var resultChildren = injectedChild ? [injectedChild] : children;
    return new index$2.RenderResultImpl(resultChildren, newSelection);
};
exports.default = Enter;
});

var Exit_1 = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });


var Exit = function (props) {
    var selection = props.selection, children = props.children, remove = props.remove;
    var newSelection = selection.exit();
    applyAttributes.applyAttrs(props, newSelection);
    ['style', 'styleTween'].forEach(function (name) { return (applyAttributes.applyMapAttribute(props, newSelection, name)); });
    if (remove) {
        newSelection = newSelection.remove();
    }
    return new index$2.RenderResultImpl(children, newSelection);
};
exports.default = Exit;
});

var Update_1 = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });


var Update = function (props) {
    var selection = props.selection, children = props.children;
    applyAttributes.applyAttrs(props, selection);
    ['style', 'styleTween'].forEach(function (name) { return (applyAttributes.applyMapAttribute(props, selection, name)); });
    applyAttributes.applyAttrs(props, selection);
    ['style', 'classed', 'property', 'on'].forEach(function (name) { return applyAttributes.applyMapAttribute(props, selection, name); });
    ['call', 'each', 'text', 'html'].forEach(function (name) { return applyAttributes.applyAttribute(props, selection, name); });
    return new index$2.RenderResultImpl(children, selection);
};
exports.default = Update;
});

var Transition_1 = createCommonjsModule(function (module, exports) {
"use strict";
var __assign = (commonjsGlobal && commonjsGlobal.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });


var TRANSITION_PROPS = {
    attrTween: true,
    delay: true,
    duration: true,
    ease: true,
    parent: true,
    styleTween: true,
    tween: true,
};
var Transition = function (props) {
    var selection = props.selection, children = props.children, remove = props.remove, duration = props.duration, delay = props.delay, ease = props.ease, parent = props.parent;
    var transition = parent ? selection.transition(parent) : selection.transition();
    if (duration) {
        transition = transition.duration(duration);
    }
    if (delay) {
        transition = transition.delay(delay);
    }
    if (ease) {
        transition = transition.ease(ease);
    }
    applyAttributes.applyAttrs(props, transition, __assign({}, applyAttributes.EXCLUDED_PROPS, TRANSITION_PROPS));
    ['tween', 'style', 'styleTween', 'attrTween'].forEach(function (name) { return (applyAttributes.applyMapAttribute(props, transition, name)); });
    // Apply Transition Properties
    if (remove) {
        transition = transition.remove();
    }
    return new index$2.RenderResultImpl(children, transition);
};
exports.default = Transition;
});

var Grouping_1 = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

var Grouping = function (_a) {
    var selection = _a.selection, children = _a.children;
    return new index$2.RenderResultImpl(children, selection);
};
exports.default = Grouping;
});

var index$4 = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

exports.Select = Select_1.default;

exports.Enter = Enter_1.default;

exports.Exit = Exit_1.default;

exports.Update = Update_1.default;

exports.Transition = Transition_1.default;

exports.Grouping = Grouping_1.default;
});

var index = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

exports.render = render_1.default;

exports.createElement = createElement_1.default;

exports.Select = index$4.Select;
exports.Enter = index$4.Enter;
exports.Exit = index$4.Exit;
exports.Update = index$4.Update;
exports.Transition = index$4.Transition;
exports.Grouping = index$4.Grouping;
});

var index$1 = unwrapExports(index);
var index_1 = index.render;
var index_2 = index.createElement;
var index_3 = index.Select;
var index_4 = index.Enter;
var index_5 = index.Exit;
var index_6 = index.Update;
var index_7 = index.Transition;
var index_8 = index.Grouping;

exports['default'] = index$1;
exports.render = index_1;
exports.createElement = index_2;
exports.Select = index_3;
exports.Enter = index_4;
exports.Exit = index_5;
exports.Update = index_6;
exports.Transition = index_7;
exports.Grouping = index_8;

Object.defineProperty(exports, '__esModule', { value: true });

})));
