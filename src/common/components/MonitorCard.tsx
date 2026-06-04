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

interface MonitorCardProps {
  monitor: Monitor;
}

export default function MonitorCard({ monitor }: MonitorCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center gap-4 border border-gray-100 hover:shadow-lg transition-shadow duration-200">
      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
        <img
          src={monitor.student?.user?.avatar || "/monitores/default.png"}
          alt={`Avatar de ${monitor.student?.user?.name}`}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="text-center">
        <h3 className="font-bold text-gray-900 text-lg">
          {monitor.student?.user?.name}
        </h3>
        <p className="text-sm text-gray-500 mt-0.5">
          {monitor.subject}
        </p>
        <p className="text-sm text-indigo-500 font-semibold mt-0.5">
          {monitor.availability}
        </p>
      </div>

      <button className="mt-1 w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors duration-150">
        Mensaje
      </button>
    </div>
  );
}