"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const some_1 = __importDefault(require("lodash/some"));
const isEqual_1 = __importDefault(require("lodash/isEqual"));
const mixin_1 = __importDefault(require("./mixin"));
;
class ReactQuill extends react_1.default.Component {
    constructor(props) {
        super(props);
        /*
        Changing one of these props should cause a full re-render and a
        re-instantiation of the Quill editor.
        */
        this.dirtyProps = [
            'modules',
            'formats',
            'bounds',
            'theme',
            'children',
        ];
        /*
        Changing one of these props should cause a regular update. These are mostly
        props that act on the container, rather than the quillized editing area.
        */
        this.cleanProps = [
            'id',
            'className',
            'style',
            'readOnly',
            'placeholder',
            'tabIndex',
            'onChange',
            'onChangeSelection',
            'onFocus',
            'onBlur',
            'onKeyPress',
            'onKeyDown',
            'onKeyUp',
        ];
        this.state = {
            generation: 0,
            selection: null,
            value: '',
        };
        const value = this.isControlled() ? props.value : props.defaultValue;
        this.state.value = (value !== null && value !== void 0 ? value : '');
    }
    validateProps(props) {
        var _a, _b, _c, _d;
        if ('toolbar' in props)
            throw new Error('The `toolbar` prop has been deprecated. Use `modules.toolbar` instead. ' +
                'See: https://github.com/zenoamaro/react-quill#upgrading-to-react-quill-v100');
        if ((_c = (_b = (_a = props.modules) === null || _a === void 0 ? void 0 : _a.toolbar) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.type)
            throw new Error('Since v1.0.0, React Quill will not create a custom toolbar for you ' +
                'anymore. Create a toolbar explictly, or let Quill create one. ' +
                'See: https://github.com/zenoamaro/react-quill#upgrading-to-react-quill-v100');
        if (props.formats && (!(props.formats instanceof Array) ||
            some_1.default(props.formats, x => typeof x !== 'string')))
            throw new Error('You cannot specify custom `formats` anymore. Use Parchment instead.  ' +
                'See: https://github.com/zenoamaro/react-quill#upgrading-to-react-quill-v100.');
        if ('styles' in props)
            throw new Error('The `styles` prop has been deprecated. Use custom stylesheets instead. ' +
                'See: https://github.com/zenoamaro/react-quill#upgrading-to-react-quill-v100.');
        if ('pollInterval' in props)
            throw new Error('The `pollInterval` property does not have any effect anymore. ' +
                'Remove it from your props. ' +
                'See: https://github.com/zenoamaro/react-quill#upgrading-to-react-quill-v100.');
        if (react_1.default.Children.count(props.children) > 1)
            throw new Error('The Quill editing area can only be composed of a single React element.');
        if (react_1.default.Children.count(props.children)) {
            const child = react_1.default.Children.only(props.children);
            if (((_d = child) === null || _d === void 0 ? void 0 : _d.type) === 'textarea')
                throw new Error('Quill does not support editing on a <textarea>. Use a <div> instead.');
        }
        if (this.lastDeltaChangeSet &&
            props.value === this.lastDeltaChangeSet)
            throw new Error('You are passing the `delta` object from the `onChange` event back ' +
                'as `value`. You most probably want `editor.getContents()` instead. ' +
                'See: https://github.com/zenoamaro/react-quill#using-deltas');
    }
    shouldComponentUpdate(nextProps, nextState) {
        this.validateProps(nextProps);
        // If the component has been regenerated, we already know we should update.
        if (this.state.generation !== nextState.generation) {
            return true;
        }
        return some_1.default([...this.cleanProps, ...this.dirtyProps], (prop) => {
            return !isEqual_1.default(nextProps[prop], this.props[prop]);
        });
    }
    shouldComponentRegenerate(nextProps) {
        // Whenever a `dirtyProp` changes, the editor needs reinstantiation.
        return some_1.default(this.dirtyProps, (prop) => {
            return !isEqual_1.default(nextProps[prop], this.props[prop]);
        });
    }
    componentDidMount() {
        this.instantiateEditor();
        this.setEditorContents(this.editor, this.state.value);
    }
    componentWillUnmount() {
        this.destroyEditor();
    }
    componentDidUpdate(prevProps, prevState) {
        var _a;
        if (!this.editor)
            return;
        const editor = this.editor;
        // If we're changing one of the `dirtyProps`, the entire Quill Editor needs
        // to be re-instantiated. Regenerating the editor will cause the whole tree,
        // including the container, to be cleaned up and re-rendered from scratch.
        // Store the contents so they can be restored later.
        if (this.shouldComponentRegenerate(prevProps)) {
            const delta = editor.getContents();
            const selection = editor.getSelection();
            this.regenerationSnapshot = { delta, selection };
            this.setState({ generation: this.state.generation + 1 });
            this.destroyEditor();
        }
        // The component has been regenerated, so it must be re-instantiated, and
        // its content must be restored to the previous values from the snapshot.
        if (this.state.generation !== prevState.generation) {
            const { delta, selection } = this.regenerationSnapshot;
            delete this.regenerationSnapshot;
            this.instantiateEditor();
            editor.setContents(delta);
            if (selection)
                editor.setSelection(selection);
            editor.focus();
        }
        // Update only if we've been passed a new `value`. This leaves components
        // using `defaultValue` alone.
        if ('value' in this.props) {
            const prevContents = prevState.value;
            const nextContents = (_a = this.props.value, (_a !== null && _a !== void 0 ? _a : ''));
            // NOTE: Seeing that Quill is missing a way to prevent edits, we have to
            //       settle for a hybrid between controlled and uncontrolled mode. We
            //       can't prevent the change, but we'll still override content
            //       whenever `value` differs from current state.
            // NOTE: Comparing an HTML string and a Quill Delta will always trigger a
            //       change, regardless of whether they represent the same document.
            if (!this.isEqualValue(nextContents, prevContents)) {
                this.setEditorContents(editor, nextContents);
            }
        }
        // We can update readOnly state in-place.
        if ('readOnly' in this.props) {
            if (this.props.readOnly !== prevProps.readOnly) {
                this.setEditorReadOnly(editor, this.props.readOnly);
            }
        }
    }
    instantiateEditor() {
        if (this.editor) {
            throw new Error('Editor is already instantiated');
        }
        this.editor = this.createEditor(this.getEditingArea(), this.getEditorConfig());
    }
    destroyEditor() {
        if (!this.editor) {
            throw new Error('Destroying editor before instantiation');
        }
        this.unhookEditor(this.editor);
        delete this.editor;
    }
    /*
    We consider the component to be controlled if `value` is being sent in props.
    */
    isControlled() {
        return 'value' in this.props;
    }
    getEditorConfig() {
        return {
            bounds: this.props.bounds,
            formats: this.props.formats,
            modules: this.props.modules,
            placeholder: this.props.placeholder,
            readOnly: this.props.readOnly,
            scrollingContainer: this.props.scrollingContainer,
            tabIndex: this.props.tabIndex,
            theme: this.props.theme,
        };
    }
    getEditor() {
        if (!this.editor)
            throw new Error('Accessing non-instantiated editor');
        return this.editor;
    }
    getEditingArea() {
        if (!this.editingArea) {
            throw new Error('Instantiating on missing editing area');
        }
        const element = react_dom_1.default.findDOMNode(this.editingArea);
        if (!element) {
            throw new Error('Cannot find element for editing area');
        }
        if (element.nodeType === 3) {
            throw new Error('Editing area cannot be a text node');
        }
        return element;
    }
    getEditorContents() {
        return this.state.value;
    }
    getEditorSelection() {
        return this.state.selection;
    }
    /*
    True if the value is a Delta instance or a Delta look-alike.
    */
    isDelta(value) {
        return value && value.ops;
    }
    /*
    Special comparison function that knows how to compare Deltas.
    */
    isEqualValue(value, nextValue) {
        if (this.isDelta(value) && this.isDelta(nextValue)) {
            return isEqual_1.default(value.ops, nextValue.ops);
        }
        else {
            return isEqual_1.default(value, nextValue);
        }
    }
    /*
    Renders an editor area, unless it has been provided one to clone.
    */
    renderEditingArea() {
        const { children, preserveWhitespace, tabIndex } = this.props;
        const { generation } = this.state;
        const properties = {
            tabIndex,
            key: generation,
            ref: (instance) => {
                this.editingArea = instance;
            },
        };
        if (react_1.default.Children.count(children)) {
            return react_1.default.cloneElement(react_1.default.Children.only(children), properties);
        }
        return preserveWhitespace ?
            react_1.default.createElement("pre", Object.assign({}, properties)) :
            react_1.default.createElement("div", Object.assign({}, properties));
    }
    render() {
        var _a;
        return (react_1.default.createElement("div", { id: this.props.id, style: this.props.style, key: this.state.generation, className: `quill ${_a = this.props.className, (_a !== null && _a !== void 0 ? _a : '')}`, onKeyPress: this.props.onKeyPress, onKeyDown: this.props.onKeyDown, onKeyUp: this.props.onKeyUp }, this.renderEditingArea()));
    }
    onEditorChangeText(value, delta, source, editor) {
        var _a, _b;
        if (!this.editor)
            return;
        const currentContents = this.getEditorContents();
        // We keep storing the same type of value as what the user gives us,
        // so that value comparisons will be more stable and predictable.
        const nextContents = this.isDelta(currentContents)
            ? editor.getContents()
            : editor.getHTML();
        if (!this.isEqualValue(nextContents, currentContents)) {
            // Taint this `delta` object, so we can recognize whether the user
            // is trying to send it back as `value`, preventing a likely loop.
            this.lastDeltaChangeSet = delta;
            this.setState({ value: nextContents });
            (_b = (_a = this.props).onChange) === null || _b === void 0 ? void 0 : _b.call(_a, value, delta, source, editor);
        }
    }
    onEditorChangeSelection(nextSelection, source, editor) {
        var _a, _b, _c, _d, _e, _f;
        if (!this.editor)
            return;
        const currentSelection = this.getEditorSelection();
        const hasGainedFocus = !currentSelection && nextSelection;
        const hasLostFocus = currentSelection && !nextSelection;
        if (isEqual_1.default(nextSelection, currentSelection))
            return;
        this.setState({ selection: nextSelection });
        (_b = (_a = this.props).onChangeSelection) === null || _b === void 0 ? void 0 : _b.call(_a, nextSelection, source, editor);
        if (hasGainedFocus) {
            (_d = (_c = this.props).onFocus) === null || _d === void 0 ? void 0 : _d.call(_c, nextSelection, source, editor);
        }
        else if (hasLostFocus) {
            (_f = (_e = this.props).onBlur) === null || _f === void 0 ? void 0 : _f.call(_e, currentSelection, source, editor);
        }
    }
    focus() {
        if (!this.editor)
            return;
        this.editor.focus();
    }
    blur() {
        if (!this.editor)
            return;
        this.setEditorSelection(this.editor, null);
    }
}
ReactQuill.displayName = 'React Quill';
ReactQuill.defaultProps = {
    theme: 'snow',
    modules: {},
    readOnly: false,
};
// TODO: Understand what to do with Mixin.
Object.assign(ReactQuill.prototype, mixin_1.default);
exports.default = ReactQuill;
//# sourceMappingURL=component.js.map