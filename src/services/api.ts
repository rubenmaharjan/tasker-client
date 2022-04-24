import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export interface ApiResponse<T> {
    ok: true
    problem: null
    originalError: null

    data?: T
    status?: number
    statusText?: string
    headers?: {}
    config?: AxiosRequestConfig
    duration?: number
}

export class ApiWrapper {
    protected apisauce: AxiosInstance

    constructor() {
        this.apisauce = axios.create({
            baseURL: "http://localhost:8000/",
        })
    }

    prepareResponse<T>(response: ApiResponse<T>) {
        if (response.statusText == "OK") {
            return { kind: "OK", data: response.data }
        }
    }
}