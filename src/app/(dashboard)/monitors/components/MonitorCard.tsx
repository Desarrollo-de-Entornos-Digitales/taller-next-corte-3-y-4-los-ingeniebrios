"use client";

import { useState, useEffect } from "react";
import { MonitorResponse } from "../services/monitor.service";

interface MonitorCardProps {
  monitor: MonitorResponse;
  onDeleted?: (id: number) => void;
}

const getAvatar = (avatar: string | null | undefined, name: string) => {
  if (avatar && avatar.startsWith("data:")) return avatar;
  return `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(name)}`;
};

const getToken = () =>
  document.cookie.split("; ").find(r => r.startsWith("token="))?.split("=")[1]
  ?? localStorage.getItem("token");

const checkIsAdmin = (): boolean => {
  try {
    const token = getToken();
    if (!token) return false;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return Array.isArray(payload.permissions) && payload.permissions.includes("manage_users");
  } catch {
    return false;
  }
};

export default function MonitorCard({ monitor, onDeleted }: MonitorCardProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const studentName = monitor.student?.user?.name || "Estudiante Icesi";
  const avatarUrl = getAvatar(monitor.student?.user?.avatar, studentName);

  useEffect(() => {
    setIsAdmin(checkIsAdmin());
  }, []);

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar a ${studentName} como monitor?`)) return;
    setDeleting(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/monitors/${monitor.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    setDeleting(false);
    if (res.ok) {
      onDeleted?.(monitor.id);
    } else {
      alert("No se pudo eliminar el monitor.");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col items-center text-center transition-all duration-200 hover:shadow-md relative">
      
      {isAdmin && (
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="absolute top-3 right-3 bg-red-50 text-red-400 text-xs font-bold px-2 py-1 rounded-lg hover:bg-red-100 transition disabled:opacity-50"
        >
          {deleting ? "..." : "🗑"}
        </button>
      )}

      <div className="w-20 h-20 rounded-full overflow-hidden mb-4 bg-gray-100 border-2 border-indigo-100">
        <img src={avatarUrl} alt={studentName} className="w-full h-full object-cover" />
      </div>

      <h3 className="font-bold text-gray-800 text-base mb-1 line-clamp-1">{studentName}</h3>

      <span className="bg-[#EBEBFF] text-[#5856D6] text-xs font-bold px-3 py-1 rounded-full mb-3 max-w-full truncate">
        {monitor.subject || "Monitor Genérico"}
      </span>

      <p className="text-xs text-gray-500 mt-auto pt-2 border-t border-gray-50 w-full line-clamp-2">
        ⏰ {monitor.availability || "Horario por definir"}
      </p>
    </div>
  );
}