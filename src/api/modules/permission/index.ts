import {del, get, post, put} from "@/api/request";
import type {ApiListResponse, ApiResponse, menuOptionData} from "@/types/global";


export type PermissionItem = {
    id: number,
    createTime: string,
    updateTime: string,
    menu: number,
    name: string,
    method: string,
    path: string
}
export type queryPermissionData = {
    page?: number,
    pageSize?: number,
    name?: string,
    orderBy?: string,
}
export type PermissionAddEditData = {
    name: string,
    method: string,
    path: string,
    menu: number
}

export const permissionOptionApi = () => get<ApiResponse<ApiListResponse<menuOptionData>>>('/permission-option/')

export const permissionListApi = (params: queryPermissionData) => get<ApiResponse<ApiListResponse<PermissionItem>>>('/permission/', params)

export const permissionInfoApi = (id: string) => get<ApiResponse<PermissionItem>>(`/permission/${id}/`)

export const permissionAddApi = (data: PermissionAddEditData) => post<ApiResponse<unknown>>('/permission/', data)

export const permissionUpdateApi = (id: string, data: PermissionAddEditData) => put<ApiResponse<PermissionItem>>(`/permission/${id}/`, data, {partial: 1})

export const permissionDelApi = (id: string) => del<ApiResponse<unknown>>(`/permission/${id}/`)