import {del, get, post, put, upload} from "@/api/request";
import type {ApiResponse} from "@/types/global";

export type resourceData = {
    isLeaf: boolean,
    title: string,
    key: string,
}

export const resourceListApi = (id: number) => get<ApiResponse<resourceData[]>>('/ide/', {id})

export const resourceRenameApi = (path: string, name: string) => put<ApiResponse<undefined>>('/ide/', {}, {path, name})

export const resourceDeleteApi = (path: string) => del<ApiResponse<undefined>>('/ide/', {path})

export const resourceCreateApi = (path: string, name: string) => post<ApiResponse<resourceData>>('/ide/', {path, name})

export const resourceLazyLoadApi = (path: string) => get<ApiResponse<resourceData[]>>('/ide/lazy/', {path})

export const resourceLoadApi = (path: string) => get<ApiResponse<string>>('/ide/file/', {path})

export const resourceWriteApi = (path: string, content: string) => put<ApiResponse<undefined>>('/ide/file/', {path, content})

export const resourceUploadApi = (path: string, file: File) => {
    const formData = new FormData();
    formData.append('path', path);
    formData.append('file', file);
    return upload<ApiResponse<undefined>>('/ide/file/', formData)
}