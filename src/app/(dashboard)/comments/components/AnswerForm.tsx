"use client";

import { useRef, useState } from "react";
import { createAnswerAction } from "../actions/create-answer.action";

type Props = {
  postId: number;
  onAnswerSent: () => void;
};

export default function AnswerForm({ postId, onAnswerSent }: Props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError("Escribe una respuesta antes de enviar.");
      return;
    }
    setLoading(true);
    setError(null);

    // ✅ Server Action — corre en el servidor, lee la cookie httpOnly sin problema
    const result = await createAnswerAction({ content, postId });

    setLoading(false);

    if (result.error) {
      setError(result.message);
      return;
    }

    setContent("");
    onAnswerSent();
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
      <h2 className="font-bold text-[#5856D6] text-base">Tu respuesta</h2>

      <textarea
        className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 resize-none outline-none focus:ring-2 focus:ring-[#5856D6]/30 transition"
        placeholder="Escribe tu respuesta..."
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-300">Agregar imagen (próximamente)</span>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-[#5856D6] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#4745c0] transition-colors disabled:opacity-60"
        >
          {loading ? "Enviando..." : "Enviar respuesta"}
        </button>
      </div>
    </div>
  );
}
