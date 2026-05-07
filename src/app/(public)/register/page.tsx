"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import InputField from "../login/components/InputField";
import registerAction from "./register.action";

interface FormErrors {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function Register() {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const validate = (payload: {
    name: string; username: string; email: string;
    password: string; confirmPassword: string;
  }): FormErrors => {
    const errors: FormErrors = {};

    if (!payload.name.trim()) errors.name = "El nombre es requerido";
    else if (payload.name.trim().length < 3) errors.name = "Mínimo 3 caracteres";
    else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(payload.name)) errors.name = "Solo letras y espacios";

    if (!payload.username.trim()) errors.username = "El username es requerido";
    else if (payload.username.length < 3) errors.username = "Mínimo 3 caracteres";
    else if (!/^[a-zA-Z0-9_]+$/.test(payload.username)) errors.username = "Solo letras, números y _";

    if (!payload.email.trim()) errors.email = "El correo es requerido";
    else if (!/^[a-zA-Z0-9._%+-]+@u\.icesi\.edu\.co$/.test(payload.email))
      errors.email = "Debes usar tu correo @u.icesi.edu.co";

    if (!payload.password) errors.password = "La contraseña es requerida";
    else if (payload.password.length < 8) errors.password = "Mínimo 8 caracteres";
    else if (!/[A-Z]/.test(payload.password)) errors.password = "Debe tener al menos una mayúscula";
    else if (!/[0-9]/.test(payload.password)) errors.password = "Debe tener al menos un número";

    if (!payload.confirmPassword) errors.confirmPassword = "Confirma tu contraseña";
    else if (payload.password !== payload.confirmPassword) errors.confirmPassword = "Las contraseñas no coinciden";

    return errors;
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const formData = new FormData(formRef.current!);
    const payload = {
      name: String(formData.get("name") ?? ""),
      username: String(formData.get("username") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
      avatar: "https://i.pravatar.cc/150",
    };

    const errors = validate(payload);
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }

    setIsLoading(true);
    try {
      const result = await registerAction(payload);
      if (result.success) {
        localStorage.setItem("token", result.access_token!);
        localStorage.setItem("userEmail", payload.email);
        router.push("/feed");
      } else {
        setError(result.error || "Ocurrió un error inesperado");
      }
    } catch {
      setError("Error de conexión. Revisa el backend.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen w-full flex items-center justify-center bg-[#5454E9] relative overflow-hidden px-4 py-10"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top left",
      }}
    >
      {/* Lado izquierdo — oculto en mobile */}
      <div className="hidden md:flex w-1/2 flex-col items-center justify-center text-white z-10">
        <div className="w-36 h-36 lg:w-48 lg:h-48 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl">
          <Image src="/logo.png" alt="Icesi Logo" width={180} height={180} />
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-center leading-tight">
          Welcome to <br /> Icesi Connect
        </h1>
        <p className="text-2xl lg:text-3xl mt-6 font-semibold">¡The best Community!</p>
      </div>

      {/* Card formulario */}
      <div className="w-full md:w-1/2 flex items-center justify-center z-10">
        <div className="bg-[#F5F5F5] p-8 md:p-10 rounded-[40px] shadow-2xl w-full max-w-[480px] max-h-[90vh] overflow-y-auto">

          {/* Logo mobile */}
          <div className="flex justify-center mb-4 md:hidden">
            <div className="w-16 h-16 bg-[#5454E9] rounded-full flex items-center justify-center shadow-lg">
              <Image src="/logo.png" alt="Icesi Logo" width={40} height={40} />
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-black">
            Create your account
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm text-center">
              {error}
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-3">
            {[
              { name: "name", placeholder: "Full Name", type: "text", error: fieldErrors.name },
              { name: "username", placeholder: "Username", type: "text", error: fieldErrors.username },
              { name: "email", placeholder: "Email @u.icesi.edu.co", type: "email", error: fieldErrors.email },
              { name: "password", placeholder: "Password", type: "password", error: fieldErrors.password },
              { name: "confirmPassword", placeholder: "Confirm password", type: "password", error: fieldErrors.confirmPassword },
            ].map(({ name, placeholder, type, error }) => (
              <div key={name} className="flex flex-col gap-1">
                <InputField name={name} placeholder={placeholder} type={type} />
                {error && <p className="text-red-500 text-xs pl-1">{error}</p>}
              </div>
            ))}

            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#5454E9] text-white py-4 rounded-xl mt-2 hover:bg-[#4343d1] transition-all font-bold text-lg shadow-lg disabled:opacity-50"
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