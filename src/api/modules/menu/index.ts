import {get} from "@/api/request";
import type {ApiListResponse, ApiResponse, menuOptionData} from "@/types/global";


export const menuOptionApi = () => get<ApiResponse<ApiListResponse<menuOptionData>>>('/menuOption/')