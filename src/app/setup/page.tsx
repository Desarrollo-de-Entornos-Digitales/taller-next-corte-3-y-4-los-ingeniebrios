"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Career {
  id: number;
  name: string;
}

const ACADEMIC_CAREERS: Career[] = [
  { id: 1, name: "Ingeniería de Sistemas" },
  { id: 2, name: "Ingeniería Telemática" },
  { id: 3, name: "Ingeniería Industrial" },
  { id: 4, name: "Ingeniería en Energía Inteligente" },
  { id: 5, name: "Ingeniería Bioquímica" },
  { id: 6, name: "Diseño Industrial" },
  { id: 7, name: "Diseño de Medios Interactivos" },
  { id: 8, name: "Medicina Veterinaria y Zootecnia" },
  { id: 9, name: "Derecho" },
  { id: 10, name: "Psicología" },
  { id: 11, name: "Ciencia Política con énfasis en Relaciones Internacionales" },
  { id: 12, name: "Antropología" },
  { id: 13, name: "Sociología" },
  { id: 14, name: "Comunicación" },
  { id: 15, name: "Música" },
  { id: 16, name: "Biología" },
  { id: 17, name: "Química" },
  { id: 18, name: "Química Farmacéutica" },
  { id: 19, name: "Bacteriología y Laboratorio Clínico" },
  { id: 20, name: "Medicina" },
  { id: 21, name: "Licenciatura en Lenguas Extranjeras con Énfasis en Inglés" },
  { id: 22, name: "Administración de Empresas" },
  { id: 23, name: "Contaduría Pública y Finanzas Internacionales" },
  { id: 24, name: "Economía y Negocios Internacionales" },
  { id: 25, name: "Mercadeo Internacional y Publicidad" },
  { id: 26, name: "Negocios, Estrategia y Tecnología (NET)" }
];

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function clientRequest<T>(path: string, options?: RequestInit): Promise<{ error: boolean; data?: any; message?: string }> {
  try {
    const token = document.cookie.split("; ").find(r => r.startsWith("token="))?.split("=")[1]
      ?? localStorage.getItem("token");
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options?.headers ?? {}),
      },
    });
    if (!res.ok) return { error: true, message: `Error ${res.status}` };
    const data = await res.json();
    return { error: false, data };
  } catch {
    return { error: true, message: "Error de conexión" };
  }
}

export default function SetupPage() {
  const router = useRouter();
  const [careers, setCareers] = useState<Career[]>(ACADEMIC_CAREERS);
  const [selectedCareerId, setSelectedCareerId] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Si ya hizo setup, va directo al feed
    const saved = localStorage.getItem("userSetup");
    if (saved && JSON.parse(saved).hasSetup) {
      router.replace("/feed");
      return;
    }

    // Si es admin, saltar setup y ir directo al feed
    const token = document.cookie.split("; ").find(r => r.startsWith("token="))?.split("=")[1]
      ?? localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const permissions: string[] = payload.permissions ?? [];
        if (permissions.includes("manage_users")) {
          localStorage.setItem("userSetup", JSON.stringify({ hasSetup: true }));
          router.replace("/feed");
          return;
        }
      } catch {
        // token inválido, continuar con el setup normal
      }
    }

    loadCareers();
  }, []);

  const loadCareers = async () => {
    const result = await clientRequest<Career[]>("/career");
    if (!result.error && result.data && result.data.length > 0) {
      setCareers(result.data);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!selectedCareerId || !selectedSemester) {
      setError("Por favor selecciona carrera y semestre");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const token = document.cookie.split("; ").find(r => r.startsWith("token="))?.split("=")[1]
        ?? localStorage.getItem("token");

      if (!token) {
        setError("Sesión expirada. Vuelve a iniciar sesión.");
        setSaving(false);
        return;
      }

      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.sub || payload.id || payload.userId;

      const studentResult = await clientRequest(`/students/user/${userId}`);

      if (studentResult.error || !studentResult.data) {
        setError("Tu cuenta de usuario no tiene un perfil de estudiante asignado.");
        setSaving(false);
        return;
      }

      const studentId = studentResult.data.id;

      if (!studentId) {
        setError("Error de consistencia en el perfil del estudiante.");
        setSaving(false);
        return;
      }

      const rawResponse = await fetch(`${API_URL}/students/${studentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_career: Number(selectedCareerId),
          semester: Number(selectedSemester),
        }),
      });

      if (!rawResponse.ok) {
        const errorText = await rawResponse.text();
        console.error(`[Setup] Error ${rawResponse.status}:`, errorText);
        setError("Error al guardar en el servidor. Intenta de nuevo.");
        setSaving(false);
        return;
      }

      await rawResponse.json();

      const selectedCareer = careers.find(c => c.id === selectedCareerId);
      localStorage.setItem("userSetup", JSON.stringify({
        career: selectedCareer?.name,
        careerId: selectedCareerId,
        semester: selectedSemester,
        hasSetup: true,
      }));

      router.replace("/feed");
    } catch (e) {
      console.error("[Setup] Excepción:", e);
      setError("Error inesperado en el proceso.");
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: "#5454E9" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-80px] left-[-80px] w-[350px] h-[350px] rounded-full bg-white/5" />
        <div className="absolute bottom-[-60px] right-[-60px] w-[300px] h-[300px] rounded-full bg-white/5" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-[480px] px-4">
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 bg-[#EEF2C9] rounded-full flex items-center justify-center shadow-lg">
            <Image src="/Andy.png" alt="Andy" width={64} height={64} className="object-contain" />
          </div>
          <h1 className="text-white text-3xl font-extrabold tracking-tight">¡Bienvenido!</h1>
          <p className="text-white/70 text-sm text-center">Cuéntanos sobre ti para personalizar tu experiencia en Icesi Connect</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl w-full p-8 flex flex-col gap-6">
          {loading ? (
            <p className="text-center text-[#5454E9] animate-pulse font-medium">Cargando carreras...</p>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">Tu carrera</label>
                <div className="relative">
                  <select
                    value={selectedCareerId ?? ""}
                    onChange={(e) => setSelectedCareerId(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-[#F5F5F7] border-2 border-transparent rounded-xl text-sm text-gray-800 font-medium appearance-none focus:outline-none focus:border-[#5454E9] transition-colors"
                  >
                    <option value="">Selecciona tu carrera</option>
                    {careers.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▾</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">Tu semestre</label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sem) => (
                    <button
                      key={sem}
                      type="button"
                      onClick={() => setSelectedSemester(sem)}
                      className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                        selectedSemester === sem
                          ? "bg-[#5454E9] text-white shadow-md scale-105"
                          : "bg-[#F5F5F7] text-gray-600 hover:bg-[#EBEBFF] hover:text-[#5454E9]"
                      }`}
                    >
                      {sem}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-red-500 text-xs text-center font-semibold">{error}</p>}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving || !selectedCareerId || !selectedSemester}
                className="w-full bg-[#5454E9] text-white py-3.5 rounded-xl font-bold text-base hover:bg-[#4444d0] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {saving ? "Guardando..." : "Comenzar →"}
              </button>
            </>
          )}
        </div>
        <p className="text-white/40 text-xs">Solo te preguntamos esto una vez 🎓</p>
      </div>
    </main>
  );
}