import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

// Create axios instance with API base URL from environment variables
const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, 
    headers: {
        "Content-Type": "application/json"
    }
});

// Helper function to set Bearer token in request headers
const setAuthorizationHeader = (config: InternalAxiosRequestConfig, token?: string) => {
    if (!token) return;

    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
};

const onRequest = async (config: InternalAxiosRequestConfig) => {
    let token: string | undefined;

    // If running on server (Next.js Server Components / Server Actions)
    // retrieve token from cookies
    if (typeof window === "undefined") {
        const { cookies } = await import("next/headers");
        token = (await cookies()).get("token")?.value;
    } else {
        // If running in browser (Client Components), retrieve token from localStorage
        token = localStorage.getItem("token") ?? undefined;
    }
    
    setAuthorizationHeader(config, token);
    return config;
};

const onSuccess = (response: AxiosResponse) => {
    return response;
};

const onError = (error: AxiosError) => {
    return Promise.reject(error);
};

// Axios interceptors for handling requests and responses
// Request interceptor: attaches authorization token to all requests
axiosClient.interceptors.request.use(onRequest, onError);
// Response interceptor: handles successful responses and errors
axiosClient.interceptors.response.use(onSuccess, onError);

// Unified type for API responses with either success or error state
export type ApiResult<T> = {
    error: false;
    data: T;
    status: number;
} | {
    error: true;
    message: string;
    status?: number;
};

// Safe wrapper function for making HTTP requests without breaking the app
// Catches errors and returns a consistent ApiResult type
export async function safeRequest<T>(request: Promise<AxiosResponse<T>>): Promise<ApiResult<T>> {
    try {
        const response = await request;
        return {
            error: false,
            data: response.data,
            status: response.status
        };
    } catch (error) {
        if (error instanceof AxiosError) {
            return {
                error: true,
                message: error.response?.data?.message || error.message,
                status: error.response?.status
            };
        }
        return {
            error: true,
            message: "An unexpected error occurred",
            status: undefined
        };
    }
}

export default axiosClient;