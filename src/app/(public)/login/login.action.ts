"use server"

import { cookies } from "next/headers";
import { loginService } from "./services/login.service";

export default async function loginAction(email: string, password: string) {

    const result = await loginService.login(email, password);

    if (result.error) {
        console.error(result.message)
        return result;
    }

    const cookiesStore = await cookies()
    console.log(result)
    cookiesStore.set("token", result.data.access_token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return result;

}