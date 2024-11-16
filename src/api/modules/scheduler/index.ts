import {del, get, post, put} from "@/api/request";
import type {ApiListResponse, ApiResponse} from "@/types/global";

export type SchedulerStatus = {
    status: number
}

export type SchedulerError = {
    nodeUid: string,
    error: string
}

export type SchedulerPackageItem = {
    name: string;
    version: string;
}


export const schedulerStatusApi = (nodeUid: string, taskUid: string) => {
    return get<ApiResponse<SchedulerStatus>>('/scheduler/', {nodeUid, taskUid}, 30000)
}

export const schedulerStopApi = (taskUid: string) => {
    return del<ApiResponse<undefined | SchedulerError[]>>('/scheduler/', {taskUid}, 30000)
}

export const schedulerDeployApi = (taskUid: string) => {
    return post<ApiResponse<undefined | SchedulerError[]>>('/scheduler/', {taskUid}, 30000)
}

export const schedulerReloadApi = (taskUid: string) => {
    return put<ApiResponse<undefined | SchedulerError[]>>('/scheduler/', {}, {taskUid}, 40000)
}

export const schedulerPackageListApi = () => {
    return get<ApiListResponse<SchedulerPackageItem>>('/scheduler-package/', {}, 10000)
}
export const schedulerPackageInstallApi = (packageName: string) => {
    return post<ApiListResponse<undefined>>('/scheduler-package/', {packageName}, 10000)
}
export const schedulerPackageUninstallApi = (packageName: string) => {
    return del<ApiListResponse<undefined>>('/scheduler-package/', {packageName}, 10000)
}
export const schedulerPackageUpdateApi = (packageName: string) => {
    return put<ApiListResponse<undefined>>('/scheduler-package/', {}, {packageName}, 10000)
}


