import type {RouteMeta} from "vue-router";

interface MenuItem {
    "id": number,
    "createTime": string,
    "updateTime": string,
    "parent": number | null,
    "name": string,
    "icon": string,
    "path": string
}

interface BreadcrumbItem {
    label: string,
    path: string,
}

interface MetaType extends RouteMeta{
    name: String,
    layout: Boolean
}


export type {MenuItem, BreadcrumbItem, MetaType}