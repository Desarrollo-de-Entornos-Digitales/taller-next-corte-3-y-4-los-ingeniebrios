"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PostResponse } from '../../../../common/services/post.service';

interface PostCardProps {
  post: PostResponse;
  onDeleted?: (id: number) => void;
}

const getAvatar = (avatar: string | null, name: string) => {
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

const REPORT_REASONS = [
  "Contenido inapropiado",
  "Spam o publicidad",
  "Información falsa",
  "Acoso o bullying",
  "Otro",
];

const PostCard: React.FC<PostCardProps> = ({ post, onDeleted }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [reported, setReported] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [reporting, setReporting] = useState(false);
  const [reportError, setReportError] = useState("");

  useEffect(() => {
    setIsAdmin(checkIsAdmin());
  }, []);

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar este post?")) return;
    setDeleting(true);
    try {
      const token = getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${post.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) onDeleted?.(post.id);
      else alert("No se pudo eliminar el post.");
    } catch {
      alert("Error al eliminar el post.");
    } finally {
      setDeleting(false);
    }
  };

  const handleReport = async () => {
    const reason = selectedReason === "Otro" ? customReason.trim() : selectedReason;
    if (!reason) {
      setReportError("Por favor selecciona o escribe una razón.");
      return;
    }

    setReporting(true);
    setReportError("");

    try {
      const token = getToken();
      const payload = JSON.parse(atob(token!.split(".")[1]));
      const reporterId = payload.sub || payload.id;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reason,
          reporterId,
          reportedId: post.user.id,
          status: "pending",
        }),
      });

      if (res.ok) {
        setReported(true);
        setShowReportModal(false);
        setSelectedReason("");
        setCustomReason("");
      } else {
        setReportError("No se pudo enviar el reporte. Intenta de nuevo.");
      }
    } catch {
      setReportError("Error de conexión.");
    } finally {
      setReporting(false);
    }
  };

  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    setTimeAgo(
      new Date(post.createdAt).toLocaleString('es-CO', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  }, [post.createdAt]);

  return (
    <>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4 flex flex-col gap-3 relative">
        <div className="flex items-center gap-3">
          <Link href={`/users/${post.user.id}`}>
            <img
              src={getAvatar(post.user.avatar, post.user.name)}
              alt={post.user.name}
              className="w-12 h-12 rounded-full object-cover border border-gray-200 cursor-pointer hover:opacity-80 transition"
            />
          </Link>

          <div className="flex flex-col flex-1">
            <span className="font-bold text-gray-800 text-sm leading-tight">
              {post.user.name} - Nivel: {post.user.student?.level ?? 1}
            </span>
            <span className="text-xs text-gray-400">{timeAgo}</span>
          </div>

          {isAdmin && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="ml-auto flex items-center gap-1 bg-red-50 text-red-500 text-xs font-semibold px-3 py-1.5 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              {deleting ? "Eliminando..." : "🗑 Eliminar"}
            </button>
          )}
        </div>

        <div className="mt-1">
          <h3 className="font-semibold text-gray-800 text-sm mb-1">{post.title}</h3>
          <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">{post.description}</p>
        </div>

        {post.image && (
          <div className="w-full overflow-hidden rounded-xl border border-gray-100 flex justify-center">
            <img src={post.image} alt="Imagen de la publicación" className="max-w-full max-h-[300px] h-auto w-auto" />
          </div>
        )}

        <div className="flex justify-between items-center mt-2">
          <span className="px-3 py-1 bg-[#EBEBFF] text-[#5856D6] rounded-full text-[10px] font-bold">
            {post.category.name}
          </span>

          <div className="flex items-center gap-2">
            {!isAdmin && (
              <button
                onClick={() => !reported && setShowReportModal(true)}
                disabled={reported}
                className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl transition-colors ${reported
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-red-50 text-red-400 hover:bg-red-100"
                  }`}
              >
                {reported ? "✓ Reportado" : "⚑ Reportar"}
              </button>
            )}

            <Link
              href={`/comments/${post.id}`}
              className="flex items-center gap-1.5 bg-[#F2F2F7] px-3 py-1.5 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors"
            >
              <span className="text-xs font-bold text-gray-600">{post.answers?.length ?? 0}</span>
              <img src="/comment.svg" alt="comments" className="w-4 h-4 opacity-50" />
            </Link>
          </div>
        </div>
      </div>

      {/* Modal de Reporte */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[420px] shadow-2xl flex flex-col gap-4">

            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-800 text-lg">Reportar publicación</h3>
              <button
                onClick={() => { setShowReportModal(false); setSelectedReason(""); setCustomReason(""); setReportError(""); }}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-gray-500">
              ¿Por qué quieres reportar la publicación de <span className="font-semibold text-gray-700">{post.user.name}</span>?
            </p>

            <div className="flex flex-col gap-2">
              {REPORT_REASONS.map((reason) => (
                <button
                  key={reason}
                  onClick={() => setSelectedReason(reason)}
                  className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${selectedReason === reason
                      ? "bg-[#EBEBFF] text-[#5856D6] border-2 border-[#5856D6]"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent"
                    }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            {selectedReason === "Otro" && (
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Describe el motivo del reporte..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-[#5856D6]/30"
              />
            )}

            {reportError && <p className="text-red-500 text-xs font-semibold">{reportError}</p>}

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => { setShowReportModal(false); setSelectedReason(""); setCustomReason(""); setReportError(""); }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleReport}
                disabled={reporting || !selectedReason}
                className="flex-1 py-2.5 rounded-xl bg-[#5856D6] text-white text-sm font-bold hover:bg-[#4644c4] transition disabled:opacity-50"
              >
                {reporting ? "Enviando..." : "Enviar reporte"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;