// Monitors Page - displays list of tutors/monitors
// Server component that fetches monitors data
import { getMonitorsAction } from "./actions/monitors.action";
import MonitoresClient from "./components/MonitoresClient";

// Monitors Page component
export default async function MonitoresPage() {
  const result = await getMonitorsAction();
  const monitors = result.error ? [] : result.data;

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

      {result.error && (
        <div className="text-center text-red-500 mt-10 text-sm font-medium bg-red-50 border border-red-100 rounded-xl p-4 max-w-md mx-auto">
          ⚠️ No se pudieron cargar los monitores.
        </div>
      )}

      {/* Client Component recibe los datos ya cargados */}
      <MonitoresClient initialMonitors={monitors} />
    </div>
  );
}
