import axios, { AxiosError } from "axios";

// Cliente principal
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor de request
api.interceptors.request.use(
    (config) => {
        // Si más adelante manejas auth: config.headers.Authorization = `Bearer ${token}`;
        console.log("[API Request]", config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.log("[API Request Error]", error);
        return Promise.reject(error);
    }
);

// Interceptor de response
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response) {
            console.log("[API Error Response]", error.response.status, error.response.data);
        } else if (error.request) {
            console.log("[API Error Request] No response received");
        } else {
            console.log("[API Error Setup]", error.message);
        }
        return Promise.reject(error);
    }
);
