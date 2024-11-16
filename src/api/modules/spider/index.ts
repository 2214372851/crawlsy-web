import {del, get, post, put} from "@/api/request";
import type {ApiListResponse, ApiResponse, menuOptionData} from "@/types/global";
import type {TaskRelated} from "@/api/modules/task";


export interface SpiderItem {
    id: number,
    founderUser: { uid: string, username: string },
    createTime: string,
    updateTime: string,
    name: string,
    spiderUid: string,
    status: string,
    command: string,
}

export interface SpiderTaskItem extends SpiderItem {
    taskmodel_set: TaskRelated[]
}

export type querySpiderData = {
    page?: number,
    pageSize?: number,
    name?: string,
    orderBy?: string,
    founder?: string
    spiderUid?: string
    status?: boolean
}

export type SpiderAddEditData = {
    name: string,
    status: boolean,
    command: string,
}

export const spiderOptionApi = () => get<ApiResponse<ApiListResponse<menuOptionData>>>('/spider-option/')

export const spiderListApi = (params: querySpiderData) => get<ApiResponse<ApiListResponse<SpiderItem>>>('/spider/', params)

export const spiderInfoApi = (id: string) => get<ApiResponse<SpiderItem>>(`/spider/${id}/`)

export const spiderAddApi = (data: SpiderAddEditData) => post<ApiResponse<unknown>>('/spider/', data)

export const spiderUpdateApi = (id: string, data: SpiderAddEditData) => put<ApiResponse<SpiderItem>>(`/spider/${id}/`, data, {partial: 1})

export const spiderDelApi = (id: string) => del<ApiResponse<unknown>>(`/spider/${id}/`)

export const spiderTaskListApi = (id: string) => get<ApiResponse<SpiderTaskItem>>(`/spider-task/${id}/`)