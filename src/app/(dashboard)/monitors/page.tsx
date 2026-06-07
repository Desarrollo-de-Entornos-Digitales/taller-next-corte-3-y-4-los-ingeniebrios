"use client";

import { useState, useEffect } from "react";
import MonitorCard from "./components/MonitorCard";
import { monitorService, MonitorResponse } from "./services/monitors.service";

export default function MonitoresPage() {
  const [monitors, setMonitors] = useState<MonitorResponse[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadMonitors = async () => {
      setLoading(true);
      setErrorMessage(null);
      const result = await monitorService.getMonitors();
      if (result.error) {
        setErrorMessage(result.message || "No se pudieron cargar los monitores.");
      }
      setMonitors(result.data);
      setLoading(false);
    };
    loadMonitors();
  }, []);

  const handleDeleted = (id: number) => {
    setMonitors(prev => prev.filter(m => m.id !== id));
  };

  const filtered = monitors.filter((m) => {
    const query = search.toLowerCase().trim();
    if (!query) return true;
    return (
      m.subject?.toLowerCase().includes(query) ||
      m.availability?.toLowerCase().includes(query) ||
      m.student?.user?.name?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por materia, horario o nombre..."
              className="w-full border border-gray-200 rounded-full py-2.5 pl-5 pr-12 text-sm text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            />
            <img src="/lupa.png" alt="buscar" className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60" />
          </div>
        </div>

        {loading && (
          <div className="text-center text-gray-400 mt-20 text-base animate-pulse">
            Cargando el cuerpo de monitores de Icesi...
          </div>
        )}

        {!loading && errorMessage && (
          <div className="text-center text-red-500 mt-10 text-sm font-medium bg-red-50 border border-red-100 rounded-xl p-4 max-w-md mx-auto">
            ⚠️ {errorMessage}
          </div>
        )}

        {!loading && !errorMessage && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((monitor) => (
              <MonitorCard key={monitor.id} monitor={monitor} onDeleted={handleDeleted} />
            ))}
          </div>
        )}

        {!loading && !errorMessage && filtered.length === 0 && (
          <div className="text-center text-gray-400 mt-20 text-base">
            No se encontraron monitores para &ldquo;{search}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
}