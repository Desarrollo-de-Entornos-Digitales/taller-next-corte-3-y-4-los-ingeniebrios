"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ProfilePostCard from "./ProfilePostCard";
import { Post } from "../services/profile.service";

interface ProfileHeaderProps {
  user: {
    id: number;
    name: string;
    username: string;
    avatar: string;
    level: number;
    friends: number;
    thanks: number;
    career: string;
    semester: string;
  };
  posts: Post[];
}

const getValidAvatar = (avatar: string) =>
  avatar && avatar.startsWith("data:") ? avatar : "/avatar.png";

export default function ProfileHeader({ user, posts }: ProfileHeaderProps) {
  const router = useRouter();
  const [career, setCareer] = useState(user.career);
  const [semester, setSemester] = useState(user.semester);
  const [avatar, setAvatar] = useState(getValidAvatar(user.avatar));
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAvatar(getValidAvatar(user.avatar));
    if (user.career && user.career !== "Carrera no asignada") {
      setCareer(user.career);
      setSemester(user.semester);
    } else {
      const savedSetup = localStorage.getItem("userSetup");
      if (savedSetup) {
        const data = JSON.parse(savedSetup);
        setCareer(data.career);
        setSemester(`${data.semester}° Semestre`);
      }
    }
  }, [user]);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const token = document.cookie.split("; ").find((r) => r.startsWith("token="))?.split("=")[1]
        ?? localStorage.getItem("token");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/avatar`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar: base64 }),
      });

      if (response.ok) {
        setAvatar(base64);
        router.refresh();
      } else {
        alert("No se pudo actualizar la foto.");
      }
    } catch {
      alert("Ocurrió un error al subir la foto.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* BANNER */}
      <div className="h-[200px] bg-[#EEF2C9] rounded-b-[40px]" />

      <div className="max-w-[1100px] mx-auto px-8 -mt-[100px] pb-12">
        <div className="flex gap-8 items-start">

          {/* CARD IZQUIERDA */}
          <div className="relative w-[300px] flex-shrink-0">
            {/* AVATAR */}
            <div className="absolute -top-[70px] left-1/2 -translate-x-1/2 z-20">
              <div
                className="w-[140px] h-[140px] rounded-full bg-white flex items-center justify-center shadow-lg relative cursor-pointer group"
                onClick={handleAvatarClick}
              >
                <Image
                  src={avatar}
                  alt={user.name}
                  width={130}
                  height={130}
                  className="rounded-full object-cover aspect-square"
                  unoptimized
                />
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    {uploading ? "Subiendo..." : "Cambiar foto"}
                  </span>
                </div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>

            {/* TARJETA VERDE */}
            <div className="bg-[#D7E95D] rounded-[28px] pt-[85px] px-6 pb-6 relative">
              <button className="absolute top-5 right-5">
                <Image src="/settings.png" alt="settings" width={26} height={26} />
              </button>

              <div className="text-center">
                <h1 className="text-[22px] font-black tracking-[2px] text-[#1D1D1D] truncate px-2">
                  {user.name.toUpperCase()}
                </h1>
                <p className="text-[#565656] text-sm mt-1">@{user.username}</p>
              </div>

              <div className="flex justify-between items-center mt-6">
                <div className="text-center flex-1">
                  <p className="text-xs text-[#4A4A4A] font-medium">Amigos</p>
                  <p className="font-bold text-lg text-[#5856D6]">{user.friends}</p>
                </div>
                <div className="w-[1px] h-8 bg-[#A9B75A]" />
                <div className="text-center flex-1">
                  <p className="text-xs text-[#4A4A4A] font-medium">Nivel</p>
                  <p className="font-bold text-lg text-[#5856D6]">{user.level}</p>
                </div>
                <div className="w-[1px] h-8 bg-[#A9B75A]" />
                <div className="text-center flex-1">
                  <p className="text-xs text-[#4A4A4A] font-medium">Gracias</p>
                  <p className="font-bold text-lg text-[#5856D6]">{user.thanks}</p>
                </div>
              </div>

              {/* CARRERA */}
              <div className="bg-[#5856D6] rounded-2xl mt-5 px-4 py-4 flex items-center justify-between">
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-white font-semibold text-sm leading-tight break-words">{career}</p>
                  <p className="text-[#D5D5FF] text-xs mt-1">{semester}</p>
                </div>
                <Image src="/birrete.png" alt="birrete" width={38} height={38} className="flex-shrink-0" />
              </div>
            </div>
          </div>

          {/* PUBLICACIONES DERECHA */}
          <div className="flex-1 mt-[120px]">
            <h2 className="text-[#5856D6] text-2xl font-bold mb-4">Tus publicaciones</h2>
            {posts.length === 0 ? (
              <div className="bg-white rounded-[20px] p-8 text-center shadow-sm border border-gray-100">
                <p className="text-gray-400 text-sm">No tienes publicaciones aún. ¡Crea tu primera pregunta!</p>
              </div>
            ) : (
              posts.map((post) => (
                <ProfilePostCard key={post.id} post={post} />
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}