"use client";

import { useEffect, useState } from "react";
import ProfileHeader from "./components/ProfileHeader";
import PostCard from "./components/PostCard";
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
        <p className="text-[#5856D6] font-semibold text-lg animate-pulse">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* ProfileHeader ya incluye su propio banner y todo */}
      <ProfileHeader
        user={{
          name: user?.name || "Andy",
          username: user?.username || "AndyTheBeast",
          avatar: user?.avatar || "/Andyprofile.png",
          level: user?.student?.level ?? 1,
          friends: 5,
          thanks: user?.student?.thanks ?? 6,
          career: user?.student?.career?.name || "Interactive Media Design",
          semester: user?.student?.semester ? `Semestre ${user.student.semester}` : "First Semester",
        }}
      />

      {/* Contenido de publicaciones - fuera del ProfileHeader */}
      <div className="max-w-[1100px] mx-auto px-8 mt-6">
        <div className="flex justify-end">
          <div className="w-[310px]">
            {/* Espacio vacío para mantener alineación con el header */}
          </div>
          
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
                <PostCard
                  key={post.id}
                  title={post.title}
                  hasProblem={!!post.image}
                  image={post.image}
                  comments={post.answers?.length ?? 0}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}