import { MonitorResponse } from "../services/monitor.service";

interface MonitorCardProps {
  monitor: MonitorResponse;
}

export default function MonitorCard({ monitor }: MonitorCardProps) {
  // Manejo seguro de datos anidados
  const studentName = monitor.student?.user?.name || "Estudiante Icesi";
  const avatarUrl = monitor.student?.user?.avatar || "/default-avatar.png"; 

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col items-center text-center transition-all duration-200 hover:shadow-md">
      {/* Avatar circular */}
      <div className="w-20 h-20 rounded-full overflow-hidden mb-4 bg-gray-100 border-2 border-indigo-100">
        <img 
          src={avatarUrl} 
          alt={studentName} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Nombre del Monitor */}
      <h3 className="font-bold text-gray-800 text-base mb-1 line-clamp-1">
        {studentName}
      </h3>

      {/* Materia / Monitoría */}
      <span className="bg-[#EBEBFF] text-[#5856D6] text-xs font-bold px-3 py-1 rounded-full mb-3 max-w-full truncate">
        {monitor.subject || "Monitor Genérico"}
      </span>

      {/* Disponibilidad u horarios */}
      <p className="text-xs text-gray-500 mt-auto pt-2 border-t border-gray-50 w-full line-clamp-2">
        ⏰ {monitor.availability || "Horario por definir"}
      </p>
    </div>
  );
}