// En el ProfileHeader, agregamos useEffect para leer los datos guardados

"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface ProfileHeaderProps {
  user?: {
    name: string;
    username: string;
    avatar?: string;
    level: number;
    friends: number;
    thanks: number;
    career: string;
    semester: string;
  };
}

export default function ProfileHeader({
  user = {
    name: "Andy",
    username: "AndyTheBeast",
    avatar: "/Andyprofile.png",
    level: 1,
    friends: 5,
    thanks: 6,
    career: "Interactive Media Design",
    semester: "First Semester",
  },
}: ProfileHeaderProps) {
  const [career, setCareer] = useState(user.career);
  const [semester, setSemester] = useState(user.semester);

  useEffect(() => {
    // Leer los datos guardados del feed
    const savedSetup = localStorage.getItem("userSetup");
    if (savedSetup) {
      const data = JSON.parse(savedSetup);
      setCareer(data.career);
      setSemester(`${data.semester}° Semestre`);
    }
  }, []);

  return (
    <div className="relative mb-20">
      {/* BACKGROUND */}
      <div className="h-[220px] bg-[#EEF2C9] rounded-b-[40px]" />

      <div className="max-w-[1100px] mx-auto px-8 -mt-[110px]">
        <div className="flex gap-10 items-start">
          <div className="relative w-[310px]">
            {/* AVATAR */}
            <div className="absolute -top-[80px] left-1/2 -translate-x-1/2 z-20">
              <div className="w-[160px] h-[160px] rounded-full bg-white flex items-center justify-center shadow-lg">
                <Image
                  src={user.avatar || "/Andyprofile.png"}
                  alt={user.name}
                  width={145}
                  height={145}
                  className="rounded-full object-cover"
                />
              </div>
            </div>

            {/* GREEN CARD */}
            <div className="bg-[#D7E95D] rounded-[28px] pt-[95px] px-6 pb-6 relative">
              <button className="absolute top-5 right-5">
                <Image src="/settings.png" alt="settings" width={28} height={28} />
              </button>

              <div className="text-center">
                <h1 className="text-[28px] font-black tracking-[3px] text-[#1D1D1D]">
                  {user.name.toUpperCase()}
                </h1>
                <p className="text-[#565656] text-sm mt-1">@{user.username}</p>
              </div>

              <div className="flex justify-between items-center mt-7">
                <div className="text-center flex-1">
                  <p className="text-sm text-[#4A4A4A] font-medium">Amigos</p>
                  <p className="font-bold text-lg text-[#2A2A2A]">{user.friends}</p>
                </div>
                <div className="w-[1px] h-10 bg-[#A9B75A]" />
                <div className="text-center flex-1">
                  <p className="text-sm text-[#4A4A4A] font-medium">Nivel</p>
                  <p className="font-bold text-lg text-[#2A2A2A]">{user.level}</p>
                </div>
                <div className="w-[1px] h-10 bg-[#A9B75A]" />
                <div className="text-center flex-1">
                  <p className="text-sm text-[#4A4A4A] font-medium">Gracias</p>
                  <p className="font-bold text-lg text-[#2A2A2A]">{user.thanks}</p>
                </div>
              </div>

              {/* CAREER - Ahora usa los datos guardados */}
              <div className="bg-[#5856D6] rounded-2xl mt-6 px-4 py-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold text-sm leading-tight">{career}</p>
                  <p className="text-[#D5D5FF] text-xs mt-1">{semester}</p>
                </div>
                <Image src="/birrete.png" alt="birrete" width={40} height={40} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}