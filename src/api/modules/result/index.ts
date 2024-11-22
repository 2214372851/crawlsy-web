import {get} from "@/api/request";
import type {ApiListResponse, ApiResponse} from "@/types/global";


export const taskResultListApi = (
    id: string,
    page?: number,
    pageSize?: number
) => get<ApiResponse<ApiListResponse<Record<string, string>>>>(`/result/`, {page, pageSize, id})