"use client";

export default function Navbar() {
  return (
    <nav className="w-full h-20 bg-white shadow-sm flex items-center justify-between px-10">

      {/* LEFT */}
      <div className="flex items-center gap-6">
        <button className="text-3xl">
          ☰
        </button>

        <h1 className="text-2xl font-bold text-indigo-600">
          ICESI Connect
        </h1>
      </div>

      {/* CENTER */}
      <div className="flex gap-16 font-semibold text-gray-500">
        <button>
          Pregunta
        </button>

        <button className="text-indigo-600 border-b-2 border-indigo-600 pb-1">
          Comunidad
        </button>

        <button>
          Monitores
        </button>
      </div>

      {/* RIGHT */}
      <div>
        <img
          src="https://i.pravatar.cc/150"
          alt="profile"
          className="w-12 h-12 rounded-full object-cover"
        />
      </div>
    </nav>
  );
}