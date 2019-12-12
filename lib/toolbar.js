"use strict";
/*
QuillToolbar is deprecated. Consider switching to the official Quill
toolbar format, or providing your own toolbar instead.
See https://quilljs.com/docs/modules/toolbar
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const server_1 = __importDefault(require("react-dom/server"));
const find_1 = __importDefault(require("lodash/find"));
const isEqual_1 = __importDefault(require("lodash/isEqual"));
const defaultColors = [
    'rgb(  0,   0,   0)', 'rgb(230,   0,   0)', 'rgb(255, 153,   0)',
    'rgb(255, 255,   0)', 'rgb(  0, 138,   0)', 'rgb(  0, 102, 204)',
    'rgb(153,  51, 255)', 'rgb(255, 255, 255)', 'rgb(250, 204, 204)',
    'rgb(255, 235, 204)', 'rgb(255, 255, 204)', 'rgb(204, 232, 204)',
    'rgb(204, 224, 245)', 'rgb(235, 214, 255)', 'rgb(187, 187, 187)',
    'rgb(240, 102, 102)', 'rgb(255, 194, 102)', 'rgb(255, 255, 102)',
    'rgb(102, 185, 102)', 'rgb(102, 163, 224)', 'rgb(194, 133, 255)',
    'rgb(136, 136, 136)', 'rgb(161,   0,   0)', 'rgb(178, 107,   0)',
    'rgb(178, 178,   0)', 'rgb(  0,  97,   0)', 'rgb(  0,  71, 178)',
    'rgb(107,  36, 178)', 'rgb( 68,  68,  68)', 'rgb( 92,   0,   0)',
    'rgb(102,  61,   0)', 'rgb(102, 102,   0)', 'rgb(  0,  55,   0)',
    'rgb(  0,  41, 102)', 'rgb( 61,  20,  10)',
].map(function (color) { return { value: color }; });
const defaultItems = [
    { label: 'Formats', type: 'group', items: [
            { label: 'Font', type: 'font', items: [
                    { label: 'Sans Serif', value: 'sans-serif', selected: true },
                    { label: 'Serif', value: 'serif' },
                    { label: 'Monospace', value: 'monospace' }
                ] },
            { label: 'Size', type: 'size', items: [
                    { label: 'Small', value: '10px' },
                    { label: 'Normal', value: '13px', selected: true },
                    { label: 'Large', value: '18px' },
                    { label: 'Huge', value: '32px' }
                ] },
            { label: 'Alignment', type: 'align', items: [
                    { label: '', value: '', selected: true },
                    { label: '', value: 'center' },
                    { label: '', value: 'right' },
                    { label: '', value: 'justify' }
                ] }
        ] },
    { label: 'Text', type: 'group', items: [
            { type: 'bold', label: 'Bold' },
            { type: 'italic', label: 'Italic' },
            { type: 'strike', label: 'Strike' },
            { type: 'underline', label: 'Underline' },
            { type: 'color', label: 'Color', items: defaultColors },
            { type: 'background', label: 'Background color', items: defaultColors },
            { type: 'link', label: 'Link' }
        ] },
    { label: 'Blocks', type: 'group', items: [
            { type: 'list', value: 'bullet' },
            { type: 'list', value: 'ordered' }
        ] },
    { label: 'Blocks', type: 'group', items: [
            { type: 'image', label: 'Image' }
        ] }
];
class ReactQuillToolbar extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.renderGroup = (item, key) => {
            var _a;
            return (react_1.default.createElement("span", { key: (_a = item.label, (_a !== null && _a !== void 0 ? _a : key)), className: "ql-formats" }, item.items.map(this.renderItem)));
        };
        this.renderChoiceItem = (item, key) => {
            var _a, _b;
            return (react_1.default.createElement("option", { key: (_b = (_a = item.label, (_a !== null && _a !== void 0 ? _a : item.value)), (_b !== null && _b !== void 0 ? _b : key)), value: item.value }, item.label));
        };
        this.renderChoices = (item, key) => {
            var _a, _b;
            const choiceItems = item.items.map(this.renderChoiceItem);
            const selectedItem = find_1.default(item.items, item => item.selected);
            return (react_1.default.createElement("select", { key: (_a = item.label, (_a !== null && _a !== void 0 ? _a : key)), title: item.label, className: `ql-${item.type}`, value: (_b = selectedItem) === null || _b === void 0 ? void 0 : _b.value }, choiceItems));
        };
        this.renderButton = (item, key) => {
            var _a, _b;
            return (react_1.default.createElement("button", { type: 'button', key: (_b = (_a = item.label, (_a !== null && _a !== void 0 ? _a : item.value)), (_b !== null && _b !== void 0 ? _b : key)), value: item.value, className: `ql-${item.type}`, title: item.label }, item.children));
        };
        this.renderAction = (item, key) => {
            var _a, _b;
            return (react_1.default.createElement("button", { key: (_b = (_a = item.label, (_a !== null && _a !== void 0 ? _a : item.value)), (_b !== null && _b !== void 0 ? _b : key)), className: `ql-${item.type}`, title: item.label }, item.children));
        };
        this.renderItem = (item, key) => {
            switch (item.type) {
                case 'group':
                    return this.renderGroup(item, key);
                case 'font':
                case 'header':
                case 'align':
                case 'size':
                case 'color':
                case 'background':
                    return this.renderChoices(item, key);
                case 'bold':
                case 'italic':
                case 'underline':
                case 'strike':
                case 'link':
                case 'list':
                case 'bullet':
                case 'ordered':
                case 'indent':
                case 'image':
                case 'video':
                    return this.renderButton(item, key);
                default:
                    return this.renderAction(item, key);
            }
        };
        console.warn('QuillToolbar is deprecated. Consider switching to the official Quill ' +
            'toolbar format, or providing your own toolbar instead. ' +
            'See: https://github.com/zenoamaro/react-quill#upgrading-to-react-quill-v1-0-0');
    }
    shouldComponentUpdate(nextProps) {
        return !isEqual_1.default(nextProps, this.props);
    }
    getClassName() {
        var _a;
        return `quill-toolbar ${_a = this.props.className, (_a !== null && _a !== void 0 ? _a : '')}`;
    }
    render() {
        const { id, style, items = [] } = this.props;
        const children = items.map(this.renderItem);
        const html = children.map(server_1.default.renderToStaticMarkup).join('');
        return (react_1.default.createElement("div", { id: id, className: this.getClassName(), style: style, dangerouslySetInnerHTML: { __html: html } }));
    }
}
exports.default = ReactQuillToolbar;
ReactQuillToolbar.displayName = 'React Quill Toolbar';
ReactQuillToolbar.defaultProps = {
    items: defaultItems,
};
ReactQuillToolbar.defaultItems = defaultItems;
ReactQuillToolbar.defaultColors = defaultColors;
//# sourceMappingURL=toolbar.js.map