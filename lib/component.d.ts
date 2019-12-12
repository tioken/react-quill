import React from 'react';
import { UnprivilegedEditor, ReactQuillMixin, QuillOptions, Range, Value } from './mixin';
import Quill, { DeltaStatic, RangeStatic, StringMap as QuillStringMap, Sources as QuillSources } from 'quill';
interface ReactQuillProps {
    bounds?: string | HTMLElement;
    children?: React.ReactElement<any>;
    className?: string;
    defaultValue?: Value;
    formats?: string[];
    id?: string;
    modules?: QuillStringMap;
    onChange?(value: string, delta: DeltaStatic, source: QuillSources, editor: UnprivilegedEditor): void;
    onChangeSelection?(selection: Range, source: QuillSources, editor: UnprivilegedEditor): void;
    onFocus?(selection: Range, source: QuillSources, editor: UnprivilegedEditor): void;
    onBlur?(previousSelection: Range, source: QuillSources, editor: UnprivilegedEditor): void;
    onKeyDown?: React.EventHandler<any>;
    onKeyPress?: React.EventHandler<any>;
    onKeyUp?: React.EventHandler<any>;
    placeholder?: string;
    preserveWhitespace?: boolean;
    readOnly?: boolean;
    scrollingContainer?: string | HTMLElement;
    style?: React.CSSProperties;
    tabIndex?: number;
    theme?: string;
    value?: Value;
    /** @deprecated
     * The `toolbar` prop has been deprecated. Use `modules.toolbar` instead.
     * See: https://github.com/zenoamaro/react-quill#upgrading-to-react-quill-v100.
     * */
    toolbar?: never;
    /** @deprecated
     * The `styles` prop has been deprecated. Use custom stylesheets instead.
     * See: https://github.com/zenoamaro/react-quill#upgrading-to-react-quill-v100
     */
    styles?: never;
    /**
     * @deprecated
     * The `pollInterval` property does not have any effect anymore.
     * You can safely remove it from your props.
     * See: https://github.com/zenoamaro/react-quill#upgrading-to-react-quill-v100.
     */
    pollInterval?: never;
}
interface ReactQuillState {
    generation: number;
    value: Value;
    selection: Range;
}
interface ReactQuill extends ReactQuillMixin {
}
declare class ReactQuill extends React.Component<ReactQuillProps, ReactQuillState> {
    static displayName: string;
    dirtyProps: (keyof ReactQuillProps)[];
    cleanProps: (keyof ReactQuillProps)[];
    static defaultProps: {
        theme: string;
        modules: {};
        readOnly: boolean;
    };
    state: ReactQuillState;
    editor?: Quill;
    editingArea?: React.ReactInstance | null;
    lastDeltaChangeSet?: DeltaStatic;
    regenerationSnapshot?: {
        delta: DeltaStatic;
        selection: Range;
    };
    constructor(props: ReactQuillProps);
    validateProps(props: ReactQuillProps): void;
    shouldComponentUpdate(nextProps: ReactQuillProps, nextState: ReactQuillState): boolean;
    shouldComponentRegenerate(nextProps: ReactQuillProps): boolean;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(prevProps: ReactQuillProps, prevState: ReactQuillState): void;
    instantiateEditor(): void;
    destroyEditor(): void;
    isControlled(): boolean;
    getEditorConfig(): QuillOptions;
    getEditor(): Quill;
    getEditingArea(): Element;
    getEditorContents(): Value;
    getEditorSelection(): Range;
    isDelta(value: any): boolean;
    isEqualValue(value: any, nextValue: any): boolean;
    renderEditingArea(): JSX.Element;
    render(): JSX.Element;
    onEditorChangeText(value: string, delta: DeltaStatic, source: QuillSources, editor: UnprivilegedEditor): void;
    onEditorChangeSelection(nextSelection: RangeStatic, source: QuillSources, editor: UnprivilegedEditor): void;
    focus(): void;
    blur(): void;
}
export default ReactQuill;
