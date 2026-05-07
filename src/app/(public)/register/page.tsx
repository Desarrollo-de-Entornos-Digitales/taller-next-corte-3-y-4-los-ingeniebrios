"use client";

import LeftSection from "./components/LeftSection";
import RegisterCard from "./components/RegisterCard";

export default function Register() {
  return (
    <main className="flex h-screen w-full">

      <LeftSection
        title={
          <>
            Welcome to <br /> Icesi Connect
          </>
        }
        subtitle={
          <>
            ¡The best <br /> Community!
          </>
        }
        background="/background.png"
        logo="/logo.png"
      />

      <div className="w-1/2 h-full bg-[#EDEDED] flex items-center justify-center">
        <RegisterCard
          title="Create your account"
          buttonText="Sign in"
        />
      </div>

    </main>
  );
}