"use client";

import { useState, useEffect } from "react";
import { profileSetupService } from "../services/profile-setup.service";

interface SetupModalProps {
  userId: number;
  studentId: number;
  onComplete: (data: { career: string; semester: number }) => void;
}

interface Career {
  id: number;
  name: string;
}

export default function SetupModal({ userId, studentId, onComplete }: SetupModalProps) {
  const [careers, setCareers] = useState<Career[]>([]);
  const [selectedCareerId, setSelectedCareerId] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCareers();
  }, []);

  const loadCareers = async () => {
    const result = await profileSetupService.getCareers();
    if (result.error) {
      setError("No se pudieron cargar las carreras");
    } else {
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

    // Guardar en el backend
    const result = await profileSetupService.saveUserCareerAndSemester(studentId, {
      careerId: selectedCareerId,
      semester: selectedSemester,
    });

    if (result.error) {
      setError("Error al guardar. Intenta de nuevo.");
      setSaving(false);
    } else {
      // También guardar en localStorage para uso inmediato
      const selectedCareer = careers.find(c => c.id === selectedCareerId);
      localStorage.setItem("userSetup", JSON.stringify({
        career: selectedCareer?.name,
        semester: selectedSemester,
        hasSetup: true
      }));
      
      onComplete({ 
        career: selectedCareer?.name || "", 
        semester: selectedSemester 
      });
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 w-[500px] text-center">
          <p className="text-[#5856D6]">Cargando carreras...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-[500px] max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#EEF2C9] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎓</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">¡Bienvenido!</h2>
          <p className="text-gray-500 text-sm mt-1">
            Cuéntanos tu carrera y semestre para personalizar tu experiencia
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Carrera
            </label>
            <select
              value={selectedCareerId || ""}
              onChange={(e) => setSelectedCareerId(Number(e.target.value))}
              className="w-full px-4 py-3 bg-[#F5F5F7] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5856D6] text-gray-800 font-medium"
            >
              <option value="">Selecciona tu carrera</option>
              {careers.map((career) => (
                <option key={career.id} value={career.id}>
                  {career.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Semestre
            </label>
            <select
              value={selectedSemester || ""}
              onChange={(e) => setSelectedSemester(Number(e.target.value))}
              className="w-full px-4 py-3 bg-[#F5F5F7] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5856D6] text-gray-800 font-medium"
            >
              <option value="">Selecciona tu semestre</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sem) => (
                <option key={sem} value={sem}>
                  {sem}° Semestre
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full bg-[#5856D6] text-white py-3 rounded-xl font-semibold hover:bg-[#4644B0] transition disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Comenzar"}
          </button>
        </div>
      </div>
    </div>
  );
}