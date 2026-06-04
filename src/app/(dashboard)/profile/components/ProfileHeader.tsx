"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface ProfileHeaderProps {
  user: {
    name: string;
    username: string;
    avatar: string;
    level: number;
    friends: number;
    thanks: number;
    career: string;
    semester: string;
  };
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const [career, setCareer] = useState(user.career);
  const [semester, setSemester] = useState(user.semester);

  useEffect(() => {
    if (user.career && user.career !== "Carrera no asignada") {
      setCareer(user.career);
      setSemester(user.semester);
    } else {
      const savedSetup = localStorage.getItem("userSetup");
      if (savedSetup) {
        const data = JSON.parse(savedSetup);
        setCareer(data.career);
        setSemester(`${data.semester}° Semestre`);
      }
    }
  }, [user]);

  return (
    <div className="relative mb-20">
      <div className="h-[220px] bg-[#EEF2C9] rounded-b-[40px]" />

      <div className="max-w-[1100px] mx-auto px-8 -mt-[110px]">
        <div className="flex gap-10 items-start">
          <div className="relative w-[310px]">
            {/* AVATAR */}
            <div className="absolute -top-[80px] left-1/2 -translate-x-1/2 z-20">
              <div className="w-[160px] h-[160px] rounded-full bg-white flex items-center justify-center shadow-lg">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={145}
                  height={145}
                  className="rounded-full object-cover aspect-square"
                />
              </div>
            </div>

            {/* TARJETA VERDE */}
            <div className="bg-[#D7E95D] rounded-[28px] pt-[95px] px-6 pb-6 relative">
              <button className="absolute top-5 right-5">
                <Image src="/settings.png" alt="settings" width={28} height={28} />
              </button>

              <div className="text-center">
                <h1 className="text-[24px] font-black tracking-[2px] text-[#1D1D1D] truncate px-2">
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

              {/* TARJETA DE LA CARRERA */}
              <div className="bg-[#5856D6] rounded-2xl mt-6 px-4 py-4 flex items-center justify-between">
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-white font-semibold text-sm leading-tight break-words">{career}</p>
                  <p className="text-[#D5D5FF] text-xs mt-1">{semester}</p>
                </div>
                <div className="flex-shrink-0">
                  <Image src="/birrete.png" alt="birrete" width={40} height={40} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}