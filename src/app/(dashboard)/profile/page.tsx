"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileHeader from "./components/ProfileHeader";
import { getCurrentUser, getUserPosts, User, Post } from "./services/profile.service";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = document.cookie.split("; ").find(r => r.startsWith("token="))?.split("=")[1]
      ?? localStorage.getItem("token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.permissions?.includes("manage_users")) {
          router.replace("/admin");
          return;
        }
      } catch {}
    }

    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        const userPosts = await getUserPosts(currentUser.id);
        setPosts(userPosts);
      } catch (error) {
        console.error("Error cargando perfil:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <p className="text-[#5856D6] font-semibold text-lg animate-pulse">Cargando tu perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <ProfileHeader
        user={{
          id: user?.id ?? 0,
          name: user?.name || "Usuario",
          username: user?.username || "username",
          avatar: user?.avatar || "/avatar.png",
          level: user?.student?.level ?? 1,
          friends: user?.student?.friends ?? 0,
          thanks: user?.student?.thanks ?? 0,
          career: user?.student?.career?.name || "Carrera no asignada",
          semester: user?.student?.semester ? `${user.student.semester}° Semestre` : "Semestre no asignado",
        }}
        posts={posts}
        isOwnProfile={true}
      />
    </div>
  );
}