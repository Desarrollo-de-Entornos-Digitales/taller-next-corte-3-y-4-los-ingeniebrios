"use client";

import { useEffect, useState } from "react";
import ProfileHeader from "./components/ProfileHeader";
import ProfilePostCard from "./components/ProfilePostCard";
import { getCurrentUser, getUserPosts, User, Post } from "./services/profile.service";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        const userPosts = await getUserPosts(currentUser.id);
        setPosts(userPosts);
      } catch (error) {
        console.error("Error cargando perfil desde la base de datos:", error);
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
          name: user?.name || "Usuario",
          username: user?.username || "username",
          avatar: user?.avatar || "https://i.pravatar.cc/150",
          
          level: user?.student?.level ?? 1,      
          friends: user?.student?.friends ?? 0,  
          thanks: user?.student?.thanks ?? 0,  
          
          // 🎓 Datos reales del Setup guardados en la BD
          career: user?.student?.career?.name || "Carrera no asignada",
          semester: user?.student?.semester ? `${user.student.semester}° Semestre` : "Semestre no asignado",
        }}
      />

      <div className="max-w-[1100px] mx-auto px-8 mt-6">
        <div className="flex justify-end">
          <div className="w-[310px]" />
          
          <div className="flex-1">
            <h2 className="text-[#5856D6] text-2xl font-bold mb-4">
              Tus publicaciones
            </h2>

            {posts.length === 0 ? (
              <div className="bg-white rounded-[20px] p-8 text-center shadow-sm">
                <p className="text-gray-400 text-sm">
                  No tienes publicaciones aún. ¡Crea tu primera pregunta!
                </p>
              </div>
            ) : (
              posts.map((post) => (
                <ProfilePostCard
                  key={post.id}
                  post={post}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}