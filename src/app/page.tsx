"use client";

import Image from "next/image";

export default function Home() {
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
      <div className="w-full max-w-6xl flex items-center justify-between px-20">

        {/* IZQUIERDA */}
        <div className="flex flex-col items-center text-white">
          <div className="w-60 h-60 bg-white rounded-full flex items-center justify-center mb-8">
            <Image src="/logo.png" alt="logo" width={300} height={100} />
          </div>

          <h1 className="text-6xl font-bold text-center">
            Welcome to <br /> Icesi Connect
          </h1>

          <p className="text-4xl font-semibold mt-6 text-center">
            ¡The best <br /> Community!
          </p>
        </div>

        {/* DERECHA (CARD) */}
        <div className="flex items-center justify-center">
          <div className="bg-[#F5F5F5] p-10 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] w-[470px]">

            <h2 className="text-2xl font-bold text-center mb-8 text-black">
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

            <p className="text-center text-gray-600 mt-6 text-sm">
              - Or sign in with -
            </p>

            <div className="flex justify-center gap-5 mt-4">

  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow cursor-pointer">
    <Image src="/Google.png" alt="Google" width={24} height={24} />
  </div>

  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow cursor-pointer">
    <Image src="/microsoft.png" alt="Microsoft" width={24} height={24} />
  </div>

  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow cursor-pointer">
    <Image src="/x.png" alt="X" width={24} height={24} />
  </div>

</div>

            <p className="text-center text-sm mt-6 text-gray-600">
              Don’t have an account?{" "}
              <span className="text-[#5B4BDB] font-medium cursor-pointer">
                Sign up
              </span>
            </p>

          </div>
        </div>

      </div>
    </main>
  );
}