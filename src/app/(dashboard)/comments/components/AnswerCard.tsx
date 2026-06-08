"use client";

import { useState } from "react";
import { AnswerResponse } from "../services/answer.service";

type Props = {
  answer: AnswerResponse;
};

const getToken = () =>
  document.cookie.split("; ").find(r => r.startsWith("token="))?.split("=")[1]
  ?? localStorage.getItem("token");

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

export default function AnswerCard({ answer }: Props) {
  const level = answer.user.student?.level ?? 1;
  const [thanked, setThanked] = useState(false);
  const [sending, setSending] = useState(false);

  const rawDate = answer.createdAt || (answer as any).created_at;
  let timeAgo = "";
  if (rawDate) {
    try {
      timeAgo = new Date(rawDate).toLocaleString('es-CO', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
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

      // Obtener nombre del usuario que da gracias
      const meRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const me = await meRes.json();

      // Obtener el student del usuario que recibe el gracias
      const studentRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/students/user/${answer.user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const student = await studentRes.json();

      // Incrementar el contador de thanks
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/${student.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ thanks: (student.thanks ?? 0) + 1 }),
      });

      // Crear la notificación
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

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <img
          src={answer.user.avatar && answer.user.avatar.startsWith("data:")
            ? answer.user.avatar
            : `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(answer.user.name)}`}
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

      <div className="flex justify-end">
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
  );
}