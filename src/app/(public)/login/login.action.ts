"use server";

import { cookies } from "next/headers";
import { loginService } from "./services/login.service";

export default async function loginAction(email: string, password: string) {
    const result = await loginService.login(email, password);

    if (result.error) {
        if (result.status === 401 || result.status === 404) {
            return {
                error: true,
                message: "Correo institucional o contraseña incorrectos. Por favor, verifica tus datos."
            };
        }
        return {
            error: true,
            message: `No se pudo conectar con el servidor: ${result.message}`
        };
    }

    let token: string | undefined = undefined;

    if (result.data) {
        token = (result.data as any).access_token || 
                (result.data as any).token || 
                (result.data as any).data?.access_token;
    }

    if (!token) {
        return {
            error: true,
            message: "La cuenta existe, pero hubo un problema al generar tu sesión. Inténtalo de nuevo."
        };
    }

    const cookiesStore = await cookies();
    
    cookiesStore.set("token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    let userId: number | null = null;
    let studentId: number | null = null;
    let hasSetup: boolean = false;

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const userResponse = await fetch(`${apiUrl}/users/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        if (userResponse.ok) {
            const userInfo = await userResponse.json();
            userId = userInfo.id;
            
            if (userInfo.student) {
                studentId = userInfo.student.id;
                hasSetup = !!(userInfo.student.career?.id && userInfo.student.semester);
            }
        }
    } catch (error) {
        console.error("Error obteniendo usuario:", error);
    }

    if (userId) {
        cookiesStore.set("userId", userId.toString(), {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
    }

    if (studentId) {
        cookiesStore.set("studentId", studentId.toString(), {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
    }

    return {
        error: false,
        data: result.data,
        status: result.status,
        userId: userId,
        studentId: studentId,
        hasSetup: hasSetup,
    };
}