// src/app/(public)/login/login.action.ts
"use server";

import { cookies } from "next/headers";
import { loginService } from "./services/login.service";

export default async function loginAction(email: string, password: string) {
    // 1. Ejecutamos el login a través del servicio seguro
    const result = await loginService.login(email, password);

    // 2. Si safeRequest detectó un error (ej: 401, 404 o caída de servidor), lo manejamos aquí
    if (result.error) {
        console.error("Error en loginAction:", result.message);
        return result; // Retorna { error: true, message: "..." } al formulario
    }

    // 3. Si todo salió bien, guardamos el token de result.data en las cookies
    const cookiesStore = await cookies();
    
    cookiesStore.set("token", result.data.access_token, {
        httpOnly: true, // Protege la cookie para que no sea accesible desde JS en el navegador
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 semana de duración
        secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
        sameSite: "lax",
    });

    // 4. Retornamos el resultado exitoso para que el componente redirija al /feed
    return result;
}