"use client";

import { useState, useEffect } from "react";

// Interface for student data
interface Student {
  id: number;
  user: { id: number; name: string; };
  career?: { name: string };
}

// Get token from cookies or localStorage
const getToken = () =>
  document.cookie.split("; ").find(r => r.startsWith("token="))?.split("=")[1]
  ?? localStorage.getItem("token");

// Monitors Tab component - create and manage monitor accounts
export default function MonitorsTab() {
  const [students, setStudents] = useState<Student[]>([]);
  const [subject, setSubject] = useState("");
  const [availability, setAvailability] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Fetch students list on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    };
    fetchStudents();
  }, []);

  // Handle creating a new monitor
  const handleCreate = async () => {
    if (!subject.trim() || !availability.trim() || !selectedStudentId) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/monitors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        subject,
        availability,
        student_id: Number(selectedStudentId), // ← corregido
      }),
    });

    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      setSubject("");
      setAvailability("");
      setSelectedStudentId("");
      setTimeout(() => setSuccess(false), 3000);
    } else {
      const errData = await res.json().catch(() => null);
      setError(errData?.message ?? "No se pudo crear el monitor.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Crear Monitor</h2>
        <p className="text-sm text-gray-400">Asigna un estudiante como monitor de una materia</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700">Estudiante</label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full px-4 py-3 bg-[#F5F5F7] border-2 border-transparent rounded-xl text-sm text-gray-800 focus:outline-none focus:border-[#5856D6] transition"
          >
            <option value="">Selecciona un estudiante</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.user?.name ?? `Estudiante ${s.id}`} {s.career?.name ? `— ${s.career.name}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700">Materia</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Ej: Cálculo Diferencial"
            className="w-full px-4 py-3 bg-[#F5F5F7] border-2 border-transparent rounded-xl text-sm text-gray-800 focus:outline-none focus:border-[#5856D6] transition"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700">Disponibilidad</label>
          <input
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            placeholder="Ej: Lunes y Miércoles 2pm - 4pm"
            className="w-full px-4 py-3 bg-[#F5F5F7] border-2 border-transparent rounded-xl text-sm text-gray-800 focus:outline-none focus:border-[#5856D6] transition"
          />
        </div>

        {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}
        {success && <p className="text-green-600 text-xs font-semibold">✅ Monitor creado exitosamente.</p>}

        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-[#5856D6] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#4644c4] transition disabled:opacity-60"
        >
          {loading ? "Creando..." : "Crear Monitor"}
        </button>
      </div>
    </div>
  );
}