import {del, get, post, put} from "@/api/request";
import type {ApiListResponse, ApiResponse} from "@/types/global";

export interface TaskRelated {
    "id": number,
    "name": string,
    "status": boolean,
    "isTiming": boolean,
    "founderUser": {
        "uid": string,
        "username": string
    },
    "createTime": string,
    "updateTime": string,
}

export interface TaskItem extends TaskRelated {
    "nodes": {
        "id": number,
        "nodeUid": string,
        "name": string,
        "status": boolean
    }[],
    "spider": {
        "id": number,
        "spiderUid": string,
        "name": string,
        "status": boolean
    },
    "taskUid": string,
    "cronExpression": string
}

export type queryTaskData = {
    page?: number,
    pageSize?: number,
    name?: string,
    orderBy?: string,
    founder?: string
    isTiming?: boolean
    status?: boolean
}

export type TaskAddEditData = {
    name: string,
    cronExpression: string,
    taskSpider: string,
    isTiming: boolean,
    taskNodes: number[]
}
export const taskListApi = (params: queryTaskData) => get<ApiResponse<ApiListResponse<TaskItem>>>('/task/', params)

export const taskInfoApi = (id: string) => get<ApiResponse<TaskItem>>(`/task/${id}/`)

export const taskAddApi = (data: TaskAddEditData) => post<ApiResponse<unknown>>('/task/', data)

export const taskUpdateApi = (id: string, data: TaskAddEditData) => put<ApiResponse<TaskItem>>(`/task/${id}/`, data, {partial: 1})

export const taskDelApi = (id: string) => del<ApiResponse<unknown>>(`/task/${id}/`)