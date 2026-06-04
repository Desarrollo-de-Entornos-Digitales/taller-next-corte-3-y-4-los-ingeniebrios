"use client";

import { useState, useEffect } from "react";
import MonitorCard from "../../../common/components/MonitorCard";

interface Monitor {
  id: number;
  subject: string;
  availability: string;
  student: {
    id: number;
    user: {
      name: string;
      avatar: string;
    };
  };
}

export default function MonitoresPage() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonitores = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/monitors`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const data = await response.json();

        // 🧠 VALIDACIÓN CLAVE: NestJS suele envolver la respuesta en un objeto { data: [...] }
        // Validamos todas las estructuras posibles para asegurar que siempre guardemos un Arreglo ([]).
        if (Array.isArray(data)) {
          setMonitors(data);
        } else if (data && Array.isArray(data.data)) {
          setMonitors(data.data);
        } else {
          console.error("El backend no devolvió un formato de array válido:", data);
          setMonitors([]);
        }
      } catch (error) {
        console.error("Error fetching monitors:", error);
        setMonitors([]); // Evita dejar el estado corrupto si falla la red
      } finally {
        setLoading(false);
      }
    };
    fetchMonitores();
  }, []);

  // 🛡️ BLINDAJE EXTRA: Nos aseguramos de que 'monitors' sea un array antes de usar .filter()
  const filtered = Array.isArray(monitors)
    ? monitors.filter((m) => {
        const q = search.toLowerCase().trim();
        if (!q) return true;
        
        // Usamos encadenamiento opcional (?.) por seguridad en campos anidados
        return (
          m.subject?.toLowerCase().includes(q) ||
          m.availability?.toLowerCase().includes(q) ||
          m.student?.user?.name?.toLowerCase().includes(q)
        );
      })
    : [];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Banner */}
      <div className="relative h-44 flex items-center px-14 overflow-hidden">
        <img
          src="/hero-monitores.png"
          alt="Hero Monitores"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "0% 30%" }}
        />
        <h1 className="relative z-10 text-white text-5xl font-extrabold tracking-tight">
          Monitores
        </h1>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-10 py-8">

        {/* Search bar */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar"
              className="w-full border border-gray-300 rounded-full py-2.5 pl-5 pr-12 text-sm text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <img
              src="/lupa.png"
              alt="buscar"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center text-gray-400 mt-20 text-base">
            Cargando monitores...
          </div>
        )}

        {/* Monitor grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-4 gap-6">
            {filtered.map((monitor) => (
              <MonitorCard key={monitor.id} monitor={monitor} />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center text-gray-400 mt-20 text-base">
            No se encontraron monitores para &ldquo;{search}&rdquo;
          </div>
        )}

      </div>
    </div>
  );
}