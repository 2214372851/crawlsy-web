import {del, get, post, put} from "@/api/request";
import type {ApiListResponse, ApiResponse, menuOptionData} from "@/types/global";


export type SpiderItem = {
    id: number,
    founderUser: { uid: string, username: string },
    createTime: string,
    updateTime: string,
    name: string,
    spiderUid: string,
    resources: string,
    status: string
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
    status: boolean
}

export const spiderOptionApi = () => get<ApiResponse<ApiListResponse<menuOptionData>>>('/spiderOption/')

export const spiderListApi = (params: querySpiderData) => get<ApiResponse<ApiListResponse<SpiderItem>>>('/spider/', params)

export const spiderInfoApi = (id: string) => get<ApiResponse<SpiderItem>>(`/spider/${id}/`)

export const spiderAddApi = (data: SpiderAddEditData) => post<ApiResponse<unknown>>('/spider/', data)

export const spiderUpdateApi = (id: string, data: SpiderAddEditData) => put<ApiResponse<SpiderItem>>(`/spider/${id}/`, data, {partial: 1})

export const spiderDelApi = (id: string) => del<ApiResponse<unknown>>(`/spider/${id}/`)