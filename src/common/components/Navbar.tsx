"use client";
import Link from 'next/link';
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [avatar, setAvatar] = useState("/avatar.png");

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        if (!token) return;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.avatar) setAvatar(data.avatar);
        }
      } catch (error) {
        console.error("Error cargando avatar:", error);
      }
    };

    fetchAvatar();
  }, []);

  const links = [
    { label: "Pregunta", href: "/questions" },
    { label: "Comunidad", href: "/feed" },
    { label: "Monitores", href: "/monitors" },
  ];

  return (
    <nav className="w-full h-20 bg-white shadow-sm flex items-center justify-between px-10">

      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button className="text-[#5856D6] text-3xl hover:opacity-80 transition">
          ☰
        </button>
        <Link href="/feed">
          <Image
            src="/IcesiConnect.png"
            alt="Icesi Connect"
            width={160}
            height={40}
            className="object-contain"
          />
        </Link>
      </div>

      <div className="flex gap-16 font-semibold">
        {links.map(({ label, href }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`transition ${
                isActive
                  ? "text-[#5856D6] border-b-2 border-[#5856D6] pb-1"
                  : "text-gray-400 hover:text-[#5856D6]"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* RIGHT */}
      <div>
        <Link href="/profile">
          <div className="p-[3px] rounded-full border-[3px] border-[#5856D6]">
            <img
              src={avatar}
              alt="profile"
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
        </Link>
      </div>

    </nav>
  );
}