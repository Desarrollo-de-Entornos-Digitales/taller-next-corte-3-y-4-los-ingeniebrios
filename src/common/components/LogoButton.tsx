// LogoButton Component - clickable logo button for navigation
// Client component that handles navigation on click
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

// Props interface for LogoButton component
interface LogoButtonProps {
  href: string;
  className?: string;
}

// Logo button component with hover and click animations
export default function LogoButton({ href, className = "" }: LogoButtonProps) {
  const router = useRouter();

  // Handle click event - navigate to specified href
  const handleClick = () => {
    router.push(href);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex flex-col items-center gap-6 group cursor-pointer transition-transform hover:scale-105 active:scale-95 ${className}`}
    >
      <div className="w-52 h-52 bg-white rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)]">
        <Image
          src="/logo.png"
          alt="Icesi Connect Logo"
          width={180}
          height={180}
          priority
        />
      </div>

      <h1 className="text-white text-5xl font-bold tracking-tight">
        Icesi Connect
      </h1>
    </div>
  );
}