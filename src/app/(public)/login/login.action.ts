"use server";

import { cookies } from "next/headers";
import { loginService } from "./services/login.service";

export default async function loginAction(email: string, password: string) {
    const result = await loginService.login(email, password);

    if (result.error) {
        if (result.status === 404) {
            return {
                error: true,
                message: "Correo institucional o contraseña incorrectos. Por favor, verifica tus datos."
            };
        }
        if (result.status === 401) {
            const serverMessage = (result.message ?? "").toLowerCase();
            if (
                serverMessage.includes("deshabilitada") ||
                serverMessage.includes("baneado") ||
                serverMessage.includes("disabled")
            ) {
                return {
                    error: true,
                    message: "Tu cuenta ha sido baneada. Contacta al administrador."
                };
            }
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

    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    const userId = payload.sub || payload.id || payload.userId;

    const cookiesStore = await cookies();
    cookiesStore.set("token", token, {
        httpOnly: false,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    return {
        error: false,
        data: result.data,
        status: result.status,
    };
}