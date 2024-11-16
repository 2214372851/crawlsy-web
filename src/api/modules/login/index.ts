import {get, post} from "@/api/request";
import type {ApiResponse, MenuItem} from "@/types/global";
import type {Method} from "axios";

export type LoginData = {
    email: string,
    password: string,
}
export type PermissionData = {
    [key: string]: Method[];
};

export type RoleData = { id: number, name: string }[]


export type LoginResponse = {
    accessToken: string,
    refreshToken: string,
    lastLoginTime: string,
    username: string,
    email: string,
    permissions: PermissionData,
    menus: MenuItem[],
    role: RoleData
}

export type RefreshResponse = {
    accessToken: string,
}
export const loginApi = (data: LoginData) => post<ApiResponse<LoginResponse>>('/login/', data)

export const logoutApi = () => get<ApiResponse<unknown>>('/logout/')

export const refreshApi = () => get<ApiResponse<RefreshResponse>>('/refresh/')