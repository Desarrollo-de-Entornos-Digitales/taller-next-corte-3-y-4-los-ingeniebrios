"use server";
import { cookies } from "next/headers";
import { registerService } from "../register/service/register.service";
import axiosClient from "../../../../lib/axios/client";


export default async function registerAction(email: string, password: string, name?: string) {
    try {
        const result = await registerService.register(email, password, name);
        
        const cookiesStore = await cookies();
        cookiesStore.set("token", result.access_token, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 1 semana
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });
        
        return { 
            success: true, 
            access_token: result.access_token,
            email: email,
            name: name || email.split('@')[0]
        };
    } catch (error: any) {
        return { 
            success: false, 
            error: error.response?.data?.message || "Error al registrar usuario" 
        };
    }
}