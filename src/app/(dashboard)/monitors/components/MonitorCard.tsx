import { MonitorResponse } from "../services/monitor.service";

interface MonitorCardProps {
  monitor: MonitorResponse;
}

const getAvatar = (avatar: string | null | undefined, name: string) => {
  if (avatar && avatar.startsWith("data:")) return avatar;
  return `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(name)}`;
};

export default function MonitorCard({ monitor }: MonitorCardProps) {
  const studentName = monitor.student?.user?.name || "Estudiante Icesi";
  const avatarUrl = getAvatar(monitor.student?.user?.avatar, studentName);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col items-center text-center transition-all duration-200 hover:shadow-md">
      <div className="w-20 h-20 rounded-full overflow-hidden mb-4 bg-gray-100 border-2 border-indigo-100">
        <img 
          src={avatarUrl} 
          alt={studentName} 
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="font-bold text-gray-800 text-base mb-1 line-clamp-1">
        {studentName}
      </h3>

      <span className="bg-[#EBEBFF] text-[#5856D6] text-xs font-bold px-3 py-1 rounded-full mb-3 max-w-full truncate">
        {monitor.subject || "Monitor Genérico"}
      </span>

      <p className="text-xs text-gray-500 mt-auto pt-2 border-t border-gray-50 w-full line-clamp-2">
        ⏰ {monitor.availability || "Horario por definir"}
      </p>
    </div>
  );
}