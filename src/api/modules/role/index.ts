import {get} from "@/api/request";
import type {ApiListResponse, ApiResponse, menuOptionData} from "@/types/global";


export const roleOptionApi = () => get<ApiResponse<ApiListResponse<menuOptionData>>>('/roleOption/')