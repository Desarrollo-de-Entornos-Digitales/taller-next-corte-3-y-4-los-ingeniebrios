"use client";

import { useState } from "react";

interface User {
  id: number;
  name: string;
  username: string;
  institutional_email: string;
  is_active?: boolean; 
  role: { name: string };
}

const getToken = () =>
  document.cookie.split("; ").find(r => r.startsWith("token="))?.split("=")[1]
  ?? localStorage.getItem("token");

export default function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      headers: { Authorization: `Bearer ${getToken()}` },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
      setFetched(true);
    }
    setLoading(false);
  };

  const disableUser = async (id: number, name: string) => {
    if (!confirm(`¿Estás seguro de que deseas deshabilitar a ${name}? Su cuenta perderá acceso al sistema.`)) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
        method: "DELETE", // Se mantiene el método configurado en el controlador
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      
      if (res.ok) {
        // En lugar de borrarlo del arreglo local, actualizamos su propiedad is_active a false
        setUsers(prev =>
          prev.map(u => (u.id === id ? { ...u, is_active: false } : u))
        );
        alert(`Usuario ${name} deshabilitado correctamente.`);
      } else {
        alert("No se pudo deshabilitar el usuario. Verifica los permisos del administrador.");
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error en la comunicación con el servidor.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Gestión de usuarios</h2>
          <p className="text-sm text-gray-400">Consulta y deshabilita cuentas de usuarios</p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="bg-[#5856D6] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#4644c4] transition disabled:opacity-60"
        >
          {loading ? "Cargando..." : "Cargar usuarios"}
        </button>
      </div>

      {fetched && (
        <div className="flex flex-col gap-3">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex justify-between items-center">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-gray-800 text-sm">{user.name}</p>
                  
                  {/* Etiqueta dinámica según el estado del usuario */}
                  {user.is_active === false ? (
                    <span className="bg-red-100 text-red-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      INACTIVO
                    </span>
                  ) : (
                    <span className="bg-green-100 text-green-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      ACTIVO
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-gray-400">@{user.username} · {user.institutional_email}</p>
                
                <span className={`text-xs font-bold mt-1 w-fit px-2 py-0.5 rounded-full ${
                  user.role?.name === "admin"
                    ? "bg-purple-100 text-purple-600"
                    : user.role?.name === "moderator"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-500"
                }`}>
                  {user.role?.name ?? "student"}
                </span>
              </div>
              
              {/* Ocultamos el botón si el rol es admin o si el usuario ya está inactivo */}
              {user.role?.name !== "admin" && user.is_active !== false && (
                <button
                  onClick={() => disableUser(user.id, user.name)}
                  className="bg-red-50 text-red-500 text-xs font-bold px-4 py-2 rounded-xl hover:bg-red-100 transition"
                >
                Deshabilitar
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}