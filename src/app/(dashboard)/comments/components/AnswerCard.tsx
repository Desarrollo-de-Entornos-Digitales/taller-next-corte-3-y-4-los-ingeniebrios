"use client";

import { useState } from "react";
import { AnswerResponse } from "../services/answer.service";

type Props = {
  answer: AnswerResponse;
};

// Report reasons for content moderation
const REPORT_REASONS = [
  "Contenido inapropiado",
  "Spam o publicidad",
  "Información falsa",
  "Acoso o bullying",
  "Otro",
];

// Get token from storage
const getToken = () =>
  document.cookie.split("; ").find(r => r.startsWith("token="))?.split("=")[1]
  ?? localStorage.getItem("token");

// Get current user ID from token
const getCurrentUserId = (): number | null => {
  try {
    const token = getToken();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub || payload.id || null;
  } catch {
    return null;
  }
};

// Answer Card component - displays individual answer/response
// Handles thanks, reporting, and other interactions
export default function AnswerCard({ answer }: Props) {
  const level = answer.user.student?.level ?? 1;
  const [thanked, setThanked] = useState(false);
  const [sending, setSending] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [reported, setReported] = useState(false);
  const [reporting, setReporting] = useState(false);

  const rawDate = answer.createdAt || (answer as any).created_at;
  let timeAgo = "";
  if (rawDate) {
    try {
      timeAgo = new Date(rawDate).toLocaleString("es-CO", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      console.error("Error formateando la fecha de la respuesta:", e);
    }
  }

  const handleThanks = async () => {
    if (thanked || sending) return;
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return;
    if (currentUserId === answer.user.id) return;

    setSending(true);
    try {
      const token = getToken();

      const meRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const me = await meRes.json();

      const studentRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/students/user/${answer.user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const student = await studentRes.json();

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/${student.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ thanks: (student.thanks ?? 0) + 1 }),
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: `${me.name} le dio Gracias a tu respuesta`,
          senderId: currentUserId,
          receiverId: answer.user.id,
        }),
      });

      if (res.ok) {
        setThanked(true);
      } else {
        alert("No se pudo enviar el gracias. Intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error enviando gracias:", error);
    } finally {
      setSending(false);
    }
  };

  const handleReport = async () => {
    if (!selectedReason || reporting) return;

    const currentUserId = getCurrentUserId();
    if (!currentUserId) {
      alert("Debes iniciar sesión para reportar.");
      return;
    }

    setReporting(true);
    try {
      const token = getToken();

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reporterId: currentUserId,
          reportedId: answer.user.id,
          reason: selectedReason,
          status: "pending",
        }),
      });

      if (res.ok) {
        setReported(true);
        setShowReportModal(false);
      } else {
        alert("No se pudo enviar el reporte. Intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error enviando reporte:", error);
      alert("Error de conexión con el servidor");
    } finally {
      setReporting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center gap-3">
          <img
            src={
              answer.user.avatar && answer.user.avatar.startsWith("data:")
                ? answer.user.avatar
                : `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(answer.user.name)}`
            }
            alt={answer.user.name}
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
          <div className="flex flex-col flex-1">
            <span className="font-bold text-gray-800 text-sm leading-tight">
              {answer.user.name} – Nivel {level}
            </span>
            {timeAgo && <span className="text-xs text-gray-400">{timeAgo}</span>}
          </div>
        </div>

        {/* Content */}
        <p className="text-gray-700 text-sm leading-relaxed">
          {answer.content ?? answer.description}
        </p>

        {answer.image && (
          <img
            src={answer.image}
            alt="Imagen de la respuesta"
            className="rounded-xl max-h-48 object-contain border border-gray-100"
          />
        )}

        {/* Actions */}
        <div className="flex justify-end items-center gap-3">
          <button
            onClick={() => !reported && setShowReportModal(true)}
            disabled={reported}
            className={`flex items-center gap-1.5 text-sm font-semibold transition-opacity ${
              reported
                ? "text-gray-400 cursor-not-allowed"
                : "text-red-400 hover:opacity-70"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 21V5a1 1 0 011-1h10.586a1 1 0 01.707.293l.414.414A1 1 0 0016.414 5H20a1 1 0 011 1v9a1 1 0 01-1 1h-3.586a1 1 0 00-.707.293l-.414.414A1 1 0 0115 17H4a1 1 0 01-1-1v3"
              />
            </svg>
            {reported ? "Reportado" : "Reportar"}
          </button>

          <span className="text-gray-200 text-lg select-none">|</span>

          <button
            onClick={handleThanks}
            disabled={thanked || sending}
            className={`flex items-center gap-1.5 text-sm font-semibold transition-opacity ${
              thanked
                ? "text-green-500 cursor-not-allowed"
                : "text-[#5856D6] hover:opacity-70"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
              />
            </svg>
            {sending ? "Enviando..." : thanked ? "¡Gracias enviado!" : "Gracias"}
          </button>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowReportModal(false); }}
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-800 text-base">Reportar respuesta</h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-gray-500">
              ¿Por qué quieres reportar la respuesta de{" "}
              <span className="font-semibold text-gray-700">{answer.user.name}</span>?
            </p>

            <div className="flex flex-col gap-2">
              {REPORT_REASONS.map((reason) => (
                <button
                  key={reason}
                  onClick={() => setSelectedReason(reason)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    selectedReason === reason
                      ? "bg-[#5856D6] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => { setShowReportModal(false); setSelectedReason(""); }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleReport}
                disabled={!selectedReason || reporting}
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
}