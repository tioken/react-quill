import React, { CSSProperties } from 'react';
export interface ReactQuillToolbarProps {
    className?: string;
    items?: ToolbarItem[];
    id?: string;
    style?: CSSProperties;
}
export declare type ToolbarItem = (ToolbarGroup | ToolbarChoice | ToolbarButton | ToolbarAction);
export interface ToolbarGroup {
    type: 'group';
    label: string;
    items: ToolbarItem[];
}
export interface ToolbarChoiceItem {
    label: string;
    value: string;
    selected: boolean;
}
export interface ToolbarChoice {
    type: 'font' | 'header' | 'align' | 'size' | 'color' | 'background';
    label: string;
    items: ToolbarChoiceItem[];
}
export interface ToolbarButton {
    type: ('bold' | 'italic' | 'underline' | 'strike' | 'link' | 'list' | 'bullet' | 'ordered' | 'indent' | 'image' | 'video');
    label: string;
    value: string;
    children: React.ReactNode;
}
export interface ToolbarAction {
    type: 'action';
    label: string;
    value: string;
    children: React.ReactNode;
}
export default class ReactQuillToolbar extends React.Component<ReactQuillToolbarProps> {
    static displayName: string;
    static defaultProps: {
        items: ({
            label: string;
            type: string;
            items: {
                label: string;
                type: string;
                items: ({
                    label: string;
                    value: string;
                    selected: boolean;
                } | {
                    label: string;
                    value: string;
                    selected?: undefined;
                })[];
            }[];
        } | {
            label: string;
            type: string;
            items: ({
                type: string;
                label: string;
                items?: undefined;
            } | {
                type: string;
                label: string;
                items: {
                    value: string;
                }[];
            })[];
        } | {
            label: string;
            type: string;
            items: {
                type: string;
                value: string;
            }[];
        })[];
    };
    static defaultItems: ({
        label: string;
        type: string;
        items: {
            label: string;
            type: string;
            items: ({
                label: string;
                value: string;
                selected: boolean;
            } | {
                label: string;
                value: string;
                selected?: undefined;
            })[];
        }[];
    } | {
        label: string;
        type: string;
        items: ({
            type: string;
            label: string;
            items?: undefined;
        } | {
            type: string;
            label: string;
            items: {
                value: string;
            }[];
        })[];
    } | {
        label: string;
        type: string;
        items: {
            type: string;
            value: string;
        }[];
    })[];
    static defaultColors: {
        value: string;
    }[];
    constructor(props: ReactQuillToolbarProps);
    shouldComponentUpdate(nextProps: ReactQuillToolbarProps): boolean;
    renderGroup: (item: ToolbarGroup, key: number) => JSX.Element;
    renderChoiceItem: (item: ToolbarChoiceItem, key: number) => JSX.Element;
    renderChoices: (item: ToolbarChoice, key: number) => JSX.Element;
    renderButton: (item: ToolbarButton, key: number) => JSX.Element;
    renderAction: (item: ToolbarAction, key: number) => JSX.Element;
    renderItem: (item: ToolbarItem, key: number) => JSX.Element;
    getClassName(): string;
    render(): JSX.Element;
}
