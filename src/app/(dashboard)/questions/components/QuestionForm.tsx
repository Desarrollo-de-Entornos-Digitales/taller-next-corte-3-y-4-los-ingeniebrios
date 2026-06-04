"use client";

import { useState } from 'react';
import { PostCategoryResponse } from '../../../../common/services/post.service';
import { FacultyResponse } from '../../../../common/services/faculty.service';
import { createPostAction } from '../create-post.action';

interface QuestionFormProps {
  categories: PostCategoryResponse[];
  faculties: FacultyResponse[];
}

export default function QuestionForm({ categories, faculties }: QuestionFormProps) {
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [facultyId, setFacultyId] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!categoryId || !facultyId || !description.trim()) {
      setError("Por favor completa todos los campos.");
      return;
    }

    const token = document.cookie.split("; ").find(r => r.startsWith("token="))?.split("=")[1]
      ?? localStorage.getItem("token");

    if (!token) {
      setError("No se pudo identificar tu usuario. Vuelve a iniciar sesión.");
      return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = Number(payload.sub || payload.id || payload.userId);

    if (!userId) {
      setError("No se pudo identificar tu usuario. Vuelve a iniciar sesión.");
      return;
    }

    setLoading(true);
    setError(null);

    const result = await createPostAction({
      title: description.slice(0, 80),
      description,
      categoryId: Number(categoryId),
      facultyId: Number(facultyId),
      userId,
    });

    setLoading(false);

    if (result.error) {
      setError(result.message ?? "Error al publicar.");
    } else {
      setSuccess(true);
      setDescription("");
      setCategoryId("");
      setFacultyId("");
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold text-[#5856D6] mb-5">Haz una pregunta</h2>

      <div className="flex gap-6">
        {/* Columna izquierda */}
        <div className="flex flex-col gap-3 w-64">
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value === "" ? "" : Number(e.target.value))}
            className="border border-[#5856D6] rounded-xl px-4 py-2.5 text-sm text-gray-600 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#5856D6]"
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <select
            value={facultyId}
            onChange={(e) => setFacultyId(e.target.value === "" ? "" : Number(e.target.value))}
            className="border border-[#5856D6] rounded-xl px-4 py-2.5 text-sm text-gray-600 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#5856D6]"
          >
            <option value="">Selecciona una Facultad</option>
            {faculties.map((fac) => (
              <option key={fac.id} value={fac.id}>{fac.name}</option>
            ))}
          </select>

          <div>
            <p className="text-sm font-bold text-[#5856D6] mb-2">Subir archivo</p>
            <label className="flex items-center justify-center gap-2 border border-[#5856D6] rounded-xl px-4 py-2.5 cursor-pointer hover:bg-[#EBEBFF] transition-colors">
              <span className="text-lg">📄</span>
              <input type="file" className="hidden" />
            </label>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="flex flex-col gap-3 flex-1">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Escribe tu pregunta"
            rows={5}
            className="border border-[#5856D6] rounded-xl px-4 py-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-[#5856D6] w-full"
          />

          {error && <p className="text-red-500 text-xs">{error}</p>}
          {success && <p className="text-green-600 text-xs">¡Pregunta publicada con éxito!</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#5856D6] text-white rounded-xl py-2.5 text-sm font-bold hover:bg-[#4644c4] transition-colors disabled:opacity-60"
          >
            {loading ? "Publicando..." : "Publicar"}
          </button>
        </div>
      </div>
    </div>
  );
}