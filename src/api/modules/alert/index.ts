import {del, get, post, put} from "@/api/request";
import type {ApiResponse, ApiListResponse} from "@/types/global";

export type queryAlertData = {
    page?: number,
    pageSize?: number,
    name?: string,
    orderBy?: string,
}


export type AlertItem = {
    "id": number,
    "createTime": string,
    "updateTime": string,
    "name": string,
    "mertric": string,
    "condition": string,
    "threshold": number,
    "severity": string,
    "status": boolean,
    "interval": number,
    "lastTriggerTime": string | null,
    description: string,
    feishuWebhook: string,
    target: string,
}

export type AlertAddEditData = {
    name: string,
    mertric: string,
    condition: string,
    threshold: number,
    severity: string,
    interval: number,
    feishuWebhook: string,
    description: string,
    target: number[],
    status: boolean,
}

export type AlertRecordItem = {
    metric: string,
    value: number,
    triggerTime: string,
}
export const alertTestApi = (id: string) => get<ApiResponse<unknown>>('/alert-test/', {alert: id})
export const alertRecordListApi = (params: {
    page?: number,
    pageSize?: number,
    id: string
}) => get<ApiResponse<ApiListResponse<AlertRecordItem>>>(`/alert-record/`, params)
export const alertListApi = (params: queryAlertData) => get<ApiResponse<ApiListResponse<AlertItem>>>('/alert/', params)

export const alertAddApi = (data: AlertAddEditData) => post<ApiResponse<AlertItem>>('/alert/', data)

export const alertUpdateApi = (id: string, data: AlertAddEditData) => put<ApiResponse<AlertItem>>(`/alert/${id}/`, data, {partial: 1})

export const alertDelApi = (id: string) => del<ApiResponse<unknown>>(`/alert/${id}/`)

export const alertInfoApi = (id: string) => get<ApiResponse<AlertItem>>(`/alert/${id}/`)