import {get, post} from "@/api/request";
import type {ApiResponse} from "@/types/global";

export type LoginData = {
    email: string,
    password: string,
}
export type LoginResponse = {
    accessToken: string,
    refreshToken: string,
    username: string,
}

export type RefreshResponse = {
    accessToken: string,
}
export const loginApi = (data: LoginData) => post<ApiResponse<LoginResponse>>('/login/', data)

export const logoutApi = () => get<ApiResponse<unknown>>('/logout/')

export const refreshApi = () => get<ApiResponse<RefreshResponse>>('/refresh/')