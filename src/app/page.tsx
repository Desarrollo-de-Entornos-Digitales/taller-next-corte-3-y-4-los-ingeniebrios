"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-5xl font-bold">Welcome</h1>

      <button
        onClick={() => router.push("/login")}
        className="btn btn-primary mt-6"
      >
        Go to Login
      </button>
    </main>
  );
}