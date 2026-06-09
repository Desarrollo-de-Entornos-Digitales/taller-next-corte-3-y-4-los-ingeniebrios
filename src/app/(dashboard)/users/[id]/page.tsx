"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import ProfileHeader from "../../../../common/components/ProfileHeader";

import {
  getUserById,
  getUserPosts,
} from "./services/user-profile.service";

// User Profile Page - displays profile for a specific user (by ID)
export default function UserProfilePage() {
  const params = useParams();

  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user profile and posts on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = Number(params.id);

        const userData = await getUserById(userId);
        setUser(userData);

        const userPosts = await getUserPosts(userId);
        setPosts(userPosts);
      } catch (error) {
        console.error("Error cargando usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <p className="text-[#5856D6] font-semibold text-lg animate-pulse">
          Cargando perfil...
        </p>
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

          career:
            user?.student?.career?.name ||
            "Carrera no asignada",

          semester: user?.student?.semester
            ? `${user.student.semester}° Semestre`
            : "Semestre no asignado",
        }}

        posts={posts}
      />
    </div>
  );
}