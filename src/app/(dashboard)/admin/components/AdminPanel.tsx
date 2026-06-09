"use client";

import { useState } from "react";
import ReportsTab from "./ReportsTab";
import UsersTab from "./UsersTab";
import MonitorsTab from "./MonitorsTab";

type Tab = "reports" | "users" | "monitors";

// Admin Panel component - main admin dashboard with tabs
export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("reports");

  // Tabs definition for admin panel
  const tabs = [
    { id: "reports" as Tab, label: "Reportes", },
    { id: "users" as Tab, label: "Usuarios", },
    { id: "monitors" as Tab, label: "Monitores", },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* Header */}
      <div className="bg-[#5856D6] text-white px-10 py-8">
        <h1 className="text-3xl font-black tracking-tight">Panel de Administración</h1>
        <p className="text-white/70 text-sm mt-1">Gestiona reportes, usuarios y monitores</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 px-10">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === tab.id
                  ? "border-[#5856D6] text-[#5856D6]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-10 py-8 max-w-5xl mx-auto">
        {activeTab === "reports" && <ReportsTab />}
        {activeTab === "users" && <UsersTab />}
        {activeTab === "monitors" && <MonitorsTab />}
      </div>
    </div>
  );
}