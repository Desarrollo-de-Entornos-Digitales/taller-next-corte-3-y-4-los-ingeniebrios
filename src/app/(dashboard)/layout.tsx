// src/app/(dashboard)/layout.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "../../common/components/Navbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    // 1. Leemos las cookies del navegador desde el servidor de Next.js
    const cookiesStore = await cookies();
    const token = cookiesStore.get("token")?.value;

    // 2. 🔒 SI NO HAY TOKEN: Bloqueo inmediato.
    // Si escribe /feed en la URL, Next.js frena la renderización aquí mismo y lo bota a /login
    if (!token) {
        redirect("/login");
    }

    // 3. Si sí hay token, se muestra la aplicación común y corriente
    return (
        <>
            <Navbar title="Dashboard" />
            <main className="min-h-screen bg-[#F5F5F7]">{children}</main>
        </>
    );
}