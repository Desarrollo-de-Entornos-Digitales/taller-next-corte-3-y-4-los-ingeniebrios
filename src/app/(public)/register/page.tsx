"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import InputField from "../login/components/InputField"; 
import registerAction from "./register.action";

export default function Register() {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(formRef.current!);
    
    const payload = {
      name: String(formData.get("name")),
      username: String(formData.get("username")),
      email: String(formData.get("email")),
      password: String(formData.get("password")),
      confirmPassword: String(formData.get("confirmPassword")),
      roleName: String(formData.get("roleName")),
      avatar: "https://i.pravatar.cc/150", // Avatar genérico por defecto
    };

    // Validaciones básicas
    if (payload.password !== payload.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    try {
      const result = await registerAction(payload);
      
      if (result.success) {
        // Guardar en localStorage para acceso rápido en el cliente
        localStorage.setItem("token", result.access_token!);
        localStorage.setItem("userEmail", payload.email);
        router.push("/feed");
      } else {
        setError(result.error || "Ocurrió un error inesperado");
      }
    } catch (err) {
      setError("Error de conexión. Revisa el backend.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="h-screen w-full flex items-center justify-center bg-[#5454E9] relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-0 w-40 h-40">
        <Image src="/background.png" alt="pattern" width={160} height={160} priority />
      </div>

      {/* Izquierda: Branding */}
      <div className="w-1/2 flex flex-col items-center justify-center text-white z-10">
        <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl">
          <Image src="/logo.png" alt="Icesi Logo" width={120} height={120} />
        </div>
        <h1 className="text-5xl font-bold text-center leading-tight">
          Welcome to <br /> Icesi Connect
        </h1>
        <p className="text-3xl mt-6 font-semibold">¡The best Community!</p>
      </div>

      {/* Derecha: Formulario */}
      <div className="w-1/2 flex items-center justify-center z-10">
        <div className="bg-[#F5F5F5] p-10 rounded-[40px] shadow-2xl w-[480px] max-h-[90vh] overflow-y-auto">
          <h2 className="text-3xl font-extrabold text-center mb-6 text-black">Create your account</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm text-center">
              {error}
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
            <InputField name="name" placeholder="Full Name" type="text" required />
            <InputField name="username" placeholder="Username" type="text" required />
            <InputField name="email" placeholder="Email @u.icesi.edu.co" type="email" required />
            
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-400 ml-1 tracking-widest uppercase">Select Role</label>
              <select 
                name="roleName" 
                className="w-full p-3 rounded-xl border border-gray-200 bg-white text-black focus:ring-2 focus:ring-[#5454E9] outline-none text-sm transition-all"
              >
                <option value="student">Student</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <InputField name="password" placeholder="Password" type="password" required />
            <InputField name="confirmPassword" placeholder="Confirm password" type="password" required />

            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#5454E9] text-white py-4 rounded-xl mt-4 hover:bg-[#4343d1] transition-all font-bold text-lg shadow-lg disabled:opacity-50"
            >
              {isLoading ? "Signing up..." : "Sign up"}
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-gray-500">
            Already have an account?{" "}
            <span onClick={() => router.push("/login")} className="text-[#5454E9] cursor-pointer hover:underline font-bold">
              Log in
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}