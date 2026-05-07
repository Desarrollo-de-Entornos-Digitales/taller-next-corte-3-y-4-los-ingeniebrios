"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import InputField from "./components/InputField";
import { loginService } from "../login/services/login.service";

export default function Login() {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    if (!/^[a-zA-Z0-9._%+-]+@u\.icesi\.edu\.co$/.test(email)) {
      setError("Debes usar tu correo institucional @u.icesi.edu.co");
      setIsLoading(false);
      return;
    }

    try {
      const data = await loginService.login(email, password);

      if (data && (data.access_token || data.token)) {
        const token = data.access_token || data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("userEmail", email);
        router.push("/feed");
      } else {
        setError("El servidor no devolvió un token.");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Credenciales incorrectas");
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
      {/* Texto izquierda — oculto en mobile */}
      <div className="hidden md:flex w-1/2 text-white flex-col justify-center px-10 lg:px-20 z-10">
        <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
          Welcome back to <br /> Icesi Connect
        </h1>
        <p className="text-2xl lg:text-4xl mt-8 font-semibold">
          ¡The best <br /> Community!
        </p>
      </div>

      {/* Card formulario */}
      <div className="flex items-center justify-center z-10 w-full md:w-1/2">
        <div className="bg-[#F5F5F5] p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-[470px]">

          {/* Logo visible solo en mobile */}
          <div className="flex justify-center mb-6 md:hidden">
            <div className="w-20 h-20 bg-[#5454E9] rounded-full flex items-center justify-center shadow-lg">
              <Image src="/logo.png" alt="Icesi Logo" width={50} height={50} />
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-black">
            Login to your account
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm text-center">
              {error}
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            <span onClick={() => router.push("/register")} className="text-[#5454E9] cursor-pointer hover:underline font-bold">
              Sign up
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}