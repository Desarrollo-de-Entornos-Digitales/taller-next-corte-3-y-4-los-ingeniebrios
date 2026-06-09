// src/app/(public)/login/services/login.service.ts
import axiosClient, { safeRequest } from "../../../../lib/axios/client";

// Type definition for login API response
export type LoginResponse = {
    access_token: string;
};

// Login Service - handles authentication API calls
class LoginService {
    // Authenticate user with email and password
    async login(email: string, password: string) {
        // Wrap request in safeRequest to handle errors consistently
        return await safeRequest<LoginResponse>(
            axiosClient.post("/auth/login", {
                institutional_email: email,
                password: password
            })
        );
    }
}

export const loginService = new LoginService();