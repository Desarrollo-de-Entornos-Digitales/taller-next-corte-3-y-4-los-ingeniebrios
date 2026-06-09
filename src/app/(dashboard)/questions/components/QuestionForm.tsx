"use client";

import { useState } from 'react';
import { PostCategoryResponse } from '../../../../common/services/post.service';
import { FacultyResponse } from '../../../../common/services/faculty.service';
import { createPostAction } from '../create-post.action';

// Official list of question categories (SQL fallback)
const OFFICIAL_CATEGORIES = [
  { id: 1, name: "Negocios y Economía" },
  { id: 2, name: "Ingeniería, Tecnología y Diseño" },
  { id: 3, name: "Ciencias de la Salud y Biológicas" },
  { id: 4, name: "Leyes, Sociedad y Comportamiento" },
  { id: 5, name: "Educación y Núcleo Común" }
];

// Official list of Faculties (SQL fallback)
const OFFICIAL_FACULTIES = [
  { id: 1, name: "Facultad de Ciencias Administrativas y Económicas" },
  { id: 2, name: "Facultad Barberi de Ingeniería, Diseño y Ciencias Aplicadas" },
  { id: 3, name: "Facultad de Derecho y Ciencias Sociales" },
  { id: 4, name: "Facultad de Ciencias de la Salud" },
  { id: 5, name: "Facultad de Ciencias de la Educación" }
];

// Props interface for QuestionForm component
interface QuestionFormProps {
  categories: PostCategoryResponse[];
  faculties: FacultyResponse[];
}

// Question Form component - allows users to create new questions
export default function QuestionForm({ categories, faculties }: QuestionFormProps) {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [facultyId, setFacultyId] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  // Verificamos si vienen vacías o incompletas desde el servidor para usar las oficiales
  const listCategories = categories && categories.length > 0 ? categories : OFFICIAL_CATEGORIES;
  const listFaculties = faculties && faculties.length > 0 ? faculties : OFFICIAL_FACULTIES;
  const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "IcesiConnect");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/duvapylkz/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    return data.secure_url;
  };

  const handleSubmit = async () => {
    if (!title.trim() || !categoryId || !facultyId || !description.trim()) {
      setError("Por favor completa todos los campos, incluyendo el título.");
      return;
    }

    const token = document.cookie.split("; ").find(r => r.startsWith("token="))?.split("=")[1]
      ?? localStorage.getItem("token");

    if (!token) {
      setError("No se pudo identificar tu usuario. Vuelve a iniciar sesión.");
      return;
    }

    let userId: number;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userId = Number(payload.sub || payload.id || payload.userId);
    } catch (e) {
      setError("Sesión inválida. Vuelve a iniciar sesión.");
      return;
    }

    if (!userId) {
      setError("No se pudo identificar tu usuario. Vuelve a iniciar sesión.");
      return;
    }

    setLoading(true);
    setError(null);

    let imageUrl = "";

    if (image) {
      imageUrl = await uploadImageToCloudinary(image);
    }

    // 📡 Enviamos los datos mapeados respetando el CreatePostsDto de NestJS
    const result = await createPostAction({
      title: title.trim(),
      description: description.trim(),
      image: imageUrl,
      categoryId: Number(categoryId),
      facultyId: Number(facultyId),
      userId,
    });

    setLoading(false);

    if (result.error) {
      setError(result.message ?? "Error al publicar la pregunta.");
    } else {
      setSuccess(true);
      setTitle("");
      setDescription("");
      setCategoryId("");
      setFacultyId("");
      
      // Redirección al feed de la comunidad
      setTimeout(() => {
        setSuccess(false);
        window.location.href = "/feed";
      }, 1500);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold text-[#5856D6] mb-5">Haz una pregunta</h2>

      <div className="flex gap-6">
        {/* 📐 Columna Izquierda: Selectores e Ilustración de Archivo */}
        <div className="flex flex-col gap-4 w-64 shrink-0">
          
          {/* Dropdown de Categorías de Preguntas */}
          <div className="relative">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full border border-[#5856D6] rounded-xl px-4 py-2.5 text-sm text-gray-600 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#5856D6] cursor-pointer"
            >
              <option value="">Selecciona una categoría</option>
              {listCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <span className="absolute right-4 top-3.5 pointer-events-none text-xs text-gray-400">▼</span>
          </div>

          {/* Dropdown de Facultades de la Universidad */}
          <div className="relative">
            <select
              value={facultyId}
              onChange={(e) => setFacultyId(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full border border-[#5856D6] rounded-xl px-4 py-2.5 text-sm text-gray-600 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#5856D6] cursor-pointer"
            >
              <option value="">Selecciona una Facultad</option>
              {listFaculties.map((fac) => (
                <option key={fac.id} value={fac.id}>{fac.name}</option>
              ))}
            </select>
            <span className="absolute right-4 top-3.5 pointer-events-none text-xs text-gray-400">▼</span>
          </div>

          <div>
            <p className="text-sm font-bold text-[#5856D6] mb-2">Subir imagen</p>
            <label className="flex items-center justify-center gap-2 border border-[#5856D6] rounded-xl px-4 py-2.5 cursor-pointer hover:bg-[#EBEBFF] transition-colors bg-white">
              <span className="text-lg">📄</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    setImage(file);
                  }
                }}
              />
            </label>
            {image && (
              <p className="text-xs text-gray-500 mt-2">
                {image.name}
              </p>
            )}
          </div>
        </div>

        {/* 📐 Columna Derecha: Campos de Texto */}
        <div className="flex flex-col gap-4 flex-1">
          {/* Entrada del Título */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Escribe el título de tu pregunta"
            className="border border-[#5856D6] rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5856D6] w-full font-semibold"
          />

          {/* Cuerpo de la descripción */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Escribe tu pregunta"
            rows={6}
            className="border border-[#5856D6] rounded-xl px-4 py-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-[#5856D6] w-full"
          />

          {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
          {success && <p className="text-green-600 text-xs font-semibold">🎉 ¡Pregunta publicada! Redirigiendo al feed...</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#5856D6] text-white rounded-xl py-2.5 text-sm font-bold hover:bg-[#4644c4] transition-colors disabled:opacity-60 w-full mt-2"
          >
            {loading ? "Publicando..." : "Publicar"}
          </button>
        </div>
      </div>
    </div>
  );
}