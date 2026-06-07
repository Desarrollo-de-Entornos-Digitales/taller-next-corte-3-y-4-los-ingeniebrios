"use client";

import { useState } from "react";
import MonitorCard from "./MonitorCard";
import { MonitorResponse } from "../services/monitors.service";

type Props = {
  initialMonitors: MonitorResponse[];
};

export default function MonitoresClient({ initialMonitors }: Props) {
  const [search, setSearch] = useState("");

  const filtered = initialMonitors.filter((m) => {
    const query = search.toLowerCase().trim();
    if (!query) return true;
    return (
      m.subject?.toLowerCase().includes(query) ||
      m.availability?.toLowerCase().includes(query) ||
      m.student?.user?.name?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Search */}
      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por materia, horario o nombre..."
            className="w-full border border-gray-200 rounded-full py-2.5 pl-5 pr-12 text-sm text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          />
          <img
            src="/lupa.png"
            alt="buscar"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60"
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((monitor) => (
            <MonitorCard key={monitor.id} monitor={monitor} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 mt-20 text-base">
          No se encontraron monitores para &ldquo;{search}&rdquo;
        </div>
      )}
    </div>
  );
}
