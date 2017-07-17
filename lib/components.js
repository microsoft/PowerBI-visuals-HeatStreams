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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
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


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __webpack_require__(4);
var applyAttributes_1 = __webpack_require__(1);
var classes_1 = __webpack_require__(0);
function renderBasicElement(element, parentSelection) {
    var elType = element.type;
    // Insert the element
    var selection = element.props.insert ?
        parentSelection.insert(elType, element.props.before || undefined) :
        parentSelection.append(elType);
    // Apply attributes to the element
    applyAttributes_1.applyAttrs(element.props, selection);
    ['style', 'classed', 'property', 'on'].forEach(function (name) { return applyAttributes_1.applyMapAttribute(element.props, selection, name); });
    ['call', 'each', 'text', 'html'].forEach(function (name) { return applyAttributes_1.applyAttribute(element.props, selection, name); });
    // Render Children
    var refs = { selections: {} };
    if (element.content.length > 0) {
        element.content.forEach(function (c) {
            if (c instanceof classes_1.ElementImpl) {
                var childRefs = renderElement(c, selection);
                refs = lodash_1.merge(refs, childRefs);
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
    if (renderResult instanceof classes_1.RenderResultImpl) {
        rendered = renderResult.rendered;
        selection = renderResult.selection;
    }
    else {
        rendered = renderResult;
    }
    var refMap = { selections: {} };
    handleSelectionRef(element.props.selectionRef, selection, refMap);
    var assembleChildProps = function (r) {
        if (r instanceof Element) {
            // Pass d3 directives down until they hit a DOM node
            Object.keys(applyAttributes_1.EXCLUDED_PROPS).forEach(function (excludedProp) {
                if (element.props[excludedProp]) {
                    r.props[excludedProp] = element.props[excludedProp];
                }
            });
        }
    };
    if (Array.isArray(rendered)) {
        rendered.forEach(function (r) { return assembleChildProps(r); });
        rendered
            .map(function (r) { return renderElement(r, selection); })
            .forEach(function (rm) { return (refMap = lodash_1.merge(refMap, rm)); });
    }
    else {
        if (rendered instanceof Element) {
            assembleChildProps(rendered);
        }
        var rm = renderElement(rendered, selection);
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
        result = lodash_1.merge(result, refs);
    });
    return result;
}
exports.default = render;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var render_1 = __webpack_require__(2);
exports.render = render_1.default;
var createElement_1 = __webpack_require__(7);
exports.createElement = createElement_1.default;
__export(__webpack_require__(8));


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = window._;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
    ElementImpl.prototype.withProps = function (props) {
        this.props = __assign({}, this.props, { props: props });
        return this;
    };
    return ElementImpl;
}());
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


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var classes_1 = __webpack_require__(0);
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
var classes_1 = __webpack_require__(0);
var render_1 = __webpack_require__(2);
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
    return new classes_1.RenderResultImpl(props.children, newSelection);
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
        newSelection = newSelection.data(data, dataKey || undefined);
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


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var classes_1 = __webpack_require__(0);
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
        injectedChild = new classes_1.ElementImpl(name_1, childProps, children);
    }
    var resultChildren = injectedChild ? [injectedChild] : children;
    return new classes_1.RenderResultImpl(resultChildren, newSelection);
};
exports.default = Enter;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var applyAttributes_1 = __webpack_require__(1);
var classes_1 = __webpack_require__(0);
var Exit = function (props) {
    var selection = props.selection, children = props.children, remove = props.remove;
    var newSelection = selection.exit();
    if (remove) {
        newSelection = newSelection.remove();
    }
    applyAttributes_1.applyAttrs(props, selection, __assign({}, applyAttributes_1.EXCLUDED_PROPS, { attr: true, style: true }));
    ['style', 'styleTween'].forEach(function (name) { return (applyAttributes_1.applyMapAttribute(props, selection, name)); });
    return new classes_1.RenderResultImpl(children, newSelection);
};
exports.default = Exit;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var applyAttributes_1 = __webpack_require__(1);
var classes_1 = __webpack_require__(0);
var UPDATE_PROPS = {};
var Update = function (props) {
    var selection = props.selection, children = props.children;
    applyAttributes_1.applyAttrs(props, selection, __assign({}, applyAttributes_1.EXCLUDED_PROPS, UPDATE_PROPS));
    ['style', 'styleTween'].forEach(function (name) { return (applyAttributes_1.applyMapAttribute(props, selection, name)); });
    applyAttributes_1.applyAttrs(props, selection);
    ['style', 'classed', 'property', 'on'].forEach(function (name) { return applyAttributes_1.applyMapAttribute(props, selection, name); });
    ['call', 'each', 'text', 'html'].forEach(function (name) { return applyAttributes_1.applyAttribute(props, selection, name); });
    return new classes_1.RenderResultImpl(children, selection);
};
exports.default = Update;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var applyAttributes_1 = __webpack_require__(1);
var classes_1 = __webpack_require__(0);
var TRANSITION_PROPS = {
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
    applyAttributes_1.applyAttrs(props, transition, __assign({}, applyAttributes_1.EXCLUDED_PROPS, TRANSITION_PROPS));
    ['tween', 'style', 'styleTween', 'attrTween'].forEach(function (name) { return (applyAttributes_1.applyMapAttribute(props, transition, name)); });
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
var classes_1 = __webpack_require__(0);
var Grouping = function (_a) {
    var selection = _a.selection, children = _a.children;
    return new classes_1.RenderResultImpl(children, selection);
};
exports.default = Grouping;


/***/ })
/******/ ]);