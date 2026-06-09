// register.action.ts - Server Action
// Handles user registration and token storage
"use server";
import { cookies } from "next/headers";
import { registerService } from "./service/register.service";

// Server Action for user registration
// Takes user data and creates new account
export default async function registerAction(userData: {
  name: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
}) {
  try {
    const result = await registerService.register(userData);

    const cookiesStore = await cookies();
    cookiesStore.set("token", result.access_token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return {
      success: true,
      access_token: result.access_token,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Error al registrar usuario",
    };
  }
}