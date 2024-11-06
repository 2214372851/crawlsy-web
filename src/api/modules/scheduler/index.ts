import {del, get, post, put} from "@/api/request";
import type {ApiListResponse, ApiResponse} from "@/types/global";

export type SchedulerStatus = {
    status: number
}

export const schedulerStatusApi = () => {
    return get<ApiResponse<SchedulerStatus>>('/scheduler/')
}

