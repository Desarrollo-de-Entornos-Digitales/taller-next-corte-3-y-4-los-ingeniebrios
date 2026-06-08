"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import ProfilePostCard from "./ProfilePostCard";``
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
  isOwnProfile?: boolean;
}

type FriendshipStatus = 'none' | 'pending' | 'accepted';

interface FriendUser {
  id: number;
  name: string;
  username: string;
  avatar?: string;
}

const getValidAvatar = (avatar: string) =>
  avatar?.startsWith("data:") ? avatar : "/avatar.png";

const getToken = () =>
  localStorage.getItem("token") ??
  document.cookie.split("; ").find(r => r.startsWith("token="))?.split("=")[1] ??
  null;

export default function ProfileHeader({ user, posts, isOwnProfile = false }: ProfileHeaderProps) {
  const router = useRouter();
  const [career, setCareer] = useState(user.career);
  const [semester, setSemester] = useState(user.semester);
  const [avatar, setAvatar] = useState(getValidAvatar(user.avatar));
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [friendshipStatus, setFriendshipStatus] = useState<FriendshipStatus>('none');
  const [friendshipRequestId, setFriendshipRequestId] = useState<number | null>(null);
  const [friendsList, setFriendsList] = useState<FriendUser[]>([]);
  const [friendsCount, setFriendsCount] = useState(user.friends);

  const loadFriendshipData = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;

      const resFriends = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/friends/user/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (resFriends.ok) {
        const data: FriendUser[] = await resFriends.json();
        setFriendsList(data);
        setFriendsCount(data.length);
      }

      if (!isOwnProfile) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const loggedUserId = payload.sub ?? payload.id;

        const resCheck = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/friends/request/${loggedUserId}/${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (resCheck.ok) {
          const checkData = await resCheck.json();
          setFriendshipStatus(checkData.status ?? 'none');
          setFriendshipRequestId(checkData.requestId ?? null);
        }
      }
    } catch (err) {
      console.error("Error cargando datos de amistad:", err);
    }
  }, [user.id, isOwnProfile]);

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

    loadFriendshipData();
    window.addEventListener("friendshipChanged", loadFriendshipData);
    return () => window.removeEventListener("friendshipChanged", loadFriendshipData);
  }, [user, loadFriendshipData]);

  const sendFriendRequest = async () => {
    try {
      const token = getToken();
      if (!token) { alert("Error: Inicia sesión nuevamente."); return; }

      const payload = JSON.parse(atob(token.split(".")[1]));
      const senderId = payload.id ?? payload.sub ?? payload.userId ?? payload.user?.id;

      console.log("🔑 senderId:", senderId);
      console.log("🎯 receiverId:", user.id);

      if (!senderId) {
        alert("No se pudo identificar tu sesión. Vuelve a iniciar sesión.");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/friends`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ senderId: Number(senderId), receiverId: Number(user.id), status: 'pending' }),
      });

      console.log("📡 POST /friends status:", res.status);
      const friendData = await res.json();
      console.log("📡 POST /friends response:", friendData);

      if (!res.ok) {
        alert(friendData.message || "No se pudo enviar la solicitud.");
        return;
      }

      setFriendshipRequestId(friendData.id ?? null);

      const notifPayload = {
        senderId: Number(senderId),
        receiverId: Number(user.id),
        message: "Te ha enviado una solicitud de amistad.",
        read: false,
      };
      console.log("📨 POST /notifications payload:", notifPayload);

      const resNotif = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(notifPayload),
      });

      console.log("📨 POST /notifications status:", resNotif.status);
      const notifData = await resNotif.json();
      console.log("📨 POST /notifications response:", notifData);

      setFriendshipStatus('pending');
      alert("¡Solicitud enviada exitosamente!");
    } catch (err) {
      console.error("💥 Error al enviar solicitud:", err);
      alert("Error de red. Intenta de nuevo.");
    }
  };

  const removeFriend = async (friendId: number) => {
    if (!confirm("¿Seguro que deseas eliminar a este amigo?")) return;
    try {
      const token = getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/friends/remove-friendship/${friendId}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.ok) {
        setFriendsList(prev => prev.filter(f => f.id !== friendId));
        setFriendsCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Error eliminando amigo:", err);
    }
  };

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

      const token = getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/avatar`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ avatar: base64 }),
      });

      if (response.ok) { setAvatar(base64); router.refresh(); }
    } catch {
      alert("Ocurrió un error al subir la foto.");
    } finally {
      setUploading(false);
    }
  };

  console.log("🔵 Render ProfileHeader, friendshipStatus:", friendshipStatus, "isOwnProfile:", isOwnProfile);

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="h-[200px] bg-[#EEF2C9] rounded-b-[40px]" />
      <div className="max-w-[1100px] mx-auto px-8 -mt-[100px] pb-12">
        <div className="flex gap-8 items-start">

          <div className="relative w-[300px] flex-shrink-0 flex flex-col gap-4">
            <div className="bg-[#D7E95D] rounded-[28px] pt-[85px] px-6 pb-6 relative shadow-sm">
              <div className="absolute -top-[70px] left-1/2 -translate-x-1/2 z-20">
                <div
                  className="w-[140px] h-[140px] rounded-full bg-white flex items-center justify-center shadow-lg relative cursor-pointer group"
                  onClick={isOwnProfile ? handleAvatarClick : undefined}
                >
                  <Image
                    src={avatar}
                    alt={user.name}
                    width={130}
                    height={130}
                    className="rounded-full object-cover aspect-square"
                    unoptimized
                  />
                  {isOwnProfile && (
                    <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        {uploading ? "Subiendo..." : "Cambiar foto"}
                      </span>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>

              <div className="text-center">
                <h1 className="text-[22px] font-black tracking-[2px] text-[#1D1D1D] truncate px-2">
                  {user.name.toUpperCase()}
                </h1>
                <p className="text-[#565656] text-sm mt-1">@{user.username}</p>
              </div>

              <div className="flex justify-between items-center mt-6">
                <div className="text-center flex-1">
                  <p className="text-xs text-[#4A4A4A] font-medium">Amigos</p>
                  <p className="font-bold text-lg text-[#5856D6]">{friendsCount}</p>
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

              {!isOwnProfile && (
                <div className="mt-4">
                  {friendshipStatus === 'none' && (
                    <button
                      onClick={() => {
                        console.log("🖱️ Click detectado, status:", friendshipStatus);
                        sendFriendRequest();
                      }}
                      className="w-full bg-[#5856D6] text-white text-xs font-bold py-3 rounded-xl hover:bg-[#4745b4] transition shadow-md"
                    >
                      Enviar solicitud de amistad
                    </button>
                  )}
                  {friendshipStatus === 'pending' && (
                    <button disabled className="w-full bg-gray-300 text-gray-600 text-xs font-bold py-3 rounded-xl cursor-not-allowed">
                      Solicitud pendiente...
                    </button>
                  )}
                  {friendshipStatus === 'accepted' && (
                    <button disabled className="w-full bg-green-500 text-white text-xs font-bold py-3 rounded-xl cursor-not-allowed">
                      ✓ ¡Son amigos!
                    </button>
                  )}
                </div>
              )}

              <div className="bg-[#5856D6] rounded-2xl mt-4 px-4 py-4 flex items-center justify-between">
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-white font-semibold text-sm leading-tight break-words">{career}</p>
                  <p className="text-[#D5D5FF] text-xs mt-1">{semester}</p>
                </div>
                <Image src="/birrete.png" alt="birrete" width={38} height={38} className="flex-shrink-0" />
              </div>
            </div>

            <div className="bg-white rounded-[28px] p-5 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex justify-between items-center">
                <span>Lista de amigos</span>
              </h3>
              {friendsList.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">No hay amigos agregados aún.</p>
              ) : (
                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                  {friendsList.map(friend => (
                    <div key={friend.id} className="flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-gray-50 transition">
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={getValidAvatar(friend.avatar ?? "")}
                          className="w-8 h-8 rounded-full object-cover aspect-square flex-shrink-0"
                          alt={friend.name}
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-800 truncate leading-tight">{friend.name}</p>
                          <p className="text-[10px] text-gray-400 truncate">@{friend.username}</p>
                        </div>
                      </div>
                      {isOwnProfile && (
                        <button
                          onClick={() => removeFriend(friend.id)}
                          className="text-[10px] bg-red-50 text-red-600 font-bold px-2 py-1 rounded-lg hover:bg-red-100 transition flex-shrink-0"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 mt-[120px]">
            <h2 className="text-[#5856D6] text-2xl font-bold mb-4">
              {isOwnProfile ? "Tus publicaciones" : "Publicaciones"}
            </h2>
            {posts.length === 0 ? (
              <div className="bg-white rounded-[20px] p-8 text-center shadow-sm border border-gray-100">
                <p className="text-gray-400 text-sm">No tienes publicaciones aún. ¡Crea tu primera pregunta!</p>
              </div>
            ) : (
              posts.map((post) => <ProfilePostCard key={post.id} post={post} />)
            )}
          </div>

        </div>
      </div>
    </div>
  );
}