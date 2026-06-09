"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import InputField from "./components/InputField";
import loginAction from "./login.action";

export default function Login() {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    if (!email.endsWith("@u.icesi.edu.co")) {
      setErrorMessage("Acceso denegado: Debes usar tu correo institucional @u.icesi.edu.co");
      setIsLoading(false);
      return;
    }

    const result = await loginAction(email, password);

    if (result.error) {
      setErrorMessage(result.message || "Credenciales incorrectas o error en el servidor");
      setIsLoading(false);
    } else {
      // Limpiar setup anterior para que cada usuario pase por su propio flujo
      localStorage.removeItem("userSetup");

      if (result.userId) localStorage.setItem("userId", result.userId.toString());
      if (result.studentId) localStorage.setItem("studentId", result.studentId.toString());
      if (result.data?.access_token) localStorage.setItem("token", result.data.access_token);

      const token = result.data?.access_token;
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const permissions: string[] = payload.permissions ?? [];

        if (permissions.includes("manage_users")) {
          // Admin → setup no necesario, directo al feed
          localStorage.setItem("userSetup", JSON.stringify({ hasSetup: true }));
          window.location.href = "/feed";
        } else {
          // Estudiante → va al setup para configurar carrera y semestre
          window.location.href = "/setup";
        }
      } else {
        window.location.href = "/setup";
      }
    }
  };

  return (
    <main
      className="h-screen w-full flex items-center justify-center bg-[#5454E9] relative overflow-hidden"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top left",
      }}
    >
      <div className="w-1/2 text-white flex flex-col justify-center px-20 z-10">
        <h1 className="text-6xl font-bold leading-tight">
          Welcome back to <br />
          Icesi Connect
        </h1>
        <p className="text-4xl mt-8 font-semibold">
          ¡The best <br /> Community!
        </p>
      </div>

      <div className="flex items-center justify-center z-10">
        <div className="bg-[#F5F5F5] p-10 rounded-3xl shadow-2xl w-[470px]">
          <h2 className="text-3xl font-bold text-center mb-6 text-black">
            Login to your account
          </h2>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm font-semibold rounded-xl text-center">
              {errorMessage}
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
            <InputField name="email" placeholder="Email @u.icesi.edu.co" type="email" required />
            <InputField name="password" placeholder="Password" type="password" required />

            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#5454E9] text-white py-3 rounded-lg mt-2 hover:opacity-90 transition font-bold text-lg disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6 text-sm">- Or sign in with -</p>

          <div className="flex justify-center gap-4 mt-4">
            {["/Google.png", "/microsoft.png", "/x.png"].map((src, i) => (
              <div key={i} className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow cursor-pointer hover:scale-105 transition">
                <Image src={src} alt="Social" width={24} height={24} />
              </div>
            ))}
          </div>

          <p className="text-center text-sm mt-6 text-gray-600">
            Don't have an account?{" "}
            <span
              onClick={() => router.push("/register")}
              className="text-[#5454E9] cursor-pointer hover:underline font-bold"
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}