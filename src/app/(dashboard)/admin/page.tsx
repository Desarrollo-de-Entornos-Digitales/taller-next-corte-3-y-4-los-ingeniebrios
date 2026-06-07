import AdminPanel from "./components/AdminPanel";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    if (!payload.permissions?.includes("manage_users")) redirect("/feed");
  } catch {
    redirect("/login");
  }

  return <AdminPanel />;
}