import {get} from "@/api/request";
import type {ApiResponse} from "@/types/global";


export interface MonitorItem {
    "time": number,
    "cpu_usage": number,
    "memory_usage": number,
    "sent": number,
    "recv": number,
    "load": [number, number, number],
    "score": number,
    "cpu_count": number,
    "tasks": {
        "taskUid": string,
        "status": number
    }[]
}

export interface MonitorData {
    "nodeUid": string,
    "monitor": MonitorItem[]
}

export const monitorApi = () => get<ApiResponse<MonitorData[]>>('/monitor/')