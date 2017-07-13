D3Components =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ElementImpl_1 = __webpack_require__(5);
exports.ElementImpl = ElementImpl_1.default;
var RenderResultImpl_1 = __webpack_require__(6);
exports.RenderResultImpl = RenderResultImpl_1.default;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.EXCLUDED_PROPS = {
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
    /**
     * Allows the client to access the selection via a ref function at any point in the tree
     */
    selectionRef: true,
    // https://github.com/d3/d3-selection#selection_style
    style: true,
    // https://github.com/d3/d3-selection#selection_text
    text: true,
};
function applyAttrs(props, selection, excluded = exports.EXCLUDED_PROPS) {
    if (props.attr) {
        exports.applyMapAttribute(props, selection, 'attr');
    }
    Object.keys(props).forEach(key => {
        if (!excluded[key]) {
            selection.attr(key, props[key]);
        }
    });
}
exports.applyAttrs = applyAttrs;
exports.applyMapAttribute = (props, selection, name) => {
    if (props[name]) {
        Object.keys(props[name]).forEach(key => {
            const value = props[name][key];
            (selection[name])(key, value);
        });
    }
};
exports.applyAttribute = (props, selection, name) => {
    if (props[name]) {
        (selection[name])(props[name]);
    }
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var render_1 = __webpack_require__(3);
exports.render = render_1.default;
var createElement_1 = __webpack_require__(7);
exports.createElement = createElement_1.default;
__export(__webpack_require__(8));


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __webpack_require__(4);
const applyAttributes_1 = __webpack_require__(1);
const classes_1 = __webpack_require__(0);
const TRANSITION_FUNCTIONS = {
    attr: true,
    attrTween: true,
    style: true,
    styleTween: true,
};
function applyTransition(selection, transition) {
    transition.type(Object.assign({}, transition.props, { selection }));
}
function renderBasicElement(element, parentSelection) {
    const elType = element.type;
    // Insert the element
    const selection = element.props.insert ?
        parentSelection.insert(elType, element.props.before || undefined) :
        parentSelection.append(elType);
    // Apply attributes to the element
    applyAttributes_1.applyAttrs(element.props, selection);
    ['style', 'classed', 'property'].forEach((name) => applyAttributes_1.applyMapAttribute(element.props, selection, name));
    ['on', 'call', 'each', 'text', 'html'].forEach((name) => applyAttributes_1.applyAttribute(element.props, selection, name));
    // Render Children
    let refs = { selections: {} };
    if (element.content.length > 0) {
        element.content.forEach((c) => {
            const contentType = typeof c;
            if (c instanceof classes_1.ElementImpl) {
                const childRefs = renderElement(c, selection);
                refs = lodash_1.merge(refs, childRefs);
            }
            else {
                selection.text(c);
            }
        });
    }
    if (element.props.selectionRef) {
        refs.selections[element.props.selectionRef] = selection;
    }
    return refs;
}
function renderFunctionElement(element, selection) {
    const props = Object.assign({}, element.props, { children: element.content, selection });
    const renderResult = element.type(props);
    let rendered;
    if (renderResult instanceof classes_1.RenderResultImpl) {
        rendered = renderResult.rendered;
        selection = renderResult.selection;
    }
    else {
        rendered = renderResult;
    }
    let refMap = { selections: {} };
    if (element.props.selectionRef) {
        refMap.selections[element.props.selectionRef] = selection;
    }
    const assembleChildProps = (r) => {
        if (r instanceof Element) {
            // Pass d3 directives down until they hit a DOM node
            Object.keys(applyAttributes_1.EXCLUDED_PROPS).forEach((excludedProp) => {
                if (element.props[excludedProp]) {
                    r.props[excludedProp] = element.props[excludedProp];
                }
            });
        }
    };
    if (Array.isArray(rendered)) {
        rendered.forEach((r) => assembleChildProps(r));
        rendered
            .map((r) => renderElement(r, selection))
            .forEach((rm) => (refMap = lodash_1.merge(refMap, rm)));
    }
    else {
        if (rendered instanceof Element) {
            assembleChildProps(rendered);
        }
        const rm = renderElement(rendered, selection);
        refMap = lodash_1.merge(refMap, rm);
    }
    return refMap;
}
function renderElement(element, selection) {
    if (lodash_1.isString(element.type)) {
        return renderBasicElement(element, selection);
    }
    else if (lodash_1.isFunction(element.type)) {
        return renderFunctionElement(element, selection);
    }
    else {
        console.error(// tslint:disable-line no-console
        `unable to handle element of type ${typeof element}`, element, selection, new Error().stack);
        throw new Error('could not handle element');
    }
}
function render(selection, ...elements) {
    let result = { selections: {} };
    elements.forEach(e => {
        const refs = renderElement(e, selection);
        result = lodash_1.merge(result, refs);
    });
    return result;
}
exports.default = render;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = window._;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents an element in a JSX tree
 */
class ElementImpl {
    constructor(type, props, content) {
        this.type = type;
        this.props = props;
        this.content = content;
    }
    withProps(props) {
        this.props = Object.assign({}, this.props, props);
        return this;
    }
}
exports.default = ElementImpl;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Rendering results from a custom element. This is only necessary when the selection
 * is mutated.
 */
class RenderResultImpl {
    constructor(rendered, selection) {
        this.rendered = rendered;
        this.selection = selection;
        this.rendered = rendered;
        this.selection = selection;
    }
}
exports.default = RenderResultImpl;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = __webpack_require__(0);
/**
 * The JSX Element Factor
 * @param type The element type
 * @param props The element property map
 * @param content The child elements or content
 */
function createElement(type, props, ...content) {
    return new classes_1.ElementImpl(type, props || {}, content || []);
}
exports.default = createElement;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Select_1 = __webpack_require__(9);
exports.Select = Select_1.default;
var Enter_1 = __webpack_require__(10);
exports.Enter = Enter_1.default;
var Exit_1 = __webpack_require__(11);
exports.Exit = Exit_1.default;
var Update_1 = __webpack_require__(12);
exports.Update = Update_1.default;
var Transition_1 = __webpack_require__(13);
exports.Transition = Transition_1.default;
var Grouping_1 = __webpack_require__(14);
exports.Grouping = Grouping_1.default;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = __webpack_require__(0);
/**
 * https://github.com/d3/d3-selection#select
 * https://github.com/d3/d3-selection#selectAll
 */
const Select = ({ selection, children, selector, filter, data, 'data-key': dataKey, sort, all, }) => {
    if (!selector) {
        throw new Error('Select must have a selector prop defined');
    }
    let newSelection = all ?
        selection.selectAll(selector) :
        selection.select(selector);
    if (data) {
        newSelection = newSelection.data(data, dataKey || undefined);
    }
    if (filter) {
        newSelection = newSelection.filter(filter);
    }
    if (sort) {
        newSelection = newSelection.sort(sort);
    }
    return new classes_1.RenderResultImpl(children, newSelection);
};
exports.default = Select;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = __webpack_require__(0);
const Enter = (props) => {
    const { selection, children, append, insert, before, } = props;
    const newSelection = selection.enter();
    // If the 'append' or 'insert' props are inbound, inject a basic element
    let injectedChild;
    if (append || insert) {
        const childProps = Object.assign({}, props, { children, insert: !!props.insert });
        delete childProps.insert;
        delete childProps.before;
        const name = append || insert;
        injectedChild = new classes_1.ElementImpl(name, childProps, children);
    }
    const resultChildren = injectedChild ? [injectedChild] : children;
    return new classes_1.RenderResultImpl(resultChildren, newSelection);
};
exports.default = Enter;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const applyAttributes_1 = __webpack_require__(1);
const classes_1 = __webpack_require__(0);
const Exit = (props) => {
    const { selection, children, remove, } = props;
    let newSelection = selection.exit();
    if (remove) {
        newSelection = newSelection.remove();
    }
    applyAttributes_1.applyAttrs(props, selection, Object.assign({}, applyAttributes_1.EXCLUDED_PROPS, { attr: true, style: true }));
    ['style', 'styleTween'].forEach(name => (applyAttributes_1.applyMapAttribute(props, selection, name)));
    return new classes_1.RenderResultImpl(children, newSelection);
};
exports.default = Exit;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const applyAttributes_1 = __webpack_require__(1);
const classes_1 = __webpack_require__(0);
const UPDATE_PROPS = {};
const Update = (props) => {
    const { selection, children } = props;
    applyAttributes_1.applyAttrs(props, selection, Object.assign({}, applyAttributes_1.EXCLUDED_PROPS, UPDATE_PROPS));
    ['style', 'styleTween'].forEach(name => (applyAttributes_1.applyMapAttribute(props, selection, name)));
    return new classes_1.RenderResultImpl(children, selection);
};
exports.default = Update;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const applyAttributes_1 = __webpack_require__(1);
const classes_1 = __webpack_require__(0);
const TRANSITION_PROPS = {
    attrTween: true,
    delay: true,
    duration: true,
    ease: true,
    parent: true,
    remove: true,
    style: true,
    styleTween: true,
    text: true,
    tween: true,
};
const Transition = (props) => {
    const { selection, children, remove, duration, delay, ease, parent, } = props;
    let transition = parent ? selection.transition(parent) : selection.transition();
    if (duration) {
        transition = transition.duration(duration);
    }
    if (delay) {
        transition = transition.delay(delay);
    }
    if (ease) {
        transition = transition.ease(ease);
    }
    applyAttributes_1.applyAttrs(props, transition, Object.assign({}, applyAttributes_1.EXCLUDED_PROPS, TRANSITION_PROPS));
    ['tween', 'style', 'styleTween', 'attrTween'].forEach(name => (applyAttributes_1.applyMapAttribute(props, transition, name)));
    // Apply Transition Properties
    if (remove) {
        transition = transition.remove();
    }
    return new classes_1.RenderResultImpl(children, transition);
};
exports.default = Transition;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = __webpack_require__(0);
const Grouping = ({ selection, children, }) => {
    return new classes_1.RenderResultImpl(children, selection);
};
exports.default = Grouping;


/***/ })
/******/ ]);