// src/app/(public)/register/service/register.service.ts
import axiosClient from "../../../../lib/axios/client"; 

export interface RegisterResponse {
    access_token: string;
    user: {
        id: number;
        institutional_email: string;
        name?: string;
    };
}

class RegisterService {
    async register(userData: any): Promise<RegisterResponse> {
        try {
            const response = await axiosClient.post<RegisterResponse>("/auth/register", {
                name: userData.name,
                username: userData.username,
                institutional_email: userData.email, 
                password: userData.password,    
                avatar: userData.avatar,
                roleName: "student" 
            });
            return response.data;
        } catch (error) {
            console.error("Error en RegisterService:", error);
            throw error;
        }
    }
}

export const registerService = new RegisterService();