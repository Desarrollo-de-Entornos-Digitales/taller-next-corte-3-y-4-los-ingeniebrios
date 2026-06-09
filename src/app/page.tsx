"use client";

import LogoButton from "../common/components/LogoButton";

// Home page component - serves as the entry point with logo button navigation
// Displays background image and logo button to navigate to login
export default function Home() {
  return (
    <main
      className="h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top left",
        backgroundColor: "#5454E9",
      }}
    >
      <LogoButton href="/login" />

      <p className="absolute bottom-10 text-white/40 text-sm animate-pulse font-light">
        Click on the logo to continue
      </p>
    </main>
  );
}