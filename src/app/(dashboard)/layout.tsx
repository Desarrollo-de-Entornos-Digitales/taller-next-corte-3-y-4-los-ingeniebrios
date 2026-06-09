// Dashboard Layout - protects all dashboard routes
// Redirects to login if user is not authenticated
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "../../common/components/Navbar";

// Server Component for dashboard layout
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    // Read cookies from browser on Next.js server
    const cookiesStore = await cookies();
    const token = cookiesStore.get("token")?.value;

    // Protect dashboard routes - block access without token
    // If user tries to access /feed without token, redirect to /login
    if (!token) {
        redirect("/login");
    }

    // If token exists, render application normally
    return (
        <>
            <Navbar title="Dashboard" />
            <main className="min-h-screen bg-[#F5F5F7]">{children}</main>
        </>
    );
}