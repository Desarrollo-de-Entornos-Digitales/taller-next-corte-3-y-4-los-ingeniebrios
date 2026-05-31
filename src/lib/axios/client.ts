import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

const axiosClient = axios.create({
    // Usamos tu variable de entorno
    baseURL: process.env.NEXT_PUBLIC_API_URL, 
    headers: {
        "Content-Type": "application/json"
    }
});

const setAuthorizationHeader = (config: InternalAxiosRequestConfig, token?: string) => {
    if (!token) return;

    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
};

const onRequest = async (config: InternalAxiosRequestConfig) => {
    let token: string | undefined;

    // Si Next.js ejecuta esto en el Servidor (Server Components / Server Actions)
    if (typeof window === "undefined") {
        const { cookies } = await import("next/headers");
        token = (await cookies()).get("token")?.value;
    } else {
        // Si se ejecuta en el Navegador (Client Components)
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

// Activar los interceptores
axiosClient.interceptors.request.use(onRequest, onError);
axiosClient.interceptors.response.use(onSuccess, onError);

// Tipado unificado para las respuestas de la API
export type ApiResult<T> = {
    error: false;
    data: T;
    status: number;
} | {
    error: true;
    message: string;
    status?: number;
};

// Envoltorio seguro para ejecutar peticiones HTTP sin romper la app
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