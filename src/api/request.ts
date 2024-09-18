import http from "@/api/http";

export const get = <T>(url: string, params: Record<string, any> = {}): Promise<T> => {
    return http({
        method: 'get',
        url,
        params
    })
}

export const post = <T>(url: string, data: Record<string, any> = {}): Promise<T> => {
    return http({
        method: 'post',
        url,
        data
    })
}

export const put = <T>(url: string, data: Record<string, any> = {}, params: Record<string, any> = {}): Promise<T> => {
    return http({
        method: 'put',
        url,
        data,
        params
    })
}

export const del = <T>(url: string, params: Record<string, any> = {}): Promise<T> => {
    return http({
        method: 'delete',
        url,
        params
    })
}