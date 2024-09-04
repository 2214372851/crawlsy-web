import type {SelectOptionData} from "@arco-design/web-vue";


export interface SearchOption {
    label: string
    type: 'input' | 'select' | 'dateRang'
    multiple?: boolean
    field: string
    options?: SelectOptionData[]
}