"use client";

import Image from "next/image";

interface PostCardProps {
  title: string;
  hasProblem?: boolean;
  image?: string;
  comments?: number;
}

export default function PostCard({
  title,
  hasProblem = false,
  image,
  comments = 0,
}: PostCardProps) {
  return (
    <div className="bg-white rounded-[20px] p-4 mb-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Image
          src="/Andyprofile.png"
          alt="Andy"
          width={36}
          height={36}
          className="rounded-full object-cover"
        />
        <h3 className="text-[#5856D6] font-bold text-xs">
          ANDY — Matemáticas — Nivel 1
        </h3>
      </div>

      <p className="text-gray-800 text-sm mt-3 leading-relaxed">
        {title}
      </p>

      {hasProblem && image && (
        <div className="mt-3 rounded-xl overflow-hidden">
          <Image
            src={image}
            alt="imagen del post"
            width={600}
            height={160}
            className="w-full object-cover max-h-[160px]"
          />
        </div>
      )}

      <div className="flex justify-end mt-3">
        <div className="bg-[#F2F2F7] rounded-xl px-3 py-1.5 flex items-center gap-2">
          <span className="text-[#5856D6] text-sm font-semibold">{comments}</span>
          <Image src="/comment.png" alt="comment" width={16} height={16} />
        </div>
      </div>
    </div>
  );
}