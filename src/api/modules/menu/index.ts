import {get, post, put, del} from "@/api/request";
import type {ApiListResponse, ApiResponse, menuOptionData} from "@/types/global";

export type MenuItem = {
    id: number,
    name: string,
    icon: string,
    path: string,
    parent: number,
    createTime: string,
    updateTime: string
}

export type queryMenuData = {
    page?: number,
    pageSize?: number,
    name?: string,
}

 export type MenuAddEditData = {
    name: string,
    icon: string,
    path: string,
    parent: number
}

export const menuListApi = (params: queryMenuData) => get<ApiResponse<ApiListResponse<MenuItem>>>('/menu/', params)

export const menuInfoApi = (id: string) => get<ApiResponse<MenuItem>>(`/menu/${id}/`)

export const menuAddApi = (data: MenuAddEditData) => post<ApiResponse<unknown>>('/menu/', data)

export const menuUpdateApi = (id: string, data: MenuAddEditData) => put<ApiResponse<MenuItem>>(`/menu/${id}/`, data, {partial: 1})

export const menuDelApi = (id: string) => del<ApiResponse<unknown>>(`/menu/${id}/`)


export const menuOptionApi = () => get<ApiResponse<ApiListResponse<menuOptionData>>>('/menu-option/')