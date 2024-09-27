import {del, get, post, put} from "@/api/request";
import type {ApiListResponse, ApiResponse, menuOptionData} from "@/types/global";


export type NodeItem = {
    "id": number,
    "createTime": string,
    "updateTime": string,
    "name": string,
    "nodeUid": string,
    "status": boolean
}

export type queryNodeData = {
    page?: number,
    pageSize?: number,
    name?: string,
    orderBy?: string,
    status?: boolean
    nodeUid?: string
}

export type NodeAddEditData = {
    name: string,
    nodeUid?: string
}

export const nodeOptionApi = () => get<ApiResponse<ApiListResponse<menuOptionData>>>('/nodeOption/')


export const nodeListApi = (params: queryNodeData) => get<ApiResponse<ApiListResponse<NodeItem>>>('/node/', params)

export const nodeInfoApi = (id: string) => get<ApiResponse<NodeItem>>(`/node/${id}/`)

export const nodeAddApi = (data: NodeAddEditData) => post<ApiResponse<unknown>>('/node/', data)

export const nodeUpdateApi = (id: string, data: NodeAddEditData) => put<ApiResponse<NodeItem>>(`/node/${id}/`, data, {partial: 1})

export const nodeDelApi = (id: string) => del<ApiResponse<unknown>>(`/node/${id}/`)

export const searchNodeApi = () => get<ApiResponse<ApiListResponse<string>>>('/searchNode/')