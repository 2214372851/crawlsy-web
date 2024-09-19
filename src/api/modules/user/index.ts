import {del, get, post, put} from "@/api/request";
import type {ApiListResponse, ApiResponse} from "@/types/global";

export type UserItem = {
    "createTime": string,
    "updateTime": string,
    "role": { name: string, id: number }[],
    "uid": string,
    "username": string,
    "email": string,
    "status": boolean,
    "lastLoginTime": string
}

export type queryUserData = {
    page?: number,
    pageSize?: number,
    username?: string,
    email?: string,
    status?: boolean,
    orderBy?: string,
}

export type UserEditData = {
    username?: string,
    password?: string,
    email?: string,
    role?: number[],
    status?: boolean
}
export type UserAddData = {
    username: string,
    password: string,
    email: string,
    role: number[]
}


export const userListApi = (params: queryUserData) => get<ApiResponse<ApiListResponse<UserItem>>>('/user/', params)

export const userInfoApi = (id: string) => get<ApiResponse<UserItem>>(`/user/${id}/`)

export const userAddApi = (data: UserAddData) => post<ApiResponse<unknown>>('/user/', data)

export const userUpdateApi = (id: string, data: UserEditData) => put<ApiResponse<UserItem>>(`/user/${id}/`, data, {partial: 1})

export const userDelApi = (id: string) => del<ApiResponse<unknown>>(`/user/${id}/`)