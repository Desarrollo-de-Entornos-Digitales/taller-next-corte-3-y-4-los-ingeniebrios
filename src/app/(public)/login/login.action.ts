// src/app/(public)/login/login.action.ts
"use server";

import { cookies } from "next/headers";
import { loginService } from "./services/login.service";

export default async function loginAction(email: string, password: string) {
    const result = await loginService.login(email, password);

    // 1. Si las credenciales están mal (el servidor responde 401 o 404)
    if (result.error) {
        // Hacemos el mensaje mucho más amigable para el estudiante
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

    // 🔍 Diagnóstico de emergencia para extraer el token donde sea que venga
    let token: string | undefined = undefined;

    if (result.data) {
        token = (result.data as any).access_token || 
                (result.data as any).token || 
                (result.data as any).data?.access_token;
    }

    // 2. Si definitivamente no encontramos ningún token en la respuesta
    if (!token) {
        return {
            error: true,
            message: "La cuenta existe, pero hubo un problema al generar tu sesión. Inténtalo de nuevo."
        };
    }

    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    const userId = payload.sub || payload.id || payload.userId;

    // 3. Crear la cookie si todo es correcto
    const cookiesStore = await cookies();
    
    cookiesStore.set("token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 semana
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    // Cookie del userId (legible en cliente y servidor)
    cookiesStore.set("userId", String(userId), {
        httpOnly: false,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    return {
        error: false,
        data: result.data,
        status: result.status
    };
}