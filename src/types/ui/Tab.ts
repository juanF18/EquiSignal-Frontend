import type { Component } from "vue";

export interface Tab {
    value: string;
    label: string;
    content?:
    | string
    | (() => {
        component: Component;
        props?: Record<string, unknown>;
    });
}
