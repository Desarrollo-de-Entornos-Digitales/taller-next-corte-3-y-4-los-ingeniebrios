import axiosClient from "../../../../lib/axios/client"; 

class LoginService {
    async login(email: string, passwordHash: string) {
        const result = await axiosClient.post("/auth/login", { 
            institutional_email: email, 
            password: passwordHash 
        });
        return result.data;
    }
}

export const loginService = new LoginService();