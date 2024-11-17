import http from "@/api/http";

export const get = <T>(
    url: string,
    params: Record<string, any> = {},
    timeout = 5000
): Promise<T> => {
    return http({
        method: 'get',
        timeout,
        url,
        params
    })
}

export const post = <T>(
    url: string,
    data: Record<string, any> = {},
    timeout = 5000
): Promise<T> => {
    return http({
        method: 'post',
        timeout,
        url,
        data
    })
}

export const upload = <T>(url: string, data: FormData, timeout = 5000): Promise<T> => {
    return http({
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        timeout,
        url,
        data
    })
}

export const put = <T>(
    url: string,
    data: Record<string, any> = {},
    params: Record<string, any> = {},
    timeout = 5000
): Promise<T> => {
    return http({
        method: 'put',
        timeout,
        url,
        data,
        params
    })
}

export const del = <T>(
    url: string,
    params: Record<string, any> = {},
    timeout = 5000
): Promise<T> => {
    return http({
        method: 'delete',
        timeout,
        url,
        params
    })
}