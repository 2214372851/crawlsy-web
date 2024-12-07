import {del, get} from "@/api/request";
import type {ApiListResponse, ApiResponse} from "@/types/global";

export interface queryOperationData {
    page?: number,
    pageSize?: number,
    username?: string,
    operation_type?: string,
}

export interface OperationItem {
    id: number,
    user: {
        uid: string,
        username: string
    },
    operation_type: string,
    description: string,
    ip_address: string,
    operation_time: string,
    status: boolean,
}

export const operationListApi = (params: queryOperationData) => get<ApiResponse<ApiListResponse<OperationItem>>>('/operation/', params)

export const operationDelApi = (id: string) => del<ApiResponse<unknown>>(`/operation/${id}/`)