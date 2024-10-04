import {del, get, post, put} from "@/api/request";
import type {ApiResponse} from "@/types/global";

export type resourceData = {
    isFile: boolean,
    name: string,
    path: string,
}

export const resourceListApi = (id: number) => get<ApiResponse<resourceData[]>>('/ide/', {id})

export const resourceRenameApi = (path: string, name: string) => put<ApiResponse<undefined>>('/ide/', {}, {path, name})

export const resourceDeleteApi = (path: string) => del<ApiResponse<undefined>>('/ide/', {path})

export const resourceCreateApi = (path: string, name: string) => post<ApiResponse<undefined>>('/ide/', {path, name})

export const resourceLazyLoadApi = (path: string) => get<ApiResponse<resourceData[]>>('/ide/lazy/', {path})

export const resourceLoadApi = (path: string) => post<ApiResponse<string>>('/ide/file/', {path})