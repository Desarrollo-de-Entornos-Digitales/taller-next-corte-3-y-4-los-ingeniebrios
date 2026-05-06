"use client";

import { useRef } from "react";
import Image from "next/image";

export default function Login() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <main
    className="h-screen w-full flex items-center justify-center"
    style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top left",
        backgroundColor: "#5454E9",
      }}
    >

      {/* IZQUIERDA */}
      <div className="w-1/2 text-white flex flex-col justify-center px-20">

        <h1 className="text-6xl font-bold leading-tight">
          Welcome back to <br />
          Icesi Connect
        </h1>

        <p className="text-4xl mt-8 font-semibold">
          ¡The best <br /> Community!
        </p>
      </div>

      <div className=" flex items-center justify-center">

        <div className="bg-[#F5F5F5] p-10 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] w-[420px]">

          <h2 className="text-3xl font-bold text-center mb-10 text-black">
            Login to your account
          </h2>

          <form ref={formRef} className="flex flex-col gap-5">

            <input
            name="email"
            placeholder="Email"
            type="email"
            className="bg-transparent border border-[#6A5AE0] rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#6A5AE0] text-black"
          />

            <input
            name="password"
            placeholder="Password"
            type="password"
            className="bg-transparent border border-[#6A5AE0] rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#6A5AE0] text-black"
            />

            <button 
            type="submit" className="bg-[#5454E9] text-white py-3 rounded-lg mt-2 hover:opacity-90 transition" > Sign up </button>

          </form>

          <p className="text-center text-gray-600 mt-6 text-sm">
            - Or sign in with -
          </p>

          <div className="flex justify-center gap-4 mt-4">

          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow cursor-pointer hover:scale-105 transition">
          <Image src="/Google.png" alt="Google" width={24} height={24} />
          </div>

          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow cursor-pointer hover:scale-105 transition">
         <Image src="/microsoft.png" alt="Microsoft" width={24} height={24} />
         </div>

         <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow cursor-pointer hover:scale-105 transition">
         <Image src="/x.png" alt="X" width={24} height={24} />
         </div>

        </div>

          <p className="text-center text-sm mt-6 text-gray-600">
            Don’t have an account?{" "}
            <span className="text-purple-600 cursor-pointer hover:underline">
              Sign up
            </span>
          </p>

        </div>
      </div>

    </main>
  );
}