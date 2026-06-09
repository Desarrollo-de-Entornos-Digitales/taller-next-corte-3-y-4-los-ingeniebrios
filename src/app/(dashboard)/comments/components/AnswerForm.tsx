"use client";

import { useRef, useState } from "react";
import { createAnswerAction } from "../actions/create-answer.action";

type Props = {
  postId: number;
  onAnswerSent: () => void;
};

// Answer Form component - form for submitting new answers
export default function AnswerForm({ postId, onAnswerSent }: Props) {
  const [content, setContent] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Handle image file selection and conversion to base64
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImageBase64(base64);
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission for creating answer
  const handleSubmit = async () => {
    if (!content.trim()) {
      setError("Escribe una respuesta antes de enviar.");
      return;
    }
    setLoading(true);
    setError(null);

    const result = await createAnswerAction({ 
      content, 
      postId, 
      image: imageBase64 ?? null,
    });

    setLoading(false);

    if (result.error) {
      setError(result.message);
      return;
    }

    setContent("");
    setImageBase64(null);
    setImagePreview(null);
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

      {imagePreview && (
        <div className="relative w-fit">
          <img
            src={imagePreview}
            alt="preview"
            className="max-h-32 rounded-xl border border-gray-200 object-contain"
          />
          <button
            onClick={() => { setImageBase64(null); setImagePreview(null); }}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      )}

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <div className="flex items-center justify-between">
        
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 text-gray-400 text-sm hover:text-[#5856D6] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Agregar imagen
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />

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
