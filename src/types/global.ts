import type {RouteMeta} from "vue-router";
import type {SelectOptionData} from "@arco-design/web-vue";

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

interface MetaType extends RouteMeta {
    name: String,
    layout: Boolean
}

interface SearchOption {
    label: string
    type: 'input' | 'select' | 'dateRang'
    multiple?: boolean
    field: string
    options?: SelectOptionData[]
}

interface IdeTabItem {
    key: string,
    name: string,
    value: string,
}

type ApiResponse<T> = {
    code: number,
    data?: T,
    msg: string
}

export type {
    MenuItem,
    BreadcrumbItem,
    MetaType,
    SearchOption,
    IdeTabItem,
    ApiResponse,
}