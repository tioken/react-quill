"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const quill_1 = __importDefault(require("quill"));
const Mixin = {
    /**
    Creates an editor on the given element. The editor will be passed the
    configuration, have its events bound,
    */
    createEditor: function (element, config) {
        const editor = new quill_1.default(element, config);
        if (config.tabIndex != null) {
            this.setEditorTabIndex(editor, config.tabIndex);
        }
        this.hookEditor(editor);
        return editor;
    },
    hookEditor: function (editor) {
        // Expose the editor on change events via a weaker, unprivileged proxy
        // object that does not allow accidentally modifying editor state.
        const unprivilegedEditor = this.makeUnprivilegedEditor(editor);
        this.handleChange = (eventType, rangeOrDelta, _, source) => {
            var _a, _b, _c, _d;
            if (eventType === 'text-change') {
                (_b = (_a = this).onEditorChangeText) === null || _b === void 0 ? void 0 : _b.call(_a, editor.root.innerHTML, rangeOrDelta, source, unprivilegedEditor);
            }
            if (eventType === 'text-change' || eventType === 'selection-change') {
                (_d = (_c = this).onEditorChangeSelection) === null || _d === void 0 ? void 0 : _d.call(_c, rangeOrDelta, source, unprivilegedEditor);
            }
        };
        editor.on('editor-change', this.handleChange);
    },
    unhookEditor: function (editor) {
        if (this.handleChange) {
            editor.off('editor-change', this.handleChange);
        }
    },
    setEditorReadOnly: function (editor, value) {
        if (value) {
            editor.disable();
        }
        else {
            editor.enable();
        }
    },
    /*
    Replace the contents of the editor, but keep the previous selection hanging
    around so that the cursor won't move.
    */
    setEditorContents: function (editor, value) {
        const sel = editor.getSelection();
        if (typeof value === 'string') {
            editor.setContents(editor.clipboard.convert(value));
        }
        else {
            editor.setContents(value);
        }
        if (sel && editor.hasFocus())
            this.setEditorSelection(editor, sel);
    },
    setEditorSelection: function (editor, range) {
        if (range) {
            // Validate bounds before applying.
            const length = editor.getLength();
            range.index = Math.max(0, Math.min(range.index, length - 1));
            range.length = Math.max(0, Math.min(range.length, (length - 1) - range.index));
        }
        // Quill types (erroneously) do not specify that `null` is accepted here.
        editor.setSelection(range);
    },
    setEditorTabIndex: function (editor, tabIndex) {
        var _a, _b;
        if ((_b = (_a = editor) === null || _a === void 0 ? void 0 : _a.scroll) === null || _b === void 0 ? void 0 : _b.domNode) {
            editor.scroll.domNode.tabIndex = tabIndex;
        }
    },
    /*
    Returns a weaker, unprivileged proxy object that only exposes read-only
    accessors found on the editor instance, without any state-modifying methods.
    */
    makeUnprivilegedEditor: function (editor) {
        const e = editor;
        return {
            getHTML: () => e.root.innerHTML,
            getLength: e.getLength.bind(e),
            getText: e.getText.bind(e),
            getContents: e.getContents.bind(e),
            getSelection: e.getSelection.bind(e),
            getBounds: e.getBounds.bind(e),
        };
    }
};
exports.default = Mixin;
//# sourceMappingURL=mixin.js.map