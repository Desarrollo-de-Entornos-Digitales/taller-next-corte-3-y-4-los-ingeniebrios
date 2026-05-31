// src/app/(public)/login/services/login.service.ts
import axiosClient, { safeRequest } from "../../../../lib/axios/client"; 

// 1. Tipamos la estructura que devuelve tu NestJS
export type LoginResponse = {
  access_token: string;
};

class LoginService {
    async login(email: string, password: string) {
        // 2. Envolvemos la petición en safeRequest para que devuelva { error, data, status }
        return await safeRequest<LoginResponse>(
            axiosClient.post("/auth/login", { 
                institutional_email: email, 
                password: password 
            })
        );
    }
}

export const loginService = new LoginService();