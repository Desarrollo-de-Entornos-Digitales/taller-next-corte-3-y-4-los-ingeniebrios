"use client";

import { useState } from "react";

interface Report {
  id: number;
  reason: string;
  status: string;
  reporter: { id: number; name: string; };
  reported: { id: number; name: string; };
}

const getToken = () =>
  document.cookie.split("; ").find(r => r.startsWith("token="))?.split("=")[1]
  ?? localStorage.getItem("token");

export default function ReportsTab() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports`, {
      headers: { Authorization: `Bearer ${getToken()}` },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      setReports(data);
      setFetched(true);
    }
    setLoading(false);
  };

  const resolveReport = async (id: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ status: "resolved" }),
    });
    if (res.ok) {
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: "resolved" } : r));
    }
  };

  const deleteReport = async (id: number) => {
    if (!confirm("¿Eliminar este reporte?")) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (res.ok) {
      setReports(prev => prev.filter(r => r.id !== id));
    }
  };

  const pending = reports.filter(r => r.status === "pending");
  const resolved = reports.filter(r => r.status === "resolved");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Reportes de publicaciones</h2>
          <p className="text-sm text-gray-400">Pulsa el botón para verificar si hay nuevos reportes</p>
        </div>
        <button
          onClick={fetchReports}
          disabled={loading}
          className="bg-[#5856D6] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#4644c4] transition disabled:opacity-60"
        >
          {loading ? "Verificando..." : "🔍 Verificar reportes"}
        </button>
      </div>

      {fetched && (
        <>
          {reports.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-400 text-sm border border-gray-100">
              No hay reportes en la base de datos.
            </div>
          ) : (
            <>
              {pending.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-red-500 mb-3">⚠️ Pendientes ({pending.length})</h3>
                  <div className="flex flex-col gap-3">
                    {pending.map((report) => (
                      <div key={report.id} className="bg-white rounded-2xl p-5 border border-red-100 shadow-sm flex justify-between items-start gap-4">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-semibold text-gray-800">
                            <span className="text-red-500">Reportado:</span> {report.reported.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            <span className="font-medium">Por:</span> {report.reporter.name}
                          </p>
                          <p className="text-xs text-gray-600 mt-1 bg-gray-50 px-3 py-2 rounded-lg">
                            "{report.reason}"
                          </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => resolveReport(report.id)}
                            className="bg-green-50 text-green-600 text-xs font-bold px-3 py-2 rounded-xl hover:bg-green-100 transition"
                          >
                            ✓ Resolver
                          </button>
                          <button
                            onClick={() => deleteReport(report.id)}
                            className="bg-red-50 text-red-500 text-xs font-bold px-3 py-2 rounded-xl hover:bg-red-100 transition"
                          >
                            🗑 Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resolved.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-green-600 mb-3">✅ Resueltos ({resolved.length})</h3>
                  <div className="flex flex-col gap-3">
                    {resolved.map((report) => (
                      <div key={report.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex justify-between items-center gap-4 opacity-60">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {report.reported.name}
                          </p>
                          <p className="text-xs text-gray-400">"{report.reason}"</p>
                        </div>
                        <button
                          onClick={() => deleteReport(report.id)}
                          className="bg-gray-50 text-gray-400 text-xs font-bold px-3 py-2 rounded-xl hover:bg-gray-100 transition"
                        >
                          🗑
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}