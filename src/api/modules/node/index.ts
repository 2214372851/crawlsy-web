import {del, get, post, put} from "@/api/request";
import type {ApiListResponse, ApiResponse, menuOptionData} from "@/types/global";


export interface NodeItem {
    "id": number,
    "createTime": string,
    "updateTime": string,
    "name": string,
    "nodeUid": string,
    "nodeLoad": number,
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


export interface NodeStatus {
    "time": number,
    "cpu_usage": number,
    "memory_usage": number,
    "sent": number,
    "recv": number,
    "load": [number, number, number],
    "score": number,
    "cpu_count": number,
    "tasks": {
        "task_id": string,
        "status": number
    }[]
}

export interface NodeDetailData extends NodeItem {
    monitor: NodeStatus[]
}

export interface searchNodeItem extends NodeStatus {
    "node_name": string,
    "node_uid": string,
    "node_version": string,
}

export const nodeOptionApi = () => get<ApiResponse<ApiListResponse<menuOptionData>>>('/node-option/')


export const nodeListApi = (params: queryNodeData) => get<ApiResponse<ApiListResponse<NodeItem>>>('/node/', params)

export const nodeInfoApi = (id: string) => get<ApiResponse<NodeDetailData>>(`/node/${id}/`)

export const nodeAddApi = (data: NodeAddEditData) => post<ApiResponse<unknown>>('/node/', data)

export const nodeUpdateApi = (id: string, data: NodeAddEditData) => put<ApiResponse<NodeItem>>(`/node/${id}/`, data, {partial: 1})

export const nodeDelApi = (id: string) => del<ApiResponse<unknown>>(`/node/${id}/`)

export const searchNodeApi = () => get<ApiResponse<ApiListResponse<searchNodeItem>>>('/node-search/')