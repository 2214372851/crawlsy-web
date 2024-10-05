import {del, get, post, put} from "@/api/request";
import type {ApiListResponse, ApiResponse, menuOptionData} from "@/types/global";

export type RoleItem = {
    "createTime": string,
    "updateTime": string,
    "id": number,
    "name": string,
    "permissions": number[]
}

export type queryRoleData = {
    page?: number,
    pageSize?: number,
    name?: string,
    orderBy?: string,
}

export type RoleAddEditData = {
    name: string,
    permissions: string[]
}

export const roleOptionApi = () => get<ApiResponse<ApiListResponse<menuOptionData>>>('/roleOption/')

export const roleListApi = (params: queryRoleData) => get<ApiResponse<ApiListResponse<RoleItem>>>('/role/', params)

export const roleInfoApi = (id: number) => get<ApiResponse<RoleItem>>(`/role/${id}/`)

export const roleAddApi = (data: RoleAddEditData) => post<ApiResponse<unknown>>('/role/', data)

export const roleUpdateApi = (id: string, data: RoleAddEditData) => put<ApiResponse<RoleItem>>(`/role/${id}/`, data, {partial: 1})

export const roleDelApi = (id: number) => del<ApiResponse<unknown>>(`/role/${id}/`)