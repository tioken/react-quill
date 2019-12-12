import Quill, { QuillOptionsStatic, DeltaStatic, BoundsStatic, RangeStatic, Sources as QuillSources } from 'quill';
export declare type Value = string | DeltaStatic;
export declare type Range = RangeStatic | null;
export interface QuillOptions extends QuillOptionsStatic {
    tabIndex?: number;
}
export interface ReactQuillMixin {
    createEditor(element: Element, config: QuillOptions): Quill;
    hookEditor(editor: Quill): void;
    unhookEditor(editor: Quill): void;
    setEditorReadOnly(editor: Quill, value: boolean): void;
    setEditorContents(editor: Quill, value: Value): void;
    setEditorSelection(editor: Quill, range: Range): void;
    setEditorTabIndex(editor: Quill, tabIndex: number): void;
    makeUnprivilegedEditor(editor: Quill): UnprivilegedEditor;
    handleChange?(eventType: string, rangeOrDelta: RangeStatic | DeltaStatic | null, oldRangeOrOldDelta: RangeStatic | DeltaStatic | null, source: QuillSources): void;
    onEditorChangeText?(value: string, delta: DeltaStatic, source: QuillSources, editor: UnprivilegedEditor): void;
    onEditorChangeSelection?(selection: Range, source: QuillSources, editor: UnprivilegedEditor): void;
}
export interface UnprivilegedEditor {
    getLength(): number;
    getText(index?: number, length?: number): string;
    getHTML(): string;
    getBounds(index: number, length?: number): BoundsStatic;
    getSelection(focus?: boolean): RangeStatic;
    getContents(index?: number, length?: number): DeltaStatic;
}
declare const Mixin: ReactQuillMixin;
export default Mixin;
