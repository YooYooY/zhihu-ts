import request from "./request";

export function getColumns<T>(currentPage: number, pageSize: number) {
    return request.get<T,T>(`/columns?currentPage=${currentPage}&pageSize=${pageSize}`)
}

export function getColumn<T>(cid: string) {
    return request.get<T,T>(`/columns/${cid}`)
}
