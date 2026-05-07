"use client";

import Image from "next/image";

export default function Register() {
  return (
    <main className="flex h-screen w-full">

      {/* IZQUIERDA */}
      <div
        className="w-1/2 h-full flex flex-col items-center justify-center text-white"
        style={{
          backgroundImage: "url('/background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* LOGO */}
        <div className="w-44 h-44 bg-white rounded-full flex items-center justify-center mb-8">
          <Image
            src="/logo.png"
            alt="logo"
            width={100}
            height={100}
          />
        </div>

        <h1 className="text-4xl font-bold text-center leading-tight">
          Welcome to <br /> Icesi Connect
        </h1>

        <p className="text-3xl font-semibold mt-6 text-center">
          ¡The best <br /> Community!
        </p>
      </div>

      {/* DERECHA */}
      <div className="w-1/2 h-full bg-[#EDEDED] flex items-center justify-center">

        <div className="bg-[#F5F5F5] p-10 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] w-[420px]">

          <h2 className="text-2xl font-bold text-center mb-8">
            Create your account
          </h2>

          <form className="flex flex-col gap-5">

            <input
              type="email"
              placeholder="Email"
              className="bg-transparent border border-[#6A5AE0] rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#6A5AE0]"
            />

            <input
              type="password"
              placeholder="Password"
              className="bg-transparent border border-[#6A5AE0] rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#6A5AE0]"
            />

            <input
              type="password"
              placeholder="Confirm password"
              className="bg-transparent border border-[#6A5AE0] rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#6A5AE0]"
            />

            <button
              type="submit"
              className="bg-gradient-to-r from-[#5B4BDB] to-[#6A5AE0] text-white py-3 rounded-xl mt-2 font-medium"
            >
              Sign in
            </button>

          </form>

          <p className="text-center text-gray-400 mt-6 text-sm">
            - Or sign in with -
          </p>

          <div className="flex justify-center gap-5 mt-4">
            <div className="w-12 h-12 border rounded-full flex items-center justify-center bg-white shadow">G</div>
            <div className="w-12 h-12 border rounded-full flex items-center justify-center bg-white shadow">M</div>
            <div className="w-12 h-12 border rounded-full flex items-center justify-center bg-white shadow">X</div>
          </div>

          <p className="text-center text-sm mt-6">
            Don’t have an account?{" "}
            <span className="text-[#5B4BDB] font-medium cursor-pointer">
              Sign up
            </span>
          </p>

        </div>
      </div>

    </main>
  );
}